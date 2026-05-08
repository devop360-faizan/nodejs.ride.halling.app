const express = require('express');
const router = express.Router();
const { create, getAll, join, leave, getMessages, sendMessage } = require('../controllers/roomController');

const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.verifyToken);

router.post('/', create);
router.get('/', getAll);
router.post('/:id/join', join);
router.post('/:id/leave', leave);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;