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
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        res.json({
            message: "You have signed up!"
        })
    }catch(e){
        res.status(404).json({
            message: "Error while signing up"
        })
    }
})

//signin
app.post('/signin', async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({
            email
        })
        const passwordMatch = bcrypt.compare(password, user.password);
        if(user && passwordMatch){
            const token = jwt.sign({
                id: user._id.toString()
            }, JWT_SECRET)

        res.json({
                token
            })
        }
    }catch(e){
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

//auth middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization;
    const decodedUserId = jwt.verify(token, JWT_SECRET);

    if(decodedUserId){
        req.userId = decodedUserId.id;
        next();
    }else{
        res.status(403).json({
            message: "Wrong credentials"
        })
    }
}

//create todo
app.post('/todo', auth, async (req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    })

    res.json({
        message: `Todo created `
    })
})

//get todos
app.get('/todos', auth, async (req, res)=> {
    const userId = req.userId;

    const todo = await TodoModel.find({userId});

    res.json({
        todo
    })
})

app.listen(3001);