const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, getFeatured } = require('../controllers/articleController');
const { authMiddleware, adminOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/featured', optionalAuth, getFeatured);
router.get('/', optionalAuth, getAll);
router.get('/:slug', optionalAuth, getOne);

// Admin routes
router.post('/', authMiddleware, adminOnly, create);
router.put('/:id', authMiddleware, adminOnly, update);
router.delete('/:id', authMiddleware, adminOnly, remove);

module.exports = router;
