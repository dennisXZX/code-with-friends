const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('home/home', { title: 'CodeLand - a platform for sharing code.' });
});

module.exports = router;
