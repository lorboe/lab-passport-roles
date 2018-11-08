const express = require('express');
const router  = express.Router();
const Course = require('../models/Course');

function checkIsTA(role) {
  return (req, res, next) => {
    if(res.locals.isTA) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}

router.get('/add', checkIsTA('TA'), (req, res, next) => {
  //req.user is defined if the user is connected
  res.render('courses/add-course');
});


router.post('/', checkIsTA('TA'),(req, res, next) => {
  Course.create({
    name:req.body.name,
    description: req.body.description,
  })
  .then(course => {
    res.redirect('/courses')
  })
});

router.get('/', (req, res, next) => {
  Course.find()
  .then(courses =>{
    res.render('courses/courses', {courses: courses})
    console.log('courses')
  })
})





module.exports=router;