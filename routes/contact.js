const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport(config.mailer);

/* GET contact page */
router.route('/contact')
  .get((req, res, next) => {
    res.render('contact/contact')
  })
  .post((req, res, next) => {
    const errors = validateContact(req, res);

    if (errors) {
      redirectToContact(req, res, errors);
    } else {
      sendMail(req, res);
    }
  })

module.exports = router;

// validate the form using express-validator
function validateContact(req) {
  req.checkBody('name', 'Empty name').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('message', 'Empty message').notEmpty();

  return req.validationErrors();
}

// redirect to contact page
function redirectToContact (req, res, errors) {
  const body = req.body;

  res.render('contact/contact', {
    name: body.name,
    email: body.email,
    message: body.message,
    errorMessages: errors
  })
}

// send an email
function sendMail (req, res) {
  const message = req.body.message;

  const mailOptions = {
    from: 'CodeLand <no-reply@codeland.com>',
    to: 'dennisboys@gmail.com',
    subject: 'You got a new message from codeland',
    text: message
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }

    res.render('contact/thanks')
  })
}