const express = require('express');
const ctrl = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', ctrl.create);
router.get('/', ctrl.listMine);
router.get('/:id', ctrl.getOne);

module.exports = router;
