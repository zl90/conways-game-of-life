"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("./colors"));
const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 40;
const GRID_HEIGHT_IN_CELLS = 40;
const GRID_LINE_WIDTH_IN_PIXELS = 1;
const CELL_WIDTH_IN_PIXELS = CANVAS_WIDTH_IN_PIXELS / GRID_WIDTH_IN_CELLS;
const CELL_HEIGHT_IN_PIXELS = CANVAS_HEIGHT_IN_PIXELS / GRID_HEIGHT_IN_CELLS;
const CANVAS_ID = "canvas";
const NEXT_BUTTON_ID = "button-next";
const canvas = document.getElementById(CANVAS_ID);
const context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
const nextStepButton = document.getElementById(NEXT_BUTTON_ID);
if (!canvas || !context) {
    throw new Error("Canvas API unsupported on this browser");
}
let board = [];
const nextBoard = [];
const getBoardPositionFromCanvasPosition = (x, y) => {
    const row = Math.floor(y / CELL_HEIGHT_IN_PIXELS);
    const col = Math.floor(x / CELL_WIDTH_IN_PIXELS);
    return { row, col };
};
const getCanvasPositionFromBoardPosition = (row, col) => {
    const x = col * CELL_WIDTH_IN_PIXELS;
    const y = row * CELL_HEIGHT_IN_PIXELS;
    return { x, y };
};
const getNumNeighbours = (row, col) => {
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
    convolution.forEach((convRow) => convRow.forEach((convItem) => {
        if (convItem.row >= 0 &&
            convItem.row < GRID_HEIGHT_IN_CELLS &&
            convItem.col >= 0 &&
            convItem.col < GRID_WIDTH_IN_CELLS &&
            board[convItem.row][convItem.col] === "alive") {
            numNeighbours++;
        }
    }));
    return numNeighbours;
};
const generateNextBoard = () => {
    board.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
        const numNeighbours = getNumNeighbours(rowIndex, colIndex);
        if (board[rowIndex][colIndex] === "alive") {
            if (numNeighbours <= 1 || numNeighbours >= 4) {
                nextBoard[rowIndex][colIndex] = "dead";
            }
            else {
                nextBoard[rowIndex][colIndex] = "alive";
            }
        }
        else {
            if (numNeighbours === 3) {
                nextBoard[rowIndex][colIndex] = "alive";
            }
            else {
                nextBoard[rowIndex][colIndex] = "dead";
            }
        }
    }));
};
const goToNextStep = () => {
    generateNextBoard();
    board = nextBoard;
    render();
};
const handleClick = (e) => {
    const boardPosition = getBoardPositionFromCanvasPosition(e.offsetX, e.offsetY);
    if (board[boardPosition.row][boardPosition.col] === "alive") {
        board[boardPosition.row][boardPosition.col] = "dead";
    }
    else {
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
    context.fillStyle = colors_1.default.GRID_LINES;
    for (let i = 1; i < GRID_WIDTH_IN_CELLS; i++) {
        const endOfCellX = i * CELL_WIDTH_IN_PIXELS;
        context.fillRect(endOfCellX, 0, GRID_LINE_WIDTH_IN_PIXELS, CANVAS_HEIGHT_IN_PIXELS);
    }
    for (let i = 1; i < GRID_HEIGHT_IN_CELLS; i++) {
        const endOfCellY = i * CELL_HEIGHT_IN_PIXELS;
        context.fillRect(0, endOfCellY, CANVAS_WIDTH_IN_PIXELS, GRID_LINE_WIDTH_IN_PIXELS);
    }
    context.fillStyle = previousFillStyle;
};
const drawCell = (row, col) => {
    const canvasPosition = getCanvasPositionFromBoardPosition(row, col);
    context.fillStyle =
        board[row][col] === "alive" ? colors_1.default.CELL_ALIVE : colors_1.default.CELL_DEAD;
    context.fillRect(canvasPosition.x, canvasPosition.y, CELL_WIDTH_IN_PIXELS, CELL_HEIGHT_IN_PIXELS);
};
const render = () => {
    board.forEach((row, rowIndex) => row.forEach((col, colIndex) => drawCell(rowIndex, colIndex)));
    drawGridLines();
};
const main = () => {
    initialiseCanvas();
    initialiseBoard();
    render();
};
exports.default = main;
//# sourceMappingURL=main.js.map