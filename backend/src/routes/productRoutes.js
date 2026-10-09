const express = require('express');
const ctrl = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/suggestions', ctrl.suggestions);
router.put('/:id', authenticate, ctrl.update);

module.exports = router;
