const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');

// GET all points
router.get('/', pointController.getAllPoints);

// GET points by user_id
router.get('/:user_id', pointController.getPointByUserId);

// POST new points
router.post('/', pointController.createPoint);

// PUT update points
router.put('/:user_id', pointController.updatePoint);

// DELETE points
router.delete('/:user_id', pointController.deletePoint);

module.exports = router;
