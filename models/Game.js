const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  boardState: { type: Array, required: true },
  rectangles: { type: Array, required: true },
  isSolved: { type: Boolean, default: false },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
});

module.exports = mongoose.model('Game', gameSchema);