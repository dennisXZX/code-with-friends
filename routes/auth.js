const express = require('express');
const router = express.Router();
const passport = require('passport');

router.route('/login')
  .get((req, res, next) => {
    res.render('login/login');
  })
  .post(passport.authenticate(
    'local',
    { failureRedirect: '/login' }
  ), (req, res) => {
    res.redirect('/')
  })

router.route('/register')
  .get((req, res, next) => {
    res.render('register/register');
  })
  .post((req, res, next) => {
    const errors = validateAuth(req)
    const body = req.body;

    if (errors) {
      res.render('register/register', {
        name: body.name,
        email: body.email,
        errorMessages: errors
      })
    } else {
      const user = new User();
      user.name = body.name;
      user.email = body.email;
      user.setPassword(body.password)
      user.save((err) => {
        if (err) {
          res.render('register/register', { errorMessages: err })
        } else {
          res.redirect('/login')
        }
      })
    }
  })

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}))

module.exports = router;

// validate the form using express-validator
function validateAuth(req) {
  req.checkBody('name', 'Empty name').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('password', 'Empty Password').notEmpty();
  req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword);

  return req.validationErrors();
}