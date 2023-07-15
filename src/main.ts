import Colors from "./colors";
import { Board } from "./types";

const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 40;
const GRID_HEIGHT_IN_CELLS = 40;
const GRID_LINE_WIDTH_IN_PIXELS = 1;
const CELL_WIDTH_IN_PIXELS = CANVAS_WIDTH_IN_PIXELS / GRID_WIDTH_IN_CELLS;
const CELL_HEIGHT_IN_PIXELS = CANVAS_HEIGHT_IN_PIXELS / GRID_HEIGHT_IN_CELLS;

const CANVAS_ID = "canvas";
const NEXT_BUTTON_ID = "button-next";

const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const context = canvas?.getContext("2d");
const nextStepButton = document.getElementById(
  NEXT_BUTTON_ID
) as HTMLButtonElement;

if (!canvas || !context) {
  throw new Error("Canvas API unsupported on this browser");
}

const board: Board = [];
const nextBoard: Board = [];

const getBoardPositionFromCanvasPosition = (
  x: number,
  y: number
): { row: number; col: number } => {
  const row = Math.floor(y / CELL_HEIGHT_IN_PIXELS);
  const col = Math.floor(x / CELL_WIDTH_IN_PIXELS);

  return { row, col };
};

const getCanvasPositionFromBoardPosition = (
  row: number,
  col: number
): { x: number; y: number } => {
  const x = col * CELL_WIDTH_IN_PIXELS;
  const y = row * CELL_HEIGHT_IN_PIXELS;

  return { x, y };
};

const getNumNeighbours = (row: number, col: number): number => {
  const convolution = [
    [
      { row: row - 1, col: col - 1 },
      { row: row - 1, col: col },
      { row: row - 1, col: col + 1 },
    ],
    [
      { row: row, col: col - 1 },
      { row: row, col: col + 1 },
    ],
    [
      { row: row + 1, col: col - 1 },
      { row: row + 1, col: col },
      { row: row + 1, col: col + 1 },
    ],
  ];

  let numNeighbours = 0;

  convolution.forEach((convRow) =>
    convRow.forEach((convItem) => {
      if (
        convItem.row >= 0 &&
        convItem.row < GRID_HEIGHT_IN_CELLS &&
        convItem.col >= 0 &&
        convItem.col < GRID_WIDTH_IN_CELLS &&
        board[convItem.row][convItem.col] === "alive"
      ) {
        numNeighbours++;
      }
    })
  );

  return numNeighbours;
};

const generateNextBoard = () => {
  for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
    for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
      const numNeighbours = getNumNeighbours(row, col);
      if (board[row][col] === "alive") {
        console.log(`board[${row}][${col}] has ${numNeighbours} neighbours`);
        if (numNeighbours <= 1 || numNeighbours >= 4) {
          nextBoard[row][col] = "dead";
        } else {
          nextBoard[row][col] = "alive";
        }
      } else {
        if (numNeighbours === 3) {
          nextBoard[row][col] = "alive";
        } else {
          nextBoard[row][col] = "dead";
        }
      }
    }
  }
};

const goToNextStep = () => {
  generateNextBoard();

  for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
    for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
      board[row][col] = nextBoard[row][col];
    }
  }

  render();
};

const handleClick = (e: MouseEvent) => {
  const boardPosition = getBoardPositionFromCanvasPosition(
    e.offsetX,
    e.offsetY
  );
  if (board[boardPosition.row][boardPosition.col] === "alive") {
    board[boardPosition.row][boardPosition.col] = "dead";
  } else {
    board[boardPosition.row][boardPosition.col] = "alive";
  }
  render();
};

const initialiseBoard = () => {
  for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
    board.push(Array(GRID_WIDTH_IN_CELLS).fill("dead"));
    nextBoard.push(Array(GRID_WIDTH_IN_CELLS).fill("dead"));
  }
};

const initialiseCanvas = () => {
  canvas.addEventListener("click", handleClick);
  nextStepButton.addEventListener("click", goToNextStep);

  canvas.height = CANVAS_HEIGHT_IN_PIXELS;
  canvas.width = CANVAS_WIDTH_IN_PIXELS;
};

const drawGridLines = () => {
  const previousFillStyle = context.fillStyle;
  context.fillStyle = Colors.GRID_LINES;

  for (let i = 1; i < GRID_WIDTH_IN_CELLS; i++) {
    const endOfCellX = i * CELL_WIDTH_IN_PIXELS;
    context.fillRect(
      endOfCellX,
      0,
      GRID_LINE_WIDTH_IN_PIXELS,
      CANVAS_HEIGHT_IN_PIXELS
    );
  }

  for (let i = 1; i < GRID_HEIGHT_IN_CELLS; i++) {
    const endOfCellY = i * CELL_HEIGHT_IN_PIXELS;
    context.fillRect(
      0,
      endOfCellY,
      CANVAS_WIDTH_IN_PIXELS,
      GRID_LINE_WIDTH_IN_PIXELS
    );
  }

  context.fillStyle = previousFillStyle;
};

const drawCell = (row: number, col: number) => {
  const canvasPosition = getCanvasPositionFromBoardPosition(row, col);

  context.fillStyle =
    board[row][col] === "alive" ? Colors.CELL_ALIVE : Colors.CELL_DEAD;
  context.fillRect(
    canvasPosition.x,
    canvasPosition.y,
    CELL_WIDTH_IN_PIXELS,
    CELL_HEIGHT_IN_PIXELS
  );
};

const render = () => {
  for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
    for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
      drawCell(row, col);
    }
  }

  drawGridLines();
};

const main = () => {
  initialiseCanvas();
  initialiseBoard();
  render();
};

export default main;
