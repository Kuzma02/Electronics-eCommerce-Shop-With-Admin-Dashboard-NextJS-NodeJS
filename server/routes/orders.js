const express = require('express');

const router = express.Router();

const {
    getCustomerOrder,
    createCustomerOrder,
    updateCustomerOrder,
    deleteCustomerOrder,
    getAllOrders 
  } = require('../controllers/orders');

  router.route('/')
  .get(getAllOrders)
  .post(createCustomerOrder);

  router.route('/:id')
  .get(getCustomerOrder)
  .put(updateCustomerOrder) 
  .delete(deleteCustomerOrder); 


  module.exports = router;