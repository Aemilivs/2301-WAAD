var express = require('express');
var router = express.Router();
const { randomUUID } = require('crypto');
const StickieBoard = require('../models/stickieBoardSchema.js');

router
  .get(
    '/', 
    async (request, response) => {
      let key = request.cookies.key;
      let board = await StickieBoard.findOne({ key: key }).select('-__v -key').exec();

      if (board !== null)
        response.redirect(`/ui/view/${board._id}`);
      else
      response.redirect(`/ui/new`);
    }
  );

router.get('/ui/view/:id', (request, response) => {
  response.render('index');
});

router
  .get(
    '/ui/new', 
    async (request, response) => {
        var board = new StickieBoard({
          stickers: request.body.stickers,
          key: randomUUID()
        });

      board = await board.save();
      response.cookie('key', board.key).redirect(`/ui/view/${board._id}`);
    }
  );

router
  .get(
    '/ui/delete/:id', 
    async (request, response) => {
        let id = request.params.id;
        let key = request.cookies.key;
        await StickieBoard.findOneAndRemove({ _id: id, key: key }).select('-__v -key');
        response.redirect('/');
      }
    );

module.exports = router;