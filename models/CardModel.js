const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    priority:{
        type: String,
        required: true
    },
    tasks:[{
        id: Number,
        title: String,
        completed: Boolean
    }],
    column:{
        type: String,
        default: "To do"
    },
    dueDate:Date,
    user_id:{
        type: String,
        required: true
    }
}, {timestamps: true})


module.exports = mongoose.model('Card', cardSchema)