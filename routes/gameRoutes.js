const express = require('express');
const {
    initializeBoard,
    generateRectangles,
    handlePlayerInput,
    snapAndLockRectangle,
    checkWinCondition,
    resetGame,
    trackTime
} = require('../controllers/gameController');

const router = express.Router();

router.post('/initialize', initializeBoard);
router.post('/:boardId/generate-rectangles', generateRectangles);
router.get('/:boardId/rectangle/:rectangleId', handlePlayerInput);
router.post('/snap-and-lock', snapAndLockRectangle);
router.get('/:boardId/check-win', checkWinCondition);
router.post('/:boardId/reset', resetGame);
router.get('/:boardId/track-time', trackTime);

module.exports = router;