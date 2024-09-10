const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "kuchbhi";

const app = express();

app.use(express.json());

const users = [];

//get homepage
app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

//auth middleware
const auth = (req, res, next) =>{
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token, JWT_SECRET);
    const username = decodedInfo.username;

    if(username){
        req.username = username;
        next();
    }else{
        res.json({
            message: "you are not logged in"
        })
    }
}

//signup
app.post('/signup', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username,
        password
    })

    res.json({
        message: "You signed up!"
    })
})

//signin 
app.post('/signin', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);

    if(!user){
        res.json({
            message:"User not found"
        })
    }

    if(user){
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);

        res.json({
            token
        })
    }else{
        res.status(404).json({
            message: "Invalid username"
        })
    }
})

//get me
app.get("/me", auth, (req, res)=>{
    console.log(req.username);
    const user = users.find(user => user.username === req.username);

    if(user){
        res.json({
            username: user.username
        })
    }else{
        res.json({
            message: `cannot find ${username}` 
        })
    }
})

app.listen(3000);