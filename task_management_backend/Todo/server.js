const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "todoapp";
const bcrypt = require("bcrypt");
const { UserModel, TodoModel } = require("./db");
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ankitdev:Q2kGh4eguXwRZ4jF@cluster0.fpc4m.mongodb.net/Todo-app-database");

const app = express();

app.use(express.json());

//signup
app.post('/signup', async (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 100);

    await UserModel.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    res.json({
        message: "You have signed up!"
    })
})

//signin
app.post('/signin', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    })
    
    if(response){
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);

        res.json({
            token
        })

    }else{
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
})

//auth middleware
const auth = (req,res,next) =>{
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const username = decodedToken.username;

    if(email){
        req.username = username;
        next();
    }else{
        res.json({
            message: "You are not logged in"
        })
    }
}

//get signed in user Info
app.get('/user', auth, (req, res)=>{
    const user = users.find(user => user.username === req.username);
    if(user){
        res.json({
            username : user.username
        })
    }else{
        res.json({
            message: `cannot find ${username}`
        })
    }
})

// CRUD operation for todo

const todos = [];

// create a task
app.post('/createTodo', auth, (req, res) => {
    const title = req.body.title;
    const newTodo = {
        id: todos.length+1,
        username: req.username,
        title,
        isCompleted: false
    };
    todos.push(newTodo);
    console.log(todos);
    res.json(newTodo);
})
//Get all task
app.get('/getTodo', auth, (req, res)=>{
    const userTodo = todos.filter(todos => todos.username === req.username);
    res.json(userTodo);
})
//delete a task
app.delete('/deleteTodo/:id', auth, (req, res) =>{
    const todoIndex = todos.findIndex(todo => todo.username === req.username && todo.id === parseInt(req.params.id));
    if(todoIndex === -1){
        res.status(404).json({
            message: "Todo not found"
        })
    }

    todos.splice(todoIndex, 1);
    res.json({
        message: 'Deleted!'
    })
})
//Update a task
app.put('/update/:id', auth, (req, res)=>{
    const todoId = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === todoId && todo.username === req.username);

    if(req.body.title){
        todo.title = req.body.title;
    }
    if(req.body.isCompleted !== undefined){
        todo.isCompleted = req.body.isCompleted;
    }
    res.json(todo);
})

app.listen(3001);