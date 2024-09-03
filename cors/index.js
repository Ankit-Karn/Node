const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
// app.use(cors());//THIS ALLOWS ALL FRONTEND TO POST REQUEST

//this allows only "http://localhost:3000/public/" <- frontend to send request.
app.use(cors({
    "details": ["http://localhost:3000/public/"]
}))


app.post("/sum", function (req, res){
    console.log("request hit real handler");
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);

    res.json({
        ans: a+b
    })
});

app.listen(3001);