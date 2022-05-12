const mongoose = require('mongoose')
const Book = require('./book')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

categorySchema.pre('remove', function(next) {
  Book.find({ category: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('This category has books still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Category', categorySchema)