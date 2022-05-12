const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const Category = require('../models/category')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Projects Route
router.get('/', async (req, res) => {
  let query = Project.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const projects = await query.exec()
    res.render('projects/index', {
      projects: projects,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Project Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Project())
})

// Create Project Route
router.post('/', async (req, res) => {
  const project = new Project({
    title: req.body.title,
    category: req.body.category,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(project, req.body.cover)

  try {
    const newProject = await project.save()
    res.redirect(`projects/${newProject.id}`)
  } catch {
    renderNewPage(res, project, true)
  }
})

// Show Project Route
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
                           .populate('category')
                           .exec()
    res.render('projects/show', { project: project })
  } catch {
    res.redirect('/')
  }
})

// Edit Project Route
router.get('/:id/edit', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    renderEditPage(res, project)
  } catch {
    res.redirect('/')
  }
})

// Update Project Route
router.put('/:id', async (req, res) => {
  let project

  try {
    project = await Project.findById(req.params.id)
    project.title = req.body.title
    project.category = req.body.category
    project.publishDate = new Date(req.body.publishDate)
    project.pageCount = req.body.pageCount
    project.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(project, req.body.cover)
    }
    await project.save()
    res.redirect(`/projects/${project.id}`)
  } catch {
    if (project != null) {
      renderEditPage(res, project, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Project Page
router.delete('/:id', async (req, res) => {
  let project
  try {
    project = await Project.findById(req.params.id)
    await project.remove()
    res.redirect('/projects')
  } catch {
    if (project != null) {
      res.render('projects/show', {
        project: project,
        errorMessage: 'Could not remove project'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, project, hasError = false) {
  renderFormPage(res, project, 'new', hasError)
}

async function renderEditPage(res, project, hasError = false) {
  renderFormPage(res, project, 'edit', hasError)
}

async function renderFormPage(res, project, form, hasError = false) {
  try {
    const categorys = await Category.find({})
    const params = {
      categorys: categorys,
      project: project
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Project'
      } else {
        params.errorMessage = 'Error Creating Project'
      }
    }
    res.render(`projects/${form}`, params)
  } catch {
    res.redirect('/projects')
  }
}

function saveCover(project, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    project.coverImage = new Buffer.from(cover.data, 'base64')
    project.coverImageType = cover.type
  }
}

module.exports = router