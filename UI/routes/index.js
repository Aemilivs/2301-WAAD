var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (request, response) => {
  var payload = {
    stickers: [
      {
        title: "Sticker #1",
        content: "Sticker #1 content"
      },
      {
        title: "Sticker #2",
        content: "Sticker #2 content"
      },
      {
        title: "Sticker #3",
        content: "Sticker #3 content"
      }
    ]
  };
  response.render('index', payload);
});

module.exports = router;