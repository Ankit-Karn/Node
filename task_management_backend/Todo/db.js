const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const User = new schema({
    name: String,
    email: {type: String, unique: true},
    password: String
});

const Todo = new schema({
    userId: ObjectId,
    title: String,
    done: Boolean
})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}
