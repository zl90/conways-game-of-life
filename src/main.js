"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("./colors"));
const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 60;
const GRID_HEIGHT_IN_CELLS = 60;
const canvasId = "canvas";
const canvas = document.getElementById(canvasId);
const context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
const main = () => {
    if (!canvas || !context) {
        throw new Error("Failed to initialise canvas");
    }
    canvas.height = CANVAS_HEIGHT_IN_PIXELS;
    canvas.width = CANVAS_WIDTH_IN_PIXELS;
    context.fillStyle = colors_1.default.GRID_BACKGROUND;
    context.fillRect(0, 0, CANVAS_WIDTH_IN_PIXELS, CANVAS_HEIGHT_IN_PIXELS);
};
exports.default = main;
