var express = require('express');
var router = express.Router();
const { randomUUID } = require('crypto');
const StickieBoard = require('../models/stickieBoardSchema.js');

router
    .get(
        '/', 
        async (request, response) => {
            let key = request.cookies.key;
            let results = await StickieBoard.find({ key: key }).select('-__v -key').exec();

            if (results.length < 1) 
                response.status(404);
            else 
                response.status(200);
            
            response.send(results[0]);
        }
    );

router
    .get(
        '/:id', 
        async (request, response) => {
            let id = request.params.id;
            let results = await StickieBoard.find({ _id: id }).select('-__v -key').exec();

            if (results.length < 1) 
                response.status(404);
            else 
                response.status(200);
            
            response.send(results[0]);
        }
    );

router
  .post(
      '/',
      async (request, response) => {
        var board = new StickieBoard({
          stickers: request.body.stickers,
          key: randomUUID()
        });

        board = await board.save();
        response.cookie('key', board.key).status(201).send(board);
      }
    );

router
    .put(
        '/',
        async (request, response) => {
            let id = request.body.id;
            let key = request.cookies.key;

            let filter = {_id: id, key:key};
            let update = {stickers: request.body.stickers};
            let board = await StickieBoard.findOneAndUpdate(filter, update, { returnOriginal: false }).select('-__v -key');

            if (board === null)
                response.status(404);
            else
                response.status(200);
            
            response.send(board);
        }
    );

router
    .delete(
        '/:id',
        async (request, response) => {
            let id = request.params.id;
            let key = request.cookies.key;
            let board = await StickieBoard.findOneAndRemove({ _id: id, key: key }).select('-__v -key');
            if (board === null) 
                response.status(404);
            else
                response.status(200);

            response.send(board);
        }
    );


module.exports = router;
