const { randomUUID } = require('crypto');
var mongoose = require('mongoose');

var stickieBoardSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: randomUUID
  },
  stickers: [{content: String, colorIndex: Number, _id: false}],
  key: String
});

module.exports = mongoose.model('StickieBoard', stickieBoardSchema);
