const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    email:{
      type: String,
      required: true,
      max: 50,
    },
    name: {
      type: String,
      required: true,
      max: 50,
    },
    password:{
      type: String,
      required: true,
      max: 50,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    airlines: {
      type: Array,
      required: false,
    },
    orders: {
      type: Array,
      required: false,
    },
  });

  module.exports = companySchema