const express = require("express");
const router = express.Router();
const faculty = require("../models/faculty");
const user = require("../models/user");
const quiz = require("../models/quiz");
const result = require("../models/result");
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

router.get("/student/quizzes", checkAuth, (req, res) => {
	var quizzes;
	quiz.find((err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			quizzes = data;
		}
		res.render("quiz_list", { data: quizzes });
	});
});

router.get("/student/quiz/:topic", checkAuth, (req, res) => {
	const topic = req.params.topic;
	var questions;
	question.find({"topic": topic}, (err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			questions = data;
		}
		res.render("quiz", { data: questions });
	});
});

router.post("/student/quiz/:topic/done", checkAuth, (req, res) => {
	const student = req.user.name;
	const email = req.user.email;
	const topic = req.params.topic;
	var questions;
	question.find({"topic": topic}, (err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			questions = data;
		}
	});
	var correctans = 0;
	for(var q of questions){
		if(q.correct == req.body.ques){
			correctans += 1;
		}
	}
	var wrongans = questions.length - marks;
	const Resultnew = new result({
        student,
        topic,
        correctans,
        wrongans
    });
	Resultnew.save().then(() => {
		res.render("quiz-end", {questions: questions, correctans: correctans, wrongans: wrongans});
	})
	.catch((err) => console.log(err));
})
module.exports = router;