import Colors from "./colors";

const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 60;
const GRID_HEIGHT_IN_CELLS = 60;

const canvasId = "canvas";
const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
const context = canvas?.getContext("2d");

const main = () => {
  if (!canvas || !context) {
    throw new Error("Failed to initialise canvas");
  }

  canvas.height = CANVAS_HEIGHT_IN_PIXELS;
  canvas.width = CANVAS_WIDTH_IN_PIXELS;
  context.fillStyle = Colors.GRID_BACKGROUND;
  context.fillRect(0, 0, CANVAS_WIDTH_IN_PIXELS, CANVAS_HEIGHT_IN_PIXELS);
};

export default main;
