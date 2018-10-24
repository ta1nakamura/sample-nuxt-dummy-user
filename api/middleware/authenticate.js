var { LineUser } = require("../models/lineuser")
const jwt = require("jsonwebtoken")

var authenticate = (req, res, next) => {
  /**cond:TestMode*/
  // if(process.env.NODE_ENV=='test'){
  //     console.log('--[authenticate] pass for test')
  //     next()
  // }
  /** Decode idToken in session */
  var decoded
  try {
    //== verify JWT
    // var token = req.session.lineuser.id_token
    var token = req.header("x-auth")
    // decoded = jwt.decode(
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("--[auth] decode.sub", decoded.sub)
    //== check mongodb
    LineUser.findOne({ lineuserid: decoded.sub })
      .then(user => {
        if (!user) {
          return Promise.reject()
        }
        req.user = user
        next()
      })
      .catch(e => {
        console.log("--[authenticate] 401", e)
        res.status(401).send()
      })
  } catch (e) {
    console.log(e)
    return Promise.reject()
  }
}

module.exports = { authenticate }
