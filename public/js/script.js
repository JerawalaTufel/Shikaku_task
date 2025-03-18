
const socket = io();

let boardState = [];
let rectangles = [];
let boardElement;
let timerInterval;
let startTime;
let boardId;

// Initialize the game
function initializeGame() {
  fetch('/api/game/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ width: 5, height: 5 }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Board Initialized:', data);
      boardState = data.boardState;
      boardId = data.boardId;
      renderBoard();
      startTimer();
      generateRectangles(boardId);
    })
    .catch((error) => console.error('Error initializing board:', error));
}

// Render the board
function renderBoard() {
  boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${boardState[0].length}, 40px)`;
  boardElement.style.gridTemplateRows = `repeat(${boardState.length}, 40px)`;

  boardState.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;

      // Display numbers on the board
      if (cell !== 0) {
        cellElement.textContent = cell;
      }

      cellElement.addEventListener('click', () => handlePlayerInput(boardId, x, y));

      boardElement.appendChild(cellElement);
    });
  });
}

// Generate rectangles
function generateRectangles(boardId) {
  fetch(`/api/game/${boardId}/generate-rectangles`, { method: 'POST' })
    .then((response) => response.json())
    .then((data) => {
      console.log('Rectangles Generated:', data); 
      rectangles = data.rectangles;
      renderRectangles();
    })
    .catch((error) => console.error('Error generating rectangles:', error));
}

// Render rectangles on the board
function renderRectangles() {
  rectangles.forEach((rect) => {
    const rectElement = document.createElement('div');
    rectElement.classList.add('rectangle');
    rectElement.style.width = `${rect.width * 40}px`; 
    rectElement.style.height = `${rect.height * 40}px`;
    rectElement.style.left = `${rect.x * 40}px`;
    rectElement.style.top = `${rect.y * 40}px`;
    rectElement.textContent = rect.id;
    boardElement.appendChild(rectElement);
  });
}

// Handle player input (select a rectangle)
function handlePlayerInput(boardId, x, y) {
  const rectangle = rectangles.find(rect =>
    x >= rect.x && x < rect.x + rect.width &&
    y >= rect.y && y < rect.y + rect.height
  );

  if (rectangle) {
    console.log('Selected Rectangle:', rectangle);
    // Allow the player to move or snap the rectangle
    snapAndLockRectangle(boardId, rectangle.id, { x, y });
  } else {
    console.log('No rectangle found at this position');
  }
}

// Snap and lock a rectangle
function snapAndLockRectangle(boardId, rectangleId, position) {
  fetch('/api/game/snap-and-lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ boardId, rectangleId, position }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Rectangle Snapped and Locked:', data);
      if (data.isSolved) {
        checkWinCondition(boardId);
      } else {
        alert('You Lost restart the game!');
        clearInterval(timerInterval);
      }
    })
    .catch((error) => console.error('Error snapping rectangle:', error));
}

// Check win condition
function checkWinCondition(boardId) {
  fetch(`/api/game/${boardId}/check-win`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Win Condition:', data);
      if (data.message === 'Puzzle solved!') {
        alert('You won restart the game!');
        clearInterval(timerInterval);
      }
    })
    .catch((error) => console.error('Error checking win condition:', error));
}

// Start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Elapsed Time: ${elapsedTime}s`;
  }, 1000);
}

// Reset the game
document.getElementById('reset-button').addEventListener('click', () => {
  clearInterval(timerInterval);
  initializeGame();
});

// Track elapsed time
function trackTime(boardId) {
  fetch(`/api/game/${boardId}/track-time`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Elapsed Time:', data);
      document.getElementById('timer').textContent = `Elapsed Time: ${data.elapsedTime}s`;
    })
    .catch((error) => console.error('Error tracking time:', error));
}

window.onload = initializeGame;