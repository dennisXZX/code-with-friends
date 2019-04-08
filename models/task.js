const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  content: String
})

module.exports = mongoose.model('Task', taskSchema)