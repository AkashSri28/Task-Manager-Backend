const express = require('express')
const router = express.Router()

//Define the routes

//Get all cards
router.get('/', (req, res)=>{
    res.send({message:"Hello"})
})

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  // Save the user to the database
  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering new user');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if the user exists
  if (!user) {
    res.status(401).send('Invalid username or password');
    return;
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    res.status(401).send('Invalid username or password');
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, 'secret');

  // Send the token in the response
  res.status(200).json({ token });
});

// Create a new card
router.post('/boards/:boardId/lists/:listId/cards', async (req, res) => {
    const { boardId, listId } = req.params;
    const { title, description } = req.body;
  
    try {
      const board = await Board.findById(boardId);
      const list = await List.findById(listId);
  
      if (!board || !list) {
        res.status(404).send('Board or list not found');
        return;
      }
  
      const newCard = new Card({
        title,
        description,
      });
  
      await newCard.save();
  
      list.cards.push(newCard);
      await list.save();
  
      res.status(201).json(newCard);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating card');
    }
  });
  
  // Get a card by ID
  router.get('/boards/:boardId/lists/:listId/cards/:cardId', async (req, res) => {
    const { boardId, listId, cardId } = req.params;
  
    try {
      const board = await Board.findById(boardId);
      const list = await List.findById(listId);
  
      if (!board || !list) {
        res.status(404).send('Board or list not found');
        return;
      }
  
      const card = await Card.findById(cardId);
  
      if (!card) {
        res.status(404).send('Card not found');
        return;
      }
  
      res.status(200).json(card);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting card');
    }
  });
  
  // Update a card by ID
  router.put('/boards/:boardId/lists/:listId/cards/:cardId', async (req, res) => {
    const { boardId, listId, cardId } = req.params;
    const { title, description } = req.body;
  
    try {
      const board = await Board.findById(boardId);
      const list = await List.findById(listId);
  
      if (!board || !list) {
        res.status(404).send('Board or list not found');
        return;
      }
  
      const card = await Card.findByIdAndUpdate(cardId, { title, description }, { new: true });
  
      if (!card) {
        res.status(404).send('Card not found');
        return;
      }
  
      res.status(200).json(card);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating card');
    }
  });
  
  // Delete a card by ID
  router.delete('/boards/:boardId/lists/:listId/cards/:cardId', async (req, res) => {
    const { boardId, listId, cardId } = req.params;
  
    try {
      const board = await Board.findById(boardId);
      const list = await List.findById(listId);
  
      if (!board || !list) {
        res.status(404).send('Board or list not found');
        return;
      }
  
      const card = await Card.findByIdAndDelete(cardId);
  
      if (!card) {
        res.status(404).send('Card not found');
        return;
      }
  
      list.cards.pull(card);
      await list.save();
  
      res.status(200).send('Card deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting card');
    }
  });


module.exports = router