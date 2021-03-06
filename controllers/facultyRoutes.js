const express = require("express");
const router = express.Router();
const faculty = require("../models/faculty");
const result = require("../models/result");
const broadcast = require("../models/broadcast");
const quiz = require("../models/quiz");
const question = require("../models/question");
const note = require("../models/note");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary");
var path = require('path'); 
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
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: "415945345236774",
    api_secret: process.env.api_secret,
});

var storage = multer.diskStorage({});  
  
var upload = multer({storage:storage}); 
router.get('/faculty', checkAuth, async (req, res) => {
    let email = req.user.email;
    data = await faculty.findOne({ email: email });
    if (data != null) {
        if (data.isPending) {
            res.render("faculty", { data: data, status: "UnVerified" });
        } else {
            res.render("faculty", { data: data, status: "Verified" });
        }
    } else {
        res.render("faculty", { status: "Unfilled" });
    }
});
router.post('/faculty/broadcast', checkAuth, async (req, res) => {
    const faculty = req.user.name;
    const msg = req.body.msg;
    const urgent = req.body.urgent;

    const Message = new broadcast({
        faculty,
        msg,
        urgent,
    });
    try {
        const newMessage = await Message.save();
        res.redirect("/faculty");
    } catch (e) {
        console.log(e);
    }
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
    var quizzes;
    const name = req.user.name;
    quiz.find({ name: name }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            quizzes = data;
        }
        res.render("listOfQuiz", { data: quizzes });
    });
});

// Create a new quiz
router.get('/faculty/create-quiz', checkAuth, (req, res) => {
    res.render("createquiz");
});

router.post("/faculty/create", checkAuth, async (req, res) => {
    const name = req.user.name;
    const subject = req.body.subject;
    const topic = req.body.topic;
    const date = req.body.date;
    const starttime = req.body.starttime;
    const endtime = req.body.endtime;
    const duration = req.body.duration;

    const Quiznew = new quiz({
        name,
        subject,
        topic,
        date,
        starttime,
        endtime,
        duration,
    });
    try {
        const newSave = await Quiznew.save();
        res.redirect("/faculty/quiz-dashboard/" + topic);
    } catch (e) {
        console.log(e);
    }
});
// add question
router.get('/faculty/quiz-dashboard/:topic', checkAuth, (req, res) => {
    var questions;
    const name = req.user.name;
    question.find({ $and: [{name: name}, {idcheck: req.params.topic}] }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            questions = data;
        }
        res.render("createques", { data: questions, topic: req.params.topic });
    });
});

router.post("/faculty/create-ques", checkAuth, async (req, res) => {
    const name = req.user.name;
    const idcheck = req.body.topic;
    const ques = req.body.ques;
    const opt1 = req.body.opt1;
    const opt2 = req.body.opt2;
    const opt3 = req.body.opt3;
    const opt4 = req.body.opt4;
    var ans = req.body.opt;
    var correct = req.body[`${ans}`];

    const explanation = req.body.explanation;

    const Questionnew = new question({
        name,
        idcheck,
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
        res.redirect("/faculty/quiz-dashboard/" + idcheck);
    } catch (e) {
        console.log(e);
    }
});

// answers
router.get('/faculty/quiz-dashboard/results/:topic', checkAuth, (req, res) => {
    var results;
    const topic = req.params.topic;
    result.find({ topic: topic }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            results = data;
        }
        res.render("answerDashboard", { data: results });
    });
});

// Adding Notes
router.get('/faculty/createnote', checkAuth, (req, res) => {
    res.render("createnote");
});
router.post('/faculty/postnote',upload.single('pdffile'), checkAuth, (req, res) => {
    const faculty = req.user.name;
    const subject = req.body.subject;
    const topic = req.body.topic;
    cloudinary.v2.uploader.upload(req.file.path).then(function(data){  
        console.log(data.url)  
        const temp = new note({  
            faculty: faculty,
            subject: subject,
            topic: topic,
            pdffile:data.url  
        })  
       //saving the data
        temp.save((error,data)=>{  
            if(error){  
                console.log('error',error)  
            }  
            else{  
                res.redirect('/faculty/createnote')  
            }  
        })  
    }).catch(function(error){  
        console.log(error);  
    })  
});

module.exports = router;