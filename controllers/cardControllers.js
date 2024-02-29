const { default: mongoose } = require('mongoose')
const Card = require('../models/cardModel')

//Get all cards
const getAllCards = async (req, res)=>{
    const cards = await Card.find({}).sort({createdAt:-1})

    res.status(200).json(cards)
}

//Get a specific card
const getCard = async (req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such card exists"})
    }

    const card = await Card.findById(id)
    if(!card){
        return res.status(404).json({error:"No such card"})
    }
    res.status(200).json(card)
}

//Create a card
const createCard = async (req, res)=>{
    const {title, priority, tasks, dueDate} = req.body;
    try {
        const card = await Card.create({
            title, priority, tasks, dueDate
        })
        res.status(200).json(card)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

//Delete a card
const deleteCard = async (req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such card exists"})
    }

    const card = await Card.findOneAndDelete({_id:id});
    
    if(!card){
        return res.status(404).json({error:"No such card"})
    }

    res.status(200).json(card)
}

//Update a card
const updateCard = async (req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such card exists"})
    }

    const card = await Card.findOneAndUpdate({_id:id}, 
        {...req.body}
    )

    if(!card){
        return res.status(404).json({error:"No such card"})
    }

    res.status(200).json(card)
}

//exports
module.exports = {
    createCard,
    getAllCards,
    getCard, 
    deleteCard, 
    updateCard
}