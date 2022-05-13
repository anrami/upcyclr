const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const User = require('../models/user')

// set layout variables
router.use(function(req, res, next) {
  res.locals.currentUserId = req.session.userId;

  next();
});

router.get('/', async (req, res) => {
  let projects
  try {
    projects = await Project.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    projects = []
  }
  res.render('index', { projects: projects })
})

// login
router.get('/login', (req, res, next) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Username or password incorrect");
      next_error.status = 401;

      return next(next_error);
    } else {
      req.session.userId = user._id;

      return res.redirect('/') ;
    }
  });
});

// logout
// the user is loggedn in if they send in a correctly formatted session cookie with their request
// here we destroy the cookie to log them out
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }

  return res.redirect('/login');
});


module.exports = router