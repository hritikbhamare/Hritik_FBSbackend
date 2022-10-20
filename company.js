const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const companySchema = require("../../models/companySchema");

const Company = new mongoose.model("Company", companySchema);

router.post("/newCompany", (req, res) => {
  const { email, name, contactNumber, country, password } = req.body;
  Company.findOne({ name: name, email: email }, (err, user) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message:
          "There was an error connecting to the database. Please try again",
      });
    }
    if (user) {
      return res.status(200).json({
        success: false,
        message: "Company already registered",
      });
    }
    const newcompany = new Company({
      email,
      name,
      contactNumber,
      country,
      password,
    });
    newcompany.save((err, data) => {
      if (err) {
        return res.status(200).json({
          success: false,
          err: err,
          message: "Company cannot be registered. Please try again",
        });
      }
      if (data) {
        return res.status(200).json({
          data,
          success: true,
          message: "Successfully Registered",
        });
      }
    });
  });
});

router.post("/updateCompany", (req, res) => {
  const { name, email, oldPassword, newPassword, contactNumber, country } = req.body;
  Company.findOneAndUpdate(
    { email:email , password:oldPassword },
    { contactNumber: contactNumber, country: country , name:name , password:newPassword },
    (err, user) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message:
            "There was an error connecting to the database. Please try again",
        });
      }
      if (user) {
        return res.status(200).json({
          success: true,
          message: "Changes Made",
        });
      }
    }
  );
});

router.post("/removeCompany", (req, res) => {
  const { name, email, role } = req.body;
  if (role ==="admin") {
    Company.findOneAndRemove(
      { name: name, email: email},
      (err, data) => {
        if (err) {
          return res.status(200).json({
            success: false,
            message:
              "There was an error connecting to the database. Please try again",
          });
        }
        if (data != null) {
          return res.status(200).json({
            success: true,
            message: "Company Removed Successfully",
            data: data,
          });
        }
        if (data == null) {
          return res.status(200).json({
            success: false,
            message: "No company found",
          });
        }
      }
    );
  } else {
    return res.status(403).json({
      success: false,
      message: "Please provide Auth Key",
    });
  }
});

router.get("/getAllCompanies", (req, res) => {
  Company.find({}, (err, data) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message:
          "There was an error connecting to the database. Please try again",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Here you go good sir",
        data: data,
      });
    }
  });
});
module.exports = router;
