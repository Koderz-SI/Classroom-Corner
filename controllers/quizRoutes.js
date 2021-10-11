const express = require("express");
const router = express.Router();
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
    var results = [];
	quiz.find((err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			quizzes = data;
		}
        result.find({student: req.user.name}, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data) {
                for(let i=0; i<data.length; i++){
                    results.push(data[i].topic)
                }
            }
            res.render("studentQuiz", { data: quizzes, results: results });
        })
		
	});
});

router.get("/student/quiz/:topic", checkAuth, (req, res) => {
	const topic = req.params.topic;
	var questions;
    var duration;
	question.find({ idcheck: topic }, (err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			questions = data;
		}
        quiz.findOne({topic: topic}, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data) {
                duration = data.duration;
            }
            res.render("stuTest", { data: questions, topic: topic, duration: duration });
        })
		
	});
});
let questions;
router.post("/student/quiz/done/:topic", checkAuth, (req, res) => {
	const student = req.user.name;
	const email = req.user.email;
	const topic = req.params.topic;

	question.find({ idcheck: topic }, (err, data) => {
		if (err) {
			console.log(err);
		}
		if (data) {
			questions = data;
		}
		var correctans = 0;
		for (let i = 0; i < questions.length; i++) {
			if (questions[i].correct == req.body[`${i}`]) {
				correctans += 1;
			}
		}
		var wrongans = questions.length - correctans;
		const Resultnew = new result({
			student,
			topic,
			correctans,
			wrongans
		});
		Resultnew.save().then(() => {
			res.render("testSubmit", { questions: questions, correctans: correctans, wrongans: wrongans });
		})
			.catch((err) => console.log(err));
	});

})
module.exports = router;