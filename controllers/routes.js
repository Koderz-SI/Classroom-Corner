const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
require('./passportLocal')(passport);

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    }else{
        req.flash('error_message', "Please login to continue!");
        res.redirect('/login');
    }
}
router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.render("index", { logged: true });
    }else{
        res.render("index", { logged: false });
    }
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/signup', (req, res) => {
    res.render("signup");
});

router.post('/signup', (req, res) => {
    const { email, name, password, confirmpassword, phone, designation } = req.body;
    if (!email || !name || !password || !confirmpassword ){
        res.render("signup", { err: "All Fields Required!", csrfToken: req.csrfToken() });
    }else if(password != confirmpassword){
        res.render("signup", { err: "Passwords don't match!", csrfToken: req.csrfToken() });
    }else{
        user.findOne({ $or: [{ email: email }]}, (err, data) => {
            if(err) throw err;
            if(data){
                res.render("signup", { err: "User Exists, Try logging in!", csrfToken: req.csrfToken()})
            }else{
                bcryptjs.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user({
                            name: name,
                            email: email,
                            password: hash,
                            phone: phone,
                            designation: designation,
                        }).save((err, data) => {
                            if(err) throw err;
                            res.redirect("/login");
                        })
                    })
                })
            }
        })
    }
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
        failureFlash: true,
    })(req, res, next);
});
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.redirect('/')
    })
});
router.get('/profile', checkAuth, (req, res) => {
    res.render('profile', { name: req.user.name, verified: req.user.isVerified })
});
router.get('/admin/dashboard', checkAuth, (req, res) => {
    res.render("admin_dash");
});
router.get('/admin/students', checkAuth, (req, res) =>{
    if (!req.user.isAdmin) {
        return res.redirect("/");
    }
    var students;
    user.find({designation:"student"}, (err, data) => {
    if (err) {
        console.log(err);
    }
    if (data) {
        students = data;
    }
    res.render("students_db", { data: students });
    });
});
   router.get('/admin/faculty', checkAuth, (req, res) =>{
    if (!req.user.isAdmin) {
        return res.redirect("/");
    }
    var faculty;
    user.find({designation:"faculty"}, (err, data) => {
    if (err) {
        console.log(err);
    }
    if (data) {
        faculty = data;
    }
    res.render("faculty_db", { data: faculty });
    });
});
router.post("/admin/delete-student", (req, res) => {
    const id = req.body.id;
    user.findOneAndRemove({ _id: id }, (err, doc) => {
      res.redirect("/admin/students");
    });
});
router.post("/admin/delete-faculty", (req, res) => {
    const id = req.body.id;
    user.findOneAndRemove({ _id: id }, (err, doc) => {
      res.redirect("/admin/faculty");
    });
});

router.get('/broadcast', (req, res) => {
    res.render("broadcast");
});
router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/form_faculty', (req, res) => {
    res.render("faculty_form");
});
router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/verify', (req, res) => {
    res.render("verificationofFac");
});
router.get('/login', (req, res) => {
    res.render("login");
});

// router.use(require('./userRoutes'));
module.exports = router;