const express = require("express");

const app = express();

let requestCount = 0;

function requestIncreaser(req, res, next){
    requestCount++;
    console.log("request hit: " + requestCount);
    //this code will restrict the real handler to provide the info
    res.json({
        "message": "Middleware"
    });
    
    //this will not restrict
    // next(); 
}

function sum(req,res){
    console.log("control reached to sum handler");
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    //response handler
    res.json({
        ans: a+b
    });
}

function multiply(req, res){
    console.log("control reached to multiply handler");
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a*b
    });
}

app.use(requestIncreaser); //this use() is used to apply this requestIncreaser middleware to each and every request written below. 

app.get("/sum", sum);
app.get("/mul", multiply);

app.listen(3000);