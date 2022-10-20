const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 30,
    },
    token: {
      type: String,
    },
    favorites: {
      type: Array,
      required: false,
      unique: false,
      index: false,
    },
    role: {
      required: true,
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    contactNumber: {
      required: true,
      type: String,
    },
    profilePicture: {
      required: true,
      type: String,
    },
  });

  module.exports = userSchema