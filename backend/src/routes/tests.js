const express = require('express');
const router = express.Router();
const { getAll, getOne, submit, getMyResults, create, update, remove } = require('../controllers/testController');
const { authMiddleware, adminOnly, optionalAuth } = require('../middleware/auth');

router.get('/results/my', authMiddleware, getMyResults);
router.get('/', optionalAuth, getAll);
router.get('/:slug', optionalAuth, getOne);
router.post('/:id/submit', authMiddleware, submit);

router.post('/', authMiddleware, adminOnly, create);
router.put('/:id', authMiddleware, adminOnly, update);
router.delete('/:id', authMiddleware, adminOnly, remove);

module.exports = router;
