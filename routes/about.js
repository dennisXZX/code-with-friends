const express = require('express');
const router = express.Router();

router.get('/about', (req, res, next) => {
  res.render('about/about')
});

module.exports = router;
