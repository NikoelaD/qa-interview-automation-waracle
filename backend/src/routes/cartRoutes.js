const express = require('express');
const ctrl = require('../controllers/cartController');

const router = express.Router();

router.post('/summary', ctrl.summary);
router.delete('/items/:productId', ctrl.removeItem);

module.exports = router;
