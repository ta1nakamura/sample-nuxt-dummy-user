var mongoose = require("mongoose")
var LineUser = mongoose.model("LineUser", {
  lineuserid: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  displayname: {
    type: String,
    required: true,
    minlength: 1,
    trim: false
  },
  picture: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  isfollow: {
    type: Boolean,
    required: true,
    default: false
  },
  isadmin: {
    type: Boolean,
    required: false,
    default: false
  },
  lastupdate: {
    type: Number,
    default: null
  }
})

module.exports = { LineUser }
