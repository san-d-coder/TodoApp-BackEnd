const mongoose = require('mongoose');

/* --- Define the Schema --- */

const todoSchema = new mongoose.Schema(
    {
        
        name:{
            type: String,
            required: true
        },

        username:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },

        current:{
            type: Boolean,
            default: true
        },

        deleted:{
            type: Boolean,
            default: false
        },
        
        dueDate:{
            type: Date,
            required: true
        },

        createdOn:
        {
            type: Date,
            default: Date.now
        }
    }
)

/* --- Define the Collection --- */

module.exports = mongoose.model('Todo',todoSchema)