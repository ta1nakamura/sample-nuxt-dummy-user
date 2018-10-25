require("../config/config.js")
const { ObjectID } = require("mongodb")
// const { mongoose } = require("../db/mongoose")
require("../db/mongoose")
const { Todo } = require("../models/todo")

const userOneId = new ObjectID()

// careate todos[]
const todos = [
  {
    _id: new ObjectID(),
    text: "First test tod",
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: "Second test tod",
    completed: true,
    completedAt: 333,
    _creator: userOneId
  }
]
// remove all and Create todos[] and find
Todo.remove({}).then(() => {
  Todo.insertMany(todos).then(() => {
    Todo.find({}).then(todos => {
      console.log("Todos", todos)
    })
  })
})
