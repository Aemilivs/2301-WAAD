const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const StickieBoard = require('../models/stickieBoardSchema.js');

router
    .get(
        '/', 
        async (request, response) => {
            const key = request.cookies.key;
            const board = await StickieBoard.findOne({ key: key }).select('-__v -key').exec();

            if (board === null) 
                response.status(404);
            else 
                response.status(200);
            
            response.send(board);
        }
    );

router
    .get(
        '/:id', 
        async (request, response) => {
            let id = request.params.id;
            const board = await StickieBoard.findOne({ _id: id }).select('-__v -key').exec();

            if (board === null) 
                response.status(404);
            else 
                response.status(200);
            
            response.send(board);
        }
    );

router
  .post(
      '/',
      async (request, response) => {

        if (!request.body.stickers || request.body.stickers.length === 0)
        {
            const note = {
                content: '/help',
                colorIndex: 3
            };
            request.body.stickers = [note]
        }

        var board = new StickieBoard({
          stickers: request.body.stickers,
          key: randomUUID()
        });

        if (request.body.stickers.length > 50) {
            const payload = { "error": `Sticker board cannot contain more than 50 stickers. Your current number of stickers is ${request.body.stickers.length}.` }
            response.status(400).send(payload);
            return;
        }
        
        if (request.body.stickers.some(it => it.content.length > 380)) {
            const payload = { "error": `Sticker content cannot be longer than 380 symbols. Some of your stickers violated this constraint.` }
            response.status(400).send(payload);
            return;
        }

        board = await board.save();
        response.cookie('key', board.key).status(201).send(board);
      }
    );

router
    .put(
        '/',
        async (request, response) => {

            if (request.body.stickers.length > 50) {
                const payload = { "error": `Sticker board cannot contain more than 50 stickers. Your current number of stickers is ${request.body.stickers.length}.` }
                response.status(400).send(payload);
                return;
            }

            if (request.body.stickers.some(it => it.content.length > 380)) {
                const payload = { "error": `Sticker content cannot be longer than 380 symbols. Some of your stickers violated this constraint.` }
                response.status(400).send(payload);
                return;
            }

            const id = request.body.id;
            const key = request.cookies.key;

            const filter = {_id: id, key:key};
            const update = {stickers: request.body.stickers};
            const board = await StickieBoard.findOneAndUpdate(filter, update, { returnOriginal: false }).select('-__v -key');

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
            const id = request.params.id;
            const key = request.cookies.key;
            const board = await StickieBoard.findOneAndRemove({ _id: id, key: key }).select('-__v -key');
            if (board === null) 
                response.status(404);
            else
                response.status(200);

            response.send(board);
        }
    );


module.exports = router;
