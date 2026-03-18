const express = require('express');
const router = express.Router();
const { getByArticle, create, getAll, approve, reject, remove } = require('../controllers/commentController');
const { authMiddleware, moderatorOrAdmin, optionalAuth } = require('../middleware/auth');

// Public / optional auth
router.get('/article/:articleId', optionalAuth, getByArticle);
router.post('/', optionalAuth, create);

// Moderator / Admin
router.get('/', authMiddleware, moderatorOrAdmin, getAll);
router.put('/:id/approve', authMiddleware, moderatorOrAdmin, approve);
router.put('/:id/reject', authMiddleware, moderatorOrAdmin, reject);
router.delete('/:id', authMiddleware, moderatorOrAdmin, remove);

module.exports = router;
