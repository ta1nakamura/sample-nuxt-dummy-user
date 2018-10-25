const { path, handler } = require("./index")
const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const session_options = {
  secret: "safjeks",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // デフォルトは「{ path: '/', httpOnly: true, secure: false, maxAge: null }」
    // 生存期間（単位：ミリ秒）
    // maxAge : 1000 * 60 * 60 * 24 * 30, // 30日
    maxAge: 1000 * 60 * 60 // 60min
  }
}
const cors = require("cors")
const app = express()

var corsOptions = { exposedHeaders: "x-auth" }
app.use(cors(corsOptions))
app.use(session(session_options)) // add for LINELOGIN
app.use(bodyParser.json())
app.use(path, handler)
const port = "3000"
app.listen(port, () => {
  console.log(`Started up apptest port:${port}`)
})
//for test {path,app}
module.exports = { path, app }
