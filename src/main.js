"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("./colors"));
const seed_1 = require("./seed");
const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 40;
const GRID_HEIGHT_IN_CELLS = 40;
const GRID_LINE_WIDTH_IN_PIXELS = 1;
const CELL_WIDTH_IN_PIXELS = CANVAS_WIDTH_IN_PIXELS / GRID_WIDTH_IN_CELLS;
const CELL_HEIGHT_IN_PIXELS = CANVAS_HEIGHT_IN_PIXELS / GRID_HEIGHT_IN_CELLS;
const TIME_INTERVAL_IN_SECONDS = 0.33;
let intervalId;
const CANVAS_ID = "canvas";
const NEXT_BUTTON_ID = "button-next";
const PLAY_BUTTON_ID = "button-play";
const PAUSE_BUTTON_ID = "button-pause";
const CLEAR_BUTTON_ID = "button-clear";
const canvas = document.getElementById(CANVAS_ID);
const context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
const nextStepButton = document.getElementById(NEXT_BUTTON_ID);
const playButton = document.getElementById(PLAY_BUTTON_ID);
const pauseButton = document.getElementById(PAUSE_BUTTON_ID);
const clearButton = document.getElementById(CLEAR_BUTTON_ID);
if (!canvas || !context) {
    throw new Error("Canvas API unsupported on this browser");
}
const board = [];
const nextBoard = [];
const isSeedValid = seed_1.initialBoard.length === GRID_HEIGHT_IN_CELLS &&
    seed_1.initialBoard[0].length === GRID_WIDTH_IN_CELLS;
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
    for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
        for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
            const numNeighbours = getNumNeighbours(row, col);
            if (board[row][col] === "alive") {
                if (numNeighbours <= 1 || numNeighbours >= 4) {
                    nextBoard[row][col] = "dead";
                }
                else {
                    nextBoard[row][col] = "alive";
                }
            }
            else {
                if (numNeighbours === 3) {
                    nextBoard[row][col] = "alive";
                }
                else {
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
    if (isSeedValid) {
        for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
            for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
                board[row][col] = seed_1.initialBoard[row][col];
                nextBoard[row][col] = seed_1.initialBoard[row][col];
            }
        }
    }
};
const initialiseButtons = () => {
    nextStepButton.addEventListener("click", goToNextStep);
    playButton.addEventListener("click", play);
    pauseButton.addEventListener("click", pause);
    clearButton.addEventListener("click", clear);
};
const initialiseCanvas = () => {
    canvas.addEventListener("click", handleClick);
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
    for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
        for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
            drawCell(row, col);
        }
    }
    drawGridLines();
};
const play = () => {
    goToNextStep();
    progressTime();
};
const pause = () => {
    clearInterval(intervalId);
};
const progressTime = () => {
    intervalId = setInterval(goToNextStep, TIME_INTERVAL_IN_SECONDS * 1000);
};
const clear = () => {
    for (let row = 0; row < GRID_HEIGHT_IN_CELLS; row++) {
        for (let col = 0; col < GRID_WIDTH_IN_CELLS; col++) {
            board[row][col] = "dead";
            nextBoard[row][col] = "dead";
        }
    }
    pause();
    render();
};
const main = () => {
    initialiseCanvas();
    initialiseButtons();
    initialiseBoard();
    render();
};
exports.default = main;
//# sourceMappingURL=main.js.map