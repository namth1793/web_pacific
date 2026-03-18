const express = require('express');
const router = express.Router();
const { submit, getAll, updateStatus, remove } = require('../controllers/contactController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/submit', submit);
router.get('/', authMiddleware, adminOnly, getAll);
router.put('/:id/status', authMiddleware, adminOnly, updateStatus);
router.delete('/:id', authMiddleware, adminOnly, remove);

module.exports = router;
