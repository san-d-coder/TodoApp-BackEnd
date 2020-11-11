/* --- Configuration --- */
require('dotenv').config();

/* --- Imports --- */
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

/* --- Application Setup --- */

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

/* --- Database Connection --- */

mongoose.connect(
    process.env.DBConnectionString,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
)

const dbConnection = mongoose.connection
//Error Handling
dbConnection.on('error',(error)=>console.log(error))
//Connection Prompt
dbConnection.once('open',()=>console.log('Connected to the Database Server'))

/* --- Routes --- */

//Default Route

app.get('/', (req,res)=>{
    res.send('Listening')
})

//TodoListRoute

const toDoRouter = require('./Routes/todolist');
app.use('/todolist',toDoRouter);

//Users Route

const userRouter = require('./Routes/users');
app.use('/users',userRouter);

/*--- Start the app --- */

//Define Port Number
port = process.env.Port

//Start the application
app.listen(port, 
    ()=> console.log('Server Started')
)

//Prompt on the console
console.log('Listening on localhost:', port);