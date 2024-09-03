const express = require('express');

const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

//get all todos
app.get('/todos', (req,res)=>{
    res.json(todos);
})

//create a new todo
app.post('/todos', (req,res)=>{
    const {task} = req.body;
    if(!task){
        return res.status(400).json({error: "no task provided"});
    }else{
        const newTodo = {id: nextId++, task, completed:false};
        todos.push(newTodo);
        return res.status(200).json(newTodo);
    }
});

//update a todo
app.put('/todos/:id', (req,res)=>{
    const {id} = req.params;
    const {task, completed} = req.body;
    const todo = todos.find(todo => todo.id === parseInt(id));

    if(!todo){
        return res.status(400).json({error:"todo not found"});
    }

    if(task !== undefined){
        todo.task = task;
    }

    if(completed !== undefined){
        todo.completed = completed;
    }

    res.json(todo);
})

// delete a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todoId = parseInt(id, 10);

    console.log(`Deleting todo with id: ${todoId}`);
    todos = todos.filter(todo => todo.id !== todoId);
    console.log('Updated todos:', todos);

    res.status(204).end();
});


app.listen(3000, ()=>{console.log("server started")});