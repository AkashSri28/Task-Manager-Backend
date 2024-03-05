// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cardRoutes = require('./routes/cards')
const userRoutes = require('./routes/user')

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    // Listen for requests
    app.listen(process.env.PORT, () => {
    console.log('Connected to DB, Sever is running on port 5000');
    console.group(process.env.PORT);
  });
})
.catch((error)=>{
    console.log(error)
})

// Define the schema for the User model
// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });
// const User = mongoose.model('User', userSchema);

// Define the schema for the Board model
// const boardSchema = new mongoose.Schema({
//   title: String,
//   lists: [{
//     title: String,
//     cards: [{
//       title: String,
//       description: String,
//     }],
//   }],
// });
// const Board = mongoose.model('Board', boardSchema);


// Define the schema for the List model
// const listSchema = new mongoose.Schema({
//   title: String,
//   cards: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Card',
//   }],
// });
// const List = mongoose.model('List', listSchema);

// Routes
app.use('/api/cards', cardRoutes);
app.use('/api/user', userRoutes);


