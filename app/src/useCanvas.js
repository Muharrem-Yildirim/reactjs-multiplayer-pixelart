import React from "react";

export const useCanvas = (
  contextType = "2d",
  contextAttributes = undefined
) => {
  const canvasRef = React.useRef(null);
  let canvas, context;

  const updateContext = () => {
    canvas = canvasRef.current;
    if (canvas) {
      context = canvas.getContext(contextType, contextAttributes);
    }
  };

  React.useEffect(() => {
    updateContext();
  }, []);

  return [canvasRef];
};

export default useCanvas;
