

const generateRandomRectangles = (boardState) => {
  const rectangles = [];
  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;

  console.log('Board State:', boardState);

  const canPlaceRectangle = (x, y, width, height, boardState) => {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (i >= boardHeight || j >= boardWidth || boardState[i][j] === 0) {
          return false; 
        }
      }
    }
    return true;
  };

  const markRectangle = (x, y, width, height, boardState) => {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        boardState[i][j] = 0; 
      }
    }
  };


  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const cellValue = boardState[y][x];
      if (cellValue !== 0) {
        console.log(`Found number ${cellValue} at (${x}, ${y})`);


        const possibleDimensions = [];
        for (let w = 1; w <= cellValue; w++) {
          if (cellValue % w === 0) {
            const h = cellValue / w;
            possibleDimensions.push({ width: w, height: h });
          }
        }

        let rectanglePlaced = false;
        for (const dim of possibleDimensions) {
          const { width, height } = dim;

          if (canPlaceRectangle(x, y, width, height, boardState)) {
            console.log(`Generated rectangle: ${width}x${height} at (${x}, ${y})`); 
            rectangles.push({
              id: `rect-${rectangles.length + 1}`,
              x,
              y,
              width,
              height,
            });

            markRectangle(x, y, width, height, boardState);
            rectanglePlaced = true;
            break;
          }
        }

        if (!rectanglePlaced) {
          console.log(`Failed to generate rectangle for number ${cellValue} at (${x}, ${y})`); 
        }
      }
    }
  }

  console.log('Generated Rectangles:', rectangles); 
  return rectangles;
};

const checkIfPuzzleIsSolved = (boardState, rectangles) => {

  const simulatedBoard = boardState.map(row => [...row]);

  for (const rect of rectangles) {
    const expectedNumber = rect.width * rect.height; 

    for (let i = rect.y; i < rect.y + rect.height; i++) {
      for (let j = rect.x; j < rect.x + rect.width; j++) {
        if (i >= boardState.length || j >= boardState[0].length) {
          return false;
        }

        if (simulatedBoard[i][j] !== expectedNumber) {
          return false;
        }

        simulatedBoard[i][j] = 0;
      }
    }
  }

  for (const row of simulatedBoard) {
    if (row.some(cell => cell !== 0)) {
      return false;
    }
  }

  return true;
};

const generatePuzzle = (width, height) => {
  const boardState = Array.from({ length: height }, () => Array(width).fill(0));

  const canPlaceRectangle = (x, y, rectWidth, rectHeight) => {
    for (let i = y; i < y + rectHeight; i++) {
      for (let j = x; j < x + rectWidth; j++) {
        if (i >= height || j >= width || boardState[i][j] !== 0) {
          return false;
        }
      }
    }
    return true;
  };

  const markRectangle = (x, y, rectWidth, rectHeight, number) => {
    for (let i = y; i < y + rectHeight; i++) {
      for (let j = x; j < x + rectWidth; j++) {
        boardState[i][j] = number;
      }
    }
  };

  const maxRectangles = Math.floor((width * height) / 6);
  let rectanglesPlaced = 0;

  while (rectanglesPlaced < maxRectangles) {

    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    if (boardState[y][x] !== 0) continue;

    const rectWidth = Math.floor(Math.random() * 3) + 1;
    const rectHeight = Math.floor(Math.random() * 3) + 1;

    if (canPlaceRectangle(x, y, rectWidth, rectHeight)) {
      const number = rectWidth * rectHeight;
      markRectangle(x, y, rectWidth, rectHeight, number);
      rectanglesPlaced++;
    }
  }

  return boardState;
};


module.exports = {
  generateRandomRectangles,
  checkIfPuzzleIsSolved,
  generatePuzzle
};