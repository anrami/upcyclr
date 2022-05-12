const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Project = require('../models/project')

// All Categorys Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const categorys = await Category.find(searchOptions)
    res.render('categorys/index', {
      categorys: categorys,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Category Route
router.get('/new', (req, res) => {
  res.render('categorys/new', { category: new Category() })
})

// Create Category Route
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name
  })
  try {
    const newCategory = await category.save()
    res.redirect(`categorys/${newCategory.id}`)
  } catch {
    res.render('categorys/new', {
      category: category,
      errorMessage: 'Error creating Category'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    const projects = await Project.find({ category: category.id }).limit(6).exec()
    res.render('categorys/show', {
      category: category,
      projectsByCategory: projects
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    res.render('categorys/edit', { category: category })
  } catch {
    res.redirect('/categorys')
  }
})

router.put('/:id', async (req, res) => {
  let category
  try {
    category = await Category.findById(req.params.id)
    category.name = req.body.name
    await category.save()
    res.redirect(`/categorys/${category.id}`)
  } catch {
    if (category == null) {
      res.redirect('/')
    } else {
      res.render('categorys/edit', {
        category: category,
        errorMessage: 'Error updating Category'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let category
  try {
    category = await Category.findById(req.params.id)
    await category.remove()
    res.redirect('/categorys')
  } catch {
    if (category == null) {
      res.redirect('/')
    } else {
      res.redirect(`/categorys/${category.id}`)
    }
  }
})

module.exports = router