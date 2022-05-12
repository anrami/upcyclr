const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Project = require('../models/project')

// All Categories Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const categories = await Category.find(searchOptions)
    res.render('categories/index', {
      categories: categories,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Category Route
router.get('/new', (req, res) => {
  res.render('categories/new', { category: new Category() })
})

// Create Category Route
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name
  })
  try {
    const newCategory = await category.save()
    res.redirect(`categories/${newCategory.id}`)
  } catch {
    res.render('categories/new', {
      category: category,
      errorMessage: 'Error creating Category'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    const projects = await Project.find({ category: category.id }).limit(6).exec()
    res.render('categories/show', {
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
    res.render('categories/edit', { category: category })
  } catch {
    res.redirect('/categories')
  }
})

router.put('/:id', async (req, res) => {
  let category
  try {
    category = await Category.findById(req.params.id)
    category.name = req.body.name
    await category.save()
    res.redirect(`/categories/${category.id}`)
  } catch {
    if (category == null) {
      res.redirect('/')
    } else {
      res.render('categories/edit', {
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
    res.redirect('/categories')
  } catch {
    if (category == null) {
      res.redirect('/')
    } else {
      res.redirect(`/categories/${category.id}`)
    }
  }
})

module.exports = router