const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/programController');
const { authMiddleware, adminOnly, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAll);
router.get('/:slug', optionalAuth, getOne);

router.post('/', authMiddleware, adminOnly, create);
router.put('/:id', authMiddleware, adminOnly, update);
router.delete('/:id', authMiddleware, adminOnly, remove);

module.exports = router;
