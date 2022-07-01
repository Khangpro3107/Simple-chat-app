const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      default: 'somebody'
    },
    time: {
      type: String,
      default: new Date().toUTCString()
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);