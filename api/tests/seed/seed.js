const { ObjectID } = require("mongodb")
// const jwt = require("jsonwebtoken")
require("../../config/config.js")
const { Todo } = require("./../../models/todo")
const { LineUser } = require("./../../models/lineuser")
const jwt = require("jsonwebtoken")

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

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
    _creator: userTwoId
  }
]
const lineusers = [
  {
    _id: userOneId,
    lineuserid: "dummy0001",
    displayname: "Dummy-001",
    isfollow: true,
    lastupdate: new Date().getTime(),
    token: jwt
      .sign({ sub: "dummy0001", name: "Dummy-001" }, process.env.JWT_SECRET)
      .toString()
  },
  {
    _id: userTwoId,
    lineuserid: "dummy0002",
    displayname: "Dummy-002",
    isfollow: true,
    lastupdate: new Date().getTime(),
    token: jwt
      .sign({ sub: "dummy0002", name: "Dummy-002" }, process.env.JWT_SECRET)
      .toString()
  }
]
const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos)
    })
    .then(() => done())
}
const populateLineusers = async () => {
  await LineUser.remove({})
  await LineUser.insertMany(lineusers)
}

module.exports = {
  todos,
  populateTodos,
  lineusers,
  populateLineusers
}
