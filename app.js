const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const mongoose = require("mongoose");
// const airline_api = require('./routes/apis/airline')
const company_api = require('./routes/apis/company')
const user_api = require('./routes/apis/user')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());



//Database
mongoose.connect("mongodb://localhost:27017/Webapp", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Database Connected");
  });
// app.use("/api/air",airline_api)
app.use("/api/com",company_api)
app.use("/api/user",user_api)

const port = 9002 || process.env.PORT
app.listen(port, () => {
  console.log("Server functioning on port " + port);
});



