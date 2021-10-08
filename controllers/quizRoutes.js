const express = require("express");
const router = express.Router();
const faculty = require("../models/faculty");
const user = require("../models/user");
const quiz = require("../models/quiz");
const question = require("../models/question");
const dotenv = require("dotenv");
dotenv.config();

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
    );
    next();
  } else {
    req.flash("error_messages", "Please Login to continue !");
    res.redirect("/login");
  }
}

module.exports = router;