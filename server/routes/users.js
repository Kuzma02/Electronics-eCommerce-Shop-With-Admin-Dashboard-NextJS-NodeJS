const express = require('express');

const router = express.Router();

const {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers 
  } = require('../controllers/users');

  router.route('/')
  .get(getAllUsers)
  .post(createUser);

  router.route('/:id')
  .get(getUser)
  .put(updateUser) 
  .delete(deleteUser); 


  module.exports = router;