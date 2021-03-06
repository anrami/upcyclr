const mongoose = require('mongoose')
const Project = require('./project')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

categorySchema.pre('remove', function(next) {
  Project.find({ category: this.id }, (err, projects) => {
    if (err) {
      next(err)
    } else if (projects.length > 0) {
      next(new Error('This category has projects still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Category', categorySchema)