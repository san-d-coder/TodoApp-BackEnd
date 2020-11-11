/* --- Imports --- */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../Models/Todo');

/* --- Routes --- */

//Get All
router.get('/', verifyToken, async (req, res) => {
    console.log('Get TodoList Called')
    try {
        const todoList = await Todo.find();
        res.status(200).json(todoList)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get Current

router.get('/current', verifyToken, async (req, res) => {
    console.log('Get Current TodoList');

    try {
        Todo.find({ username: req.username, current: true }, (error, currentTodoList) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: error.message })
            } else
                if (!currentTodoList) {
                    res.status(404).json({ message: 'Todos not found' })
                }
                else {
                    res.status(200).json(currentTodoList)
                }
        }
        )
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//Get Completed

router.get('/completed', verifyToken, async (req, res) => {
    console.log('Get Current TodoList');
    try {
        Todo.find({ username: req.username, current: false, deleted: false }, (error, completedTodoList) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: error.message })
            } else
                if (!completedTodoList) {
                    res.status(404).json({ message: 'Todos not found' })
                }
                else {
                    res.status(200).json(completedTodoList)
                }
        }
        )
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get Deleted

router.get('/deleted', verifyToken, async (req, res) => {
    console.log('Get Current TodoList');
    try {
        Todo.find({ username: req.username, deleted: true }, (error, deletedTodoList) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: error.message })
            } else
                if (!deletedTodoList) {
                    res.status(404).json({ message: 'Todos not found' })
                }
                else {
                    res.status(200).json(deletedTodoList)
                }
        }
        )
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get Count

router.get('/count', verifyToken, async (req, res) => {
    console.log('Get Count Called')
    try {
        const count = await Todo.countDocuments((err, count) => {
            if (err) {
                console.log(err)
                res.status(500).json({ message: err.message })
            } else
                if (!count) {
                    res.status(404).json({ message: 'Todo not found' })
                }
                else {
                    res.status(200).json(count)
                }
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get One
router.get('/:id', verifyToken, searchTodo, (req, res) => {
    console.log('Get One Called')
    res.status(200).json(res.todo)
})

//Edit One
router.patch('/:id', verifyToken, searchTodo, async (req, res) => {
    console.log('Edit one called')
    if (req.body.name != null) {
        res.todo.name = req.body.name
    }
    if (req.body.description != null) {
        res.todo.description = req.body.description
    }
    if (req.body.current != null) {
        res.todo.current = req.body.current
    }
    if (req.body.deleted != null) {
        res.todo.deleted = req.body.deleted
    }
    if (req.body.dueDate != null) {
        res.todo.dueDate = req.body.dueDate
    }

    try {
        await res.todo.save()
        res.status(200).json({ message: 'Todo Modified' })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})

//Delete One
router.delete('/:id', verifyToken, searchTodo, async (req, res) => {
    console.log('Delete one called')
    try {
        await res.todo.remove()
        res.status(200).json({ message: 'Todo deleted' })
    }
    catch (err) {
        res.status(200).json({ message: err.message })
    }
})

//Create One
router.post('/', verifyToken, async (req, res) => {
    console.log('Create One Called')
    //Instance
    const todo = new Todo({
        name: req.body.name,
        username: req.username,
        description: req.body.description,
        dueDate: req.body.dueDate
    })
    try {
        //Save
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

/* --- Middleware --- */

async function searchTodo(req, res, next) {

    try {
        await Todo.find({ username: req.username, _id: req.params.id }, (error, todo) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: error.message })
            } else
                if (!todo) {
                    res.status(404).json({ message: 'Todo not found' })
                }
                else {
                    res.todo = todo[0]
                    next()
                }
        })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

/* --- Route Guard --- */

function verifyToken(req, res, next) {
    console.log('Verify Token Called')
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized request' })
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).json({ message: 'Unauthorized request' })
    }
    try {
        let payload = jwt.verify(token, 'secretKey')
        req.username = payload.subject
        next()
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = router;