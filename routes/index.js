var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (request, response) => {
  response.render('index');
});

router.get('/new', (request, response) => {
  response.render('index');
});

router.get('/delete/:id', (request, response) => {
  response.render('index');
});

module.exports = router;