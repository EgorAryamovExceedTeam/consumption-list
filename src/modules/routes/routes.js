const express = require('express');
const router = express.Router();

const {
    getAllConsumptions,
    createNewConsumption,
    changeThisConsumption,
    deleteThisConsumption
} = require('../controllers/consumption.controllers');

// Consumptions routes
router.get('/allConsumptions', getAllConsumptions);
router.post('/createConsumption', createNewConsumption);
router.patch('/updateConsuption', changeThisConsumption);
router.delete('/deleteConsumption', deleteThisConsumption);

module.exports = router;