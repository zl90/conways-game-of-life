import Colors from "./colors";

const CANVAS_WIDTH_IN_PIXELS = 600;
const CANVAS_HEIGHT_IN_PIXELS = 600;
const GRID_WIDTH_IN_CELLS = 40;
const GRID_HEIGHT_IN_CELLS = 40;
const GRID_LINE_WIDTH_IN_PIXELS = 1;

const CANVAS_ID = "canvas";

const initialiseContext = (): CanvasRenderingContext2D => {
  const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
  const context = canvas?.getContext("2d");

  if (!canvas || !context) {
    throw new Error("Canvas API unsupported on this browser");
  }

  canvas.height = CANVAS_HEIGHT_IN_PIXELS;
  canvas.width = CANVAS_WIDTH_IN_PIXELS;
  context.fillStyle = Colors.GRID_BACKGROUND;
  context.fillRect(0, 0, CANVAS_WIDTH_IN_PIXELS, CANVAS_HEIGHT_IN_PIXELS);

  return context;
};

const drawGridLines = (context: CanvasRenderingContext2D) => {
  const previousFillStyle = context.fillStyle;
  context.fillStyle = Colors.GRID_LINES;

  for (let i = 1; i < GRID_WIDTH_IN_CELLS; i++) {
    const endOfCellX = i * (CANVAS_WIDTH_IN_PIXELS / GRID_WIDTH_IN_CELLS);
    context.fillRect(
      endOfCellX,
      0,
      GRID_LINE_WIDTH_IN_PIXELS,
      CANVAS_HEIGHT_IN_PIXELS
    );
  }

  for (let i = 1; i < GRID_HEIGHT_IN_CELLS; i++) {
    const endOfCellY = i * (CANVAS_HEIGHT_IN_PIXELS / GRID_HEIGHT_IN_CELLS);
    context.fillRect(
      0,
      endOfCellY,
      CANVAS_WIDTH_IN_PIXELS,
      GRID_LINE_WIDTH_IN_PIXELS
    );
  }

  context.fillStyle = previousFillStyle;
};

const main = () => {
  const context = initialiseContext();
  drawGridLines(context);

  console.log(context);
};

export default main;
