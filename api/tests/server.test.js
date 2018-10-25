const expect = require("expect")
const request = require("supertest")
// const { ObjectID } = require("mongodb")
require("mongodb")

const { path, app } = require("./../apptest")
const { Todo } = require("./../models/todo")
const { LineUser } = require("../models/lineuser")
const {
  todos,
  populateTodos,
  lineusers,
  populateLineusers
} = require("./seed/seed")

beforeEach(populateTodos)
beforeEach(populateLineusers)

describe("Get Test /test/:id", () => {
  it("should work [it]", done => {
    done()
  })
  it("[async] should get id", async () => {
    let res = await request(app)
      .get(path + "/test/3")
      .expect(200)
    expect(res.body.message).toBeTruthy() //exsist
    // throw new Error('--error test in mocha')
  })
})

describe("GET /todos", () => {
  it("[async] should get all todos", async () => {
    let res = await request(app)
      .get(path + "/todos")
      .set("x-auth", lineusers[0].token)
      .expect(200)
    expect(res.body.todos.length).toBe(1)
  })
})

describe("POST /todos", () => {
  // async/await version
  it("[async] should create a new todo", async () => {
    var text = "[async] Test todo text"
    let res = await request(app)
      .post(path + "/todos")
      .set("x-auth", lineusers[0].token)
      .send({ text })
      .expect(200)
    expect(res.body.text).toBe(text)

    let todos = await Todo.find({ text })
    expect(todos.length).toBe(1)
    expect(todos[0].text).toBe(text)
  })
})

describe("GET /todos/:id", () => {
  it("[async] should return todo doc", async () => {
    let res = await request(app)
      .get(path + `/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", lineusers[0].token)
      .expect(200)
    expect(res.body.todo.text).toBe(todos[0].text)
  })
})

describe("DELETE /todos/:id", () => {
  it("[async] should remove a todo", async () => {
    var hexId = todos[1]._id.toHexString()
    let res = await request(app)
      .delete(path + `/todos/${hexId}`)
      .set("x-auth", lineusers[1].token)
      .expect(200)
    expect(res.body.todo._id).toBe(hexId)

    let todo = await Todo.findById(hexId)
    // expect(todo).toNotExist();
    expect(todo).toBeFalsy()
  })
})

describe("PATCH /todos/:id", () => {
  it("[async] should update the todo", async () => {
    var hexId = todos[0]._id.toHexString()
    var text = "This should be the new text"
    let res = await request(app)
      .patch(path + `/todos/${hexId}`)
      .set("x-auth", lineusers[0].token)
      .send({ completed: true, text })
      .expect(200)

    expect(res.body.todo.text).toBe(text)
    expect(res.body.todo.completed).toBe(true)
    expect(typeof res.body.todo.completedAt).toBe("number")
  })
})

//=======Lineuser DummyLogin ====//
describe("GET /dummylogin/:lineuserid", () => {
  it("[async] should create a new lineuser", async () => {
    let new_lineuserid = "new001"
    let res = await request(app)
      // .get(path + `/dummylogin/${new_lineuserid}`)
      .post(path + `/dummylogin/`)
      .send({ lineuserid: new_lineuserid })
      .expect(200)
    expect(res.body.lineuser.lineuserid).toBe(new_lineuserid)

    let db_lineusers = await LineUser.find({ lineuserid: new_lineuserid })
    expect(db_lineusers.length).toBe(1)
    expect(db_lineusers[0].lineuserid).toBe(new_lineuserid)
  })
  it("[async] should update a same lineuser", async () => {
    // let new_lineuserid = 'new001'
    let res = await request(app)
      // .get(path + `/dummylogin/${lineusers[0].lineuserid}`)
      .post(path + `/dummylogin/`)
      .send({ lineuserid: lineusers[0].lineuserid })
      .expect(200)
    expect(res.body.lineuser.lineuserid).toBe(lineusers[0].lineuserid)

    let db_lineusers = await LineUser.find({
      lineuserid: lineusers[0].lineuserid
    })
    expect(db_lineusers.length).toBe(1)
    expect(db_lineusers[0].lineuserid).toBe(lineusers[0].lineuserid)
  })
})
