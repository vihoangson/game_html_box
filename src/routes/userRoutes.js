const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// GET user by id
router.get('/:id', userController.getUserById);

// POST create new user
router.post('/', userController.createUser);

// PUT update user
router.put('/:id', userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

module.exports = router;
