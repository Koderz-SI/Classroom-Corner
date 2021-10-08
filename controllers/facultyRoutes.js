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
router.get('/faculty', checkAuth, async (req, res) => {
    let email = req.user.email;
    data = await faculty.findOne({ email: email });
    if(data != null){
        res.render("faculty_details", {data: data, status: "Verified"});
    } else {
        res.render("faculty_details", { status: "Unfilled" });
    }  
});
router.post('/faculty/broadcast', checkAuth, (req, res) => {
    res.render("broadcast");
});
router.get('/faculty/form', checkAuth, (req, res) => {
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
  
    const Faculty = new faculty({
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
// list of quizzes made
router.get('/faculty/quiz', checkAuth, (req, res) => {
    res.render("quiz"); 
});

// Create a new quiz
router.get('/faculty/create-quiz', checkAuth, (req, res) => {
    res.render("create-quiz-form");
});

router.post("/faculty/create", checkAuth, async (req, res) => {
    const name = req.user.name;
    const subject = req.body.subject;
    const topic = req.body.topic;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
  
    const Quiznew = new quiz({
        name,
        subject,
        topic,
        startdate,
        enddate,
    });
    try {
      const newSave = await Quiznew.save();
      res.redirect("/faculty/quiz-dashboard/"+topic);
    } catch (e) {
      console.log(e);
    }
});
// add question
router.get('/faculty/quiz-dashboard/:topic', checkAuth, (req, res) => {
    res.render("create-question-form", {topic: req.params.topic});
});

router.post("/faculty/create-ques", checkAuth, async (req, res) => {
    const name = req.user.name;
    const topic = req.body.topic;
    const ques = req.body.ques;
    const opt1 = req.body.opt1;
    const opt2 = req.body.opt2;
    const opt3 = req.body.opt3;
    const opt4 = req.body.opt4;
    const correct = req.body.correct;
    const explanation = req.body.explanation;

    const Questionnew = new question({
        name,
        subject,
        ques,
        opt1,
		opt2,
        opt3,
		opt4,
		correct,
		explanation
    });
    try {
      const newSave = await Questionnew.save();
      res.redirect("/quiz-dashboard");
    } catch (e) {
      console.log(e);
    }
});
module.exports = router;