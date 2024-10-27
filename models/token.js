// const mongoose = require("mongoose");

// const tokenSchema = mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   token: {
//     type: String,
//     required: true,
//   },
// });

// models/VerificationCode.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that each email only has one active code
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m' // Automatically remove the document after 10 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});


module.exports  = mongoose.model("Token", tokenSchema)

