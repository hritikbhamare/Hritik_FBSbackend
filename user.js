const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const jwt = require("jsonwebtoken");

const userSchema = require("../../models/userSchema");
const companySchema = require("../../models/companySchema");

const User = new mongoose.model("User", userSchema);
const Company = new mongoose.model("Company", companySchema);

router.post("/verify", verifyToken, (req, res) => {
  // console.log("req.token")
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403).json({
        success:false
      });
    } else {
      res.json({
        token:req.token,
        success: true,
        message: "Here you go good sir",
        authData,
      });
    }
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.body.token;
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearerToken = bearerHeader;
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message: "Please try again",
      });
    }
    if (user) {
      if (password === user.password) {
        jwt.sign({ user }, "secretkey", { expiresIn: "1h" }, (err, token) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "Please try again",
            });
          } else {
            return res.status(200).json({
              message: "Login Successful",
              success: true,
              user: user,
              token: token,
            });
          }
        });
      } else {
        return res.status(200).json({
          message: "Invalid Email or Password",
          success: false,
        });
      }
    } else {
      return res.status(200).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }
  });
});

router.post("/getByEmail", (req, res) => {
  if (req.body.role === "admin") {
    const { email } = req.body;
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message: "Please try again",
        });
      }
      if (user) {
        // console.log(user);
        return res.status(200).json({
          message: "Get Profile Successful",
          success: true,
          user: user,
        });
      } else {
        return res.status(200).json({
          message: "No account found. Please login again",
          success: false,
        });
      }
    });
  } else
    return res.status(403).json({
      success: false,
    });
});

router.post("/getAllUsers", (req, res) => {
  const {role} = req.body;
  console.log(role)
  if (role === "admin") {
    User.find({}, (err, data) => {
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
  } else
    return res.status(403).json({
      success: false,
    });
});

router.post("/signup", (req, res) => {
  const { name, email, password, contactNumber,bool } = req.body;
  User.findOne({ email: email }, (err, user) => {
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
        message: "User already registered with these credentials",
      });
    }
    let role = "user";
    if(bool==="yes") role="vendor";
    const profilePicture =
      "https://cdn2.iconfinder.com/data/icons/facebook-51/32/FACEBOOK_LINE-01-512.png";
    const newuser = new User({
      name,
      email,
      password,
      role,
      contactNumber,
      profilePicture,
    });
    newuser.save((err, data) => {
      if (err) {
        return res.status(200).json({
          success: false,
          err: err,
          message: "User cannot be created. Please try again",
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

router.post("/editUser", (req, res) => {
  const { name, email, newPassword, contactNumber , oldPassword } = req.body;
  User.findOneAndUpdate(
    { email: email, oldPassword : oldPassword},
    { name: name, password: newPassword, contactNumber: contactNumber },
    (err, user) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message:
            "There was an error connecting to the database. Please try again",
        });
      } else if (user) {
        return res.status(200).json({
          success: true,
          message: "Changes made",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Please try again",
        });
      }
    }
  );
});

router.post("/removeUser", (req, res) => {
  const { name, email, password,role} = req.body;
  if (role === "admin") {
    User.findOneAndRemove(
      { name: name, email: email, password: password },
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
            message: "User Removed Successfully",
            data: data,
          });
        }
        if (data == null) {
          return res.status(200).json({
            success: false,
            message: "No user found with the given credentials",
          });
        }
      }
    );
  } else {
    return res.status(403).json({
      success: false,
    });
  }
});

module.exports = router;
