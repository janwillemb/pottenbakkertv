var express = require('express');
var router = express.Router();
var controller = require('../controllers/index-controller');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const model = await controller.getIndexModel();
  res.render('index', model);
});

module.exports = router;
