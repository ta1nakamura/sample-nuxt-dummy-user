const express = require("express")
// const url = require('url')
/** MongoDB and Models */
require("./config/config.js") //config for mongodb,
const _ = require("lodash")
const { ObjectID } = require("mongodb")
require("./db/mongoose")
const { Todo } = require("./models/todo")
const { LineUser } = require("./models/lineuser")
const jwt = require("jsonwebtoken")
var { authenticate } = require("./middleware/authenticate")
const router = express.Router()

const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  // req.query = url.parse(req.url, true).query
  next()
})
/**
 * Test Express
 */
router.get("/test/:id", (req, res) => {
  console.log("--test get")
  console.log("--id ", req.params.id)
  res.status(200).json({ message: `test_id = ${req.params.id}` })
})

/**
 * Test Express and MongoDb,Mongoose
 */
router.post("/todos", authenticate, async (req, res) => {
  // console.log(req.body)
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  try {
    const doc = await todo.save()
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
})
router.get("/todos", authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({
      _creator: req.user._id
    })
    res.send({ todos })
  } catch (e) {
    res.status(400).send(e)
  }
})
router.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(400).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({ todo })
    })
    .catch(() => {
      return res.status(400).send()
    })
})
router.delete("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
    if (!todo) {
      return res.status(404).send()
    }
    return res.status(200).send({ todo })
  } catch (e) {
    res.status(400).send()
  }
})
router.patch("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ["text", "completed"])
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }
  // Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user.id
    },
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(() => {
      res.status(400).send()
    })
})

/**
 * Lineuser: dummylogin/:name
 *   - save db to lineuser
 *   - set session
 */
router.post("/dummylogin/", async (req, res) => {
  console.log("--[api]dummylogin")
  let token = jwt
    .sign(
      {
        sub: req.body.lineuserid,
        name: req.body.lineuserid
      },
      process.env.JWT_SECRET
    )
    .toString()
  var userinfo = {
    lineuserid: req.body.lineuserid,
    displayname: req.body.lineuserid,
    id_token: token
  }
  try {
    const doc = await LineUser.findOneAndUpdate(
      { lineuserid: userinfo.lineuserid },
      {
        displayname: userinfo.displayname,
        picture: null,
        isfollow: true,
        lastupdate: new Date().getTime()
      },
      { upsert: true, new: true }
    )
    userinfo._id = doc._id
    req.session.lineuser = userinfo

    res
      .status(200)
      .header("x-auth", token)
      .send({ lineuser: userinfo })
    // res.redirect('/other');
  } catch (e) {
    console.log("[save-error]", e)
    res.status(400).json(e)
  }
})

module.exports = {
  path: "/api",
  handler: router
}
