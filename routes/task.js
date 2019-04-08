const express = require('express');
const router = express.Router();

router.get('/createTask', (req, res) => {
  const newTask = new Task()

  newTask.save((err, data) => {
    if (err) {
      console.log(err)
      res.render('common/error')
    } else {
      res.redirect(`/task/${data._id}`)
    }
  })
});

router.get('/task/:id', (req, res) => {
  if (req.params.id) {
    Task.findOne({ _id: req.params.id }, (err, data) => {
      if (err) {
        console.log(err)
        res.render('common/error')
      }

      if (data) {
        res.render('task/task', { content: data.content, roomId: data.id })
      } else {
        res.render('common/error')
      }
    })
  } else {
    res.render('common/error')
  }
})

module.exports = router;
