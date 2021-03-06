const express = require('express');
const router  = express.Router();
const User = require('../models/User');


function checkRole(role) {
  return (req, res, next) => {
    if(res.locals.isBoss) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}
router.get('/add-employee', checkRole('BOSS'), (req, res, next) => {
  //req.user is defined if the user is connected
  res.render('employee/add-employee');
});


router.post('/add-employee', checkRole('BOSS'),(req, res, next) => {
  User.create({
    email:req.body.email,
    password: req.body.password,
    role: req.body.role
  })
  .then(user => {
    res.redirect('/employees')
  })
});

router.get('/employees', (req, res, next) => {
  User.find()
  .then(users =>{
    res.render('employee/employees', {users: users})
    console.log('users')
  })
})


//accesing profile to edit
router.get('/profile', (req, res, next) => {
  User.findById(req.user._id)
  .then(user =>{
    res.render('employee/profile', { 
      user
    })
  })
})


router.get("/employees/:id", checkRole('BOSS'), (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(usersFromDb => {
      res.render("employee/employee-details", {
        user: usersFromDb
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/employees/:id/edit", checkRole('BOSS'), (req, res, next) => {
  User.findById(req.params.id).then(user => {
    res.render("employee/edit", {user});
  });
});

router.post("/employee/:id/edit",  checkRole('BOSS'), (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  }).then(user => {
    res.redirect("/profile" + user._id);
  });
});


//DELETION  MISSING TEH BOSS VALIDATION
router.get('/employees/:id/delete', checkRole('BOSS'),  (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      res.redirect('/employees')
    })
})


module.exports=router;