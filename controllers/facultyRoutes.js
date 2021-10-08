const express = require("express");
const router = express.Router();
const faculty = require("../models/faculty");
const user = require("../models/user");
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
router.get('/faculty', checkAuth, async (req, res) => {
    let email = req.user.email;
    data = await faculty.findOne({ email: email });
    if(data != null){
        res.render("faculty_details", {data: data, status: "Verified"});
    } else {
        res.render("faculty_details", { status: "Unfilled" });
    }  
});
router.post('/faculty/broadcast', (req, res) => {
    res.render("broadcast");
});
router.get('/faculty/form', (req, res) => {
    res.render("faculty_form");
});
router.post("/faculty/form", checkAuth, async (req, res) => {
    const name = req.user.name;
    const email = req.user.email;
    const phone = req.user.phone;
    const exp = req.body.exp;
    const qualification = req.body.qualification;
    const awards = req.body.awards;
    const linkedin = req.body.linkedin;
  
    const Faculty = new blogs({
        name,
        email,
        phone,
        exp,
        qualification,
        awards,
        linkedin
    });
    try {
      const newSave = await Faculty.save();
      res.redirect("/faculty");
    } catch (e) {
      console.log(e);
    }
  });

  module.exports = router;