const expect = require("expect")
const request = require("supertest")
const { ObjectID } = require("mongodb")

const { path, app } = require("./../apptest")
const { Todo } = require("./../models/todo")
const { User } = require("./../models/user")
const { todos, populateTodos, users, populateUsers } = require("./seed/seed")

beforeEach(populateUsers)
beforeEach(populateTodos)

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Test todo text"

    request(app)
      .post(path + "/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end(err => {
        if (err) {
          return done(err)
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })

  it("should not create todo with invalid body data", done => {
    request(app)
      .post(path + "/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end(err => {
        if (err) {
          return done(err)
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2)
        })
        done()
      })
    // }).catch((e) => done(e)); // error?
  })
})
describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get(path + "/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        // console.log(res.body)
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
})

describe("GET /todos/:id", () => {
  it("should return todo doc", done => {
    // console.log('testdata:', todos[0]._id.toHexString())
    request(app)
      .get(path + `/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
  it("shold return 404 it todo not found", done => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .get(path + `/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
  it("shold return 404 for non-object ids", done => {
    request(app)
      .get(path + `/todos/123abc`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(400)
      .end(done)
  })
  it("should not return todo doc creat by other user", done => {
    // console.log('testdata:', todos[0]._id.toHexString())
    request(app)
      .get(path + `/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    var hexId = todos[1]._id.toHexString()
    request(app)
      .delete(path + `/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end(err => {
        if (err) {
          return done(err)
        }
        //query database using findById to NotExot
        //expect(null).toNotExist;
        Todo.findById(hexId)
          .then(todo => {
            // expect(todo).toNotExist();
            expect(todo).toBeFalsy()
            done()
          })
          .catch(e => done(e))
      })
  })
  it("should not remove a todo by other user", done => {
    var hexId = todos[0]._id.toHexString()
    request(app)
      .delete(path + `/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(err => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId)
          .then(todo => {
            // expect(todo).toExist();
            expect(todo).toBeTruthy()
            done()
          })
          .catch(e => done(e))
      })
  })

  it("should return 404 if todo not found ", done => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .delete(path + `/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it("should return 404 if ObjectID is invalid", done => {
    request(app)
      .delete(path + `/todos/123abc`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    var hexId = todos[0]._id.toHexString()
    var text = "This should be the new text"
    request(app)
      .patch(path + `/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({ completed: true, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        // expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof res.body.todo.completedAt).toBe("number")
      })
      .end(done)
  })

  it("should not update the todo by other user", done => {
    var hexId = todos[0]._id.toHexString()
    var text = "This should be the new text"
    request(app)
      .patch(path + `/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({ completed: true, text })
      .expect(404)
      .end(done)
  })

  it("shold clear completedAt when todo is not completed", done => {
    var hexId = todos[1]._id.toHexString()
    var text = "This should be the new text !!"

    request(app)
      .patch(path + `/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({ completed: false, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        // expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.completedAt).toBeFalsy()
      })
      .end(done)
  })
})

describe("GET /users/me", () => {
  it("Should return user if authenticate", done => {
    request(app)
      .get(path + "/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it("Should return 401 if not authenticate", done => {
    request(app)
      .get(path + "/users/me")
      // .set('x-auth', 'no token')
      .expect(401)
      .expect(res => {
        // expect(res.body).toNotExist()
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe("POST /users", () => {
  it("should create a user", done => {
    var email = "esample@example.com"
    var password = "123nmb!"

    request(app)
      .post(path + "/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        // expect(res.headers['x-auth']).toExist();
        expect(res.headers["x-auth"]).toBeTruthy()
        // expect(res.body._id).toExist();
        expect(res.body._id).toBeTruthy()
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if (err) {
          return done(err)
        }

        User.findOne({ email })
          .then(user => {
            // expect(user).toExist();
            expect(user).toBeTruthy()
            // expect(user.password).toNotBe(password);
            expect(user.password).not.toBe(password)
            done()
          })
          .catch(e => done(e))
      })
  })

  it("should return validateion error if request invalid", done => {
    request(app)
      .post(path + "/users")
      .send({
        email: "and",
        password: "123"
      })
      .expect(400)
      .end(done)
  })

  it("should not create user if email in use", done => {
    request(app)
      .post(path + "/users")
      .send({
        email: users[0].email,
        password: "Password123!"
      })
      .expect(400)
      .end(done)
  })
})

describe("POST /users/login", () => {
  it("should login user and return auth token", done => {
    request(app)
      .post(path + "/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        // expect(res.headers['x-auth']).toExist();
        expect(res.headers["x-auth"]).toBeTruthy()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id)
          .then(user => {
            // expect(user.tokens[1]).toInclude({
            expect(user.toObject().tokens[1]).toMatchObject({
              access: "auth",
              token: res.headers["x-auth"]
            })
            done()
          })
          .catch(e => done(e))
      })
  })
  it("should reject invalid login", done => {
    request(app)
      .post(path + "/users/login")
      .send({
        email: users[1].email,
        password: users[1].password + "wrong"
      })
      .expect(400)
      .expect(res => {
        // expect(res.headers['x-auth']).toNotExist();
        expect(res.headers["x-auth"]).toBeFalsy()
      })
      .end(err => {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1)
            done()
          })
          .catch(e => done(e))
      })
  })
})

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    //DELET /users/me/token
    //Set x-auth equal to token
    //200
    //Find user, verify that tokens arrya has length of zero
    request(app)
      .delete(path + "/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({})
      })
      .end(err => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0)
            done()
          })
          .catch(e => done(e))
      })
  })
})
