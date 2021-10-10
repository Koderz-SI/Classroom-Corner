const express = require("express");
const router = express.Router();const product = require("../models/product");
const broadcast = require("../models/broadcast");
var nodemailer = require("nodemailer");
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

router.get('/student/announcements', checkAuth, (req, res) => {
    var notifications;
    broadcast.find((err, data) => {
    if (err) {
        console.log(err);
    }
    if (data) {
        notifications = data;
    }
    res.render("announcement", { data: notifications });
    });
});

router.get('/student/shop', checkAuth, (req, res) => {
    var products;
    product.find({buyer: null}, (err, data) => {
    if (err) {
        console.log(err);
    }
    if (data) {
        products = data;
    }
    res.render("products_shop", { data: products });
    });
});
router.get("/student/shopform", checkAuth, (req, res) => {
    res.render("shopform");
});
router.post("/student/form", checkAuth, async(req, res) => {
    const seller = req.body.seller;
    const name = req.body.name;
    const desc = req.body.desc;
    const phone = req.body.phone;
    const email = req.body.email;
    const amount = req.body.amount;
    const Productnew = new product({
        seller,
        name,
        desc,
        phone,
		email,
        amount,
    });
    try {
      const newSave = await Productnew.save();
      res.redirect("/student/shop");
    } catch (e) {
      console.log(e);
    }
});
router.post("/student/buy", checkAuth, async(req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    const name = req.body.name;
    try {
        let updates = await product.updateOne(
          { _id: id },
          { $set: { buyer: req.user.name } }
        )
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "testyashu23@gmail.com",
              pass: process.env.GMAILPASSWORD,
            },
          });
    
          var mailOptions = {
            from: "testyashu23@gmail.com",
            to: email,
            subject: `New buyer for ${name}`,
            text: `${name}
            Buyer Details: 
            Name: ${req.user.name}
            Phone: ${req.user.phone}
            Email-id: ${req.user.email}`,
          };
    
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.redirect("/");
            } else {
              console.log("Email sent: " + info.response);
            }
          });
      } catch (e) {
        console.log(e);
      }
      res.redirect("/student/shop");
});
router.get("/student/bought", checkAuth, (req, res) => {
    var products;
    product.find({buyer: req.user.name}, (err, data) => {
    if (err) {
        console.log(err);
    }
    if (data) {
        products = data;
    }
    res.render("claim", { data: products });
    });
});
module.exports = router;