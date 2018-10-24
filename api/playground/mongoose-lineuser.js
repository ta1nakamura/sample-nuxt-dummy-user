require("../config/config.js")
const { ObjectID } = require("mongodb")
const { mongoose } = require("../db/mongoose")
const { LineUser } = require("../models/lineuser")
const jwt = require("jsonwebtoken")
// const JWT_SECRET='secret';

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
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

/**
 * Save
 */
const initLineusers = async () => {
  await LineUser.remove({})
  await LineUser.insertMany(lineusers)
}
const findAll = async () => {
  let data = await LineUser.find({})
  console.log("--find all", data)
}
const updateLineuser = async () => {
  const targetLineuserid = "dummy0002" //same id
  try {
    const doc = await LineUser.findOneAndUpdate(
      { lineuserid: targetLineuserid },
      {
        displayname: "Update-002",
        lastupdate: new Date().getTime()
      },
      { upsert: true }
    )
  } catch (e) {
    console.log("[upsert-error]", err)
  }
}
const testJWT = async () => {
  console.log("--testJWT--")
  //  let token= jwt.sign({
  //      sub  : lineusers[0].lineuserid,
  //      name : lineusers[0].displayname
  //     },JWT_SECRET).toString();
  // console.log('---- token:\n',token);
  //decode
  // let decoded = jwt.verify(token,JWT_SECRET)
  let decoded = jwt.verify(lineusers[0].token, process.env.JWT_SECRET)

  console.log("--- decoded:\n", decoded)
}
/**
 * Main
 */
const execMain = async () => {
  console.log("--start")
  testJWT()
  // await initLineusers()
  // await updateLineuser()
  // await findAll()
  console.log("--end")
}
execMain()
