const express = require('express');
const router = express.Router();
const { getAll, getOne, update, remove, createStaff } = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, getAll);
router.post('/create-staff', authMiddleware, adminOnly, createStaff);
router.get('/:id', authMiddleware, adminOnly, getOne);
router.put('/:id', authMiddleware, adminOnly, update);
router.delete('/:id', authMiddleware, adminOnly, remove);

module.exports = router;
