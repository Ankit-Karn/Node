const express = require("express");
const cors = require("cors");
// const path = require('path');

const app = express();

app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));

let counter = 0;

app.use((req, res, next)=>{
    counter++;
    next();
});

app.get("/getCount", function(req, res){
    res.json({count: counter});
});

app.listen(3001, ()=>{console.log("server started")});