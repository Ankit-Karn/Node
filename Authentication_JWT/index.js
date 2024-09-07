const express = require("express");

const jwt = require("jsonwebtoken");

const JWT_SECRET = "iamankitkarn";

const app = express();

app.use(express.json());

const users = [];

//post request for signup
app.post('/signup', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })
    
    res.json({
        message: "You have signed in"
    })

    console.log(users);
});

//post request for signin
app.post('/signin', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);
    console.log(user);
    if(user){
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);
        
        res.send({
            token
        });
    }else{
        res.status(403).send({
            message: 'Invalid username or password'
        })
    }

    console.log(users);
});

//Get request to get me
app.get("/me", function(req, res){
    const token = req.headers.token;
    const decryptedInfo = jwt.verify(token, JWT_SECRET);
    const username = decryptedInfo.username;

    const user = users.find(user => user.username === username);
    if(user){
        res.json({
            username: user.username
        })
    }else{
        res.status('403').json({
            message: `cannot find ${username}`
        })
    }
})

app.listen(3000);