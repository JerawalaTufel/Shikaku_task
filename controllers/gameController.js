// controllers/gameController.js

const Game = require('../models/Game');
const { generateRandomRectangles, checkIfPuzzleIsSolved, generatePuzzle  } = require('../utils/gameUtils');

const initializeBoard = async (req, res) => {
  const { width, height } = req.body;

  // Generate a dynamic puzzle
  const boardState = generatePuzzle(width, height);

  const boardId = `board-${Date.now()}`;

  const game = new Game({
    boardId,
    boardState,
    rectangles: [],
  });

  await game.save();
  res.status(201).json({ boardId, boardState });
};

const generateRectangles = async (req, res) => {
  const { boardId } = req.params;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const rectangles = generateRandomRectangles(game.boardState);
  game.rectangles = rectangles;
  await game.save();

  res.status(200).json({ rectangles });
};

const handlePlayerInput = async (req, res) => {
  const { boardId, rectangleId } = req.params;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const rectangle = game.rectangles.find(rect => rect.id === rectangleId);
  if (!rectangle) {
    return res.status(404).json({ message: 'Rectangle not found' });
  }

  res.status(200).json({ rectangle });
};

const snapAndLockRectangle = async (req, res) => {
  const { boardId, rectangleId, position } = req.body;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const rectangle = game.rectangles.find(rect => rect.id === rectangleId);
  if (!rectangle) {
    return res.status(404).json({ message: 'Rectangle not found' });
  }

  // Update the rectangle's position
  rectangle.x = position.x;
  rectangle.y = position.y;

  // Check if the puzzle is solved after placing the rectangle
  console.log("gfggg");
  
  console.log(game.boardState, game.rectangles);
  
  const isSolved = checkIfPuzzleIsSolved(game.boardState, game.rectangles);
  if (isSolved) {
    game.isSolved = true;
    game.endTime = Date.now();
  }

  await game.save();
  res.status(200).json({ message: 'Rectangle snapped and locked', isSolved });
};

const checkWinCondition = async (req, res) => {
  const { boardId } = req.params;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const isSolved = checkIfPuzzleIsSolved(game.boardState, game.rectangles);
  if (isSolved) {
    game.isSolved = true;
    game.endTime = Date.now();
    await game.save();
    return res.status(200).json({ message: 'Puzzle solved!' });
  }

  res.status(200).json({ message: 'Puzzle not yet solved' });
};

const resetGame = async (req, res) => {
  const { boardId } = req.params;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  game.boardState = Array.from({ length: game.boardState.length }, () => Array(game.boardState[0].length).fill(0));
  game.rectangles = [];
  game.isSolved = false;
  game.startTime = Date.now();
  game.endTime = null;

  await game.save();
  res.status(200).json({ message: 'Game reset' });
};

const trackTime = async (req, res) => {
  const { boardId } = req.params;
  const game = await Game.findOne({ boardId });

  if (!game) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const elapsedTime = (Date.now() - game.startTime) / 1000;
  res.status(200).json({ elapsedTime });
};

module.exports = {
  initializeBoard,
  generateRectangles,
  handlePlayerInput,
  snapAndLockRectangle,
  checkWinCondition,
  resetGame,
  trackTime,
};