const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken')

//Get all users

router.get('/', async (req, res) => {
    console.log('Get all users called');
    try {
        const users = await User.find();
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Check User

router.get('/check/:username', async (req,res)=>{
    console.log('Check user called')
    
    try{
        await User.find({username:req.params.username},(err,user)=>{
            if(err){
                res.status(500).json({message: err.message})
            }
            else if(user[0]){
                console.log('User Found')
                res.send(false)
            }
            else{
                console.log('User not found')
                res.send(true)
            }
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

//Create User
router.post('/', async (req, res) => {
    console.log('Create User called');
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Login

router.post('/login', (req, res) => {

    console.log('Login Called')

    let userData = req.body

    User.findOne({ username: userData.username }, (error, user) => {
        if (error) {
            console.log(error)
            res.status(500).send({ message: error.message })
        } else
            if (!user) {
                res.status(404).send('Not Found')
            } else
                if (user.password !== userData.password) {
                    res.status(401).send('Unauthorized')
                }
                else {
                    let payLoad = { subject: user._id }
                    let token = jwt.sign(payLoad, 'secretKey')
                    res.status(200).send({ token })
                }
    })
})

module.exports = router;