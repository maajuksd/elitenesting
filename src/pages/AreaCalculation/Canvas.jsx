import { useState, useRef, useEffect } from "react";
import "./Canvas.css";

const SCALE = 30; // pixels per meter (zoom level of the drawing)
const CLOSE_THRESHOLD_PX = 22; // how close (in on-screen pixels) counts as "close the shape"
const ORIGIN_X = 400; // fixed anchor for world (0,0) in the virtual pixel plane
const ORIGIN_Y = 300;
const FIT_PADDING = 90;
const MIN_VIEWBOX_SIZE = 220;
const DEFAULT_VIEWBOX = { x: -300, y: -225, w: 600, h: 450 };
const MIN_ZOOM_W = 40; // most zoomed-in allowed viewBox width
const MAX_ZOOM_W = 20000; // most zoomed-out allowed viewBox width

// Points are stored in real-world meters; these convert to/from the
// virtual pixel plane used for drawing. "Up" is positive y.
function worldToPixel(p) {
  return { x: ORIGIN_X + p.x * SCALE, y: ORIGIN_Y - p.y * SCALE };
}
function pixelToWorld(p) {
  return { x: (p.x - ORIGIN_X) / SCALE, y: -(p.y - ORIGIN_Y) / SCALE };
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Shoelace formula — wraps the last point back to the first directly,
// so no extra "closing point" needs to be stored.
function polygonArea(pts) {
  let sum = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    sum += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(sum) / 2;
}

function polygonPerimeter(pts, closed) {
  let total = 0;
  const n = pts.length;
  const limit = closed ? n : n - 1;
  for (let i = 0; i < limit; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    total += distance(p1, p2);
  }
  return total;
}

// Frames a viewBox around every current point, with padding, so the
// shape always stays fully visible no matter how large the sides are.
function computeFitViewBox(points) {
  if (points.length === 0) return DEFAULT_VIEWBOX;

  const pixelPts = points.map(worldToPixel);
  const xs = pixelPts.map((p) => p.x);
  const ys = pixelPts.map((p) => p.y);
  const minX = Math.min(...xs) - FIT_PADDING;
  const maxX = Math.max(...xs) + FIT_PADDING;
  const minY = Math.min(...ys) - FIT_PADDING;
  const maxY = Math.max(...ys) + FIT_PADDING;

  const w = Math.max(maxX - minX, MIN_VIEWBOX_SIZE);
  const h = Math.max(maxY - minY, MIN_VIEWBOX_SIZE);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export default function Canvas({
  points,
  setPoints,
  currentLength,
  setCurrentLength,
  setArea,
  setPerimeter,
  setClosingLength,
}) {
  const [isClosed, setIsClosed] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
  const svgRef = useRef(null);
  const dragRef = useRef(null); // { startClientX, startClientY, startViewBox }
  const draggedRef = useRef(false);

  // Reset "closed" state and re-frame the view whenever the point list
  // changes (new point, undo, or reset from the parent).
  useEffect(() => {
    setIsClosed((wasClosed) => (points.length === 0 ? false : wasClosed));
    setViewBox(computeFitViewBox(points));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  const clientToSvg = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;
    return {
      x: viewBox.x + (e.clientX - rect.left) * scaleX,
      y: viewBox.y + (e.clientY - rect.top) * scaleY,
    };
  };

  const recalculate = (pts, closed) => {
    setPerimeter(polygonPerimeter(pts, closed));
    if (closed) {
      setArea(polygonArea(pts));
      setClosingLength(distance(pts[pts.length - 1], pts[0]));
    }
  };

  const closePolygon = () => {
    if (points.length < 3 || isClosed) return;
    setIsClosed(true);
    recalculate(points, true);
  };

  const zoomAtPoint = (factor, anchor) => {
    setViewBox((vb) => {
      const newW = vb.w * factor;
      const newH = vb.h * factor;
      if (newW < MIN_ZOOM_W || newW > MAX_ZOOM_W) return vb;
      const newX = anchor.x - (anchor.x - vb.x) * factor;
      const newY = anchor.y - (anchor.y - vb.y) * factor;
      return { x: newX, y: newY, w: newW, h: newH };
    });
  };

  const zoomAtCenter = (factor) => {
    const center = { x: viewBox.x + viewBox.w / 2, y: viewBox.y + viewBox.h / 2 };
    zoomAtPoint(factor, center);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const anchor = clientToSvg(e);
    zoomAtPoint(e.deltaY > 0 ? 1.15 : 1 / 1.15, anchor);
  };

  const handleMouseDown = (e) => {
    dragRef.current = { startClientX: e.clientX, startClientY: e.clientY, startViewBox: viewBox };
    draggedRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (points.length > 0 && !isClosed) {
      setMousePos(clientToSvg(e));
    }

    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startClientX;
      const dy = e.clientY - dragRef.current.startClientY;
      if (Math.hypot(dx, dy) > 4) {
        draggedRef.current = true;
        const rect = svgRef.current.getBoundingClientRect();
        const { startViewBox } = dragRef.current;
        const scaleX = startViewBox.w / rect.width;
        const scaleY = startViewBox.h / rect.height;
        setViewBox({
          ...startViewBox,
          x: startViewBox.x - dx * scaleX,
          y: startViewBox.y - dy * scaleY,
        });
      }
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  const handleClick = (e) => {
    // A drag just ended — don't also place a point.
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    if (isClosed) return; // finished shape — Reset to start over

    const pos = clientToSvg(e);

    if (points.length === 0) {
      setPoints([pixelToWorld(pos)]);
      return;
    }

    const lastWorld = points[points.length - 1];
    const lastPixel = worldToPixel(lastWorld);

    if (points.length >= 3) {
      const firstPixel = worldToPixel(points[0]);
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width; // svg units per on-screen pixel, at current zoom/size
      const thresholdInSvgUnits = CLOSE_THRESHOLD_PX * scaleX;
      if (distance(pos, firstPixel) <= thresholdInSvgUnits) {
        setIsClosed(true);
        recalculate(points, true);
        return;
      }
    }

    const length = parseFloat(currentLength);
    if (!length || length <= 0) {
      alert("Enter the next side length first, then click to set its direction.");
      return;
    }

    const angle = Math.atan2(-(pos.y - lastPixel.y), pos.x - lastPixel.x);
    const newWorldPoint = {
      x: lastWorld.x + length * Math.cos(angle),
      y: lastWorld.y + length * Math.sin(angle),
    };

    const newPoints = [...points, newWorldPoint];
    setPoints(newPoints);
    setCurrentLength("");
    recalculate(newPoints, false);
  };

  const renderPreview = () => {
    if (!mousePos || points.length === 0 || isClosed) return null;
    const length = parseFloat(currentLength);
    if (!length || length <= 0) return null;

    const lastWorld = points[points.length - 1];
    const lastPixel = worldToPixel(lastWorld);
    const angle = Math.atan2(-(mousePos.y - lastPixel.y), mousePos.x - lastPixel.x);

    const previewWorld = {
      x: lastWorld.x + length * Math.cos(angle),
      y: lastWorld.y + length * Math.sin(angle),
    };
    const previewPixel = worldToPixel(previewWorld);

    return (
      <line
        x1={lastPixel.x}
        y1={lastPixel.y}
        x2={previewPixel.x}
        y2={previewPixel.y}
        className="preview-line"
      />
    );
  };

  const pixelPoints = points.map(worldToPixel);
  const vbString = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
  const strokeScale = viewBox.w / 600; // keeps line/point thickness visually consistent at any zoom

  return (
    <div className="canvas-wrapper">
      <div className="zoom-controls">
        <button type="button" onClick={() => zoomAtCenter(1 / 1.3)} title="Zoom in">
          +
        </button>
        <button type="button" onClick={() => zoomAtCenter(1.3)} title="Zoom out">
          −
        </button>
        <button type="button" onClick={() => setViewBox(computeFitViewBox(points))} title="Fit to shape">
          Fit
        </button>
      </div>

      {points.length >= 3 && !isClosed && (
        <button type="button" className="close-shape-btn" onClick={closePolygon}>
          Close Shape
        </button>
      )}

      <svg
        ref={svgRef}
        viewBox={vbString}
        className="area-canvas"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {isClosed && (
          <polygon
            points={pixelPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            className="polygon-fill"
          />
        )}

        {pixelPoints.map((p, i) => {
          if (i === 0) return null;
          const prev = pixelPoints[i - 1];
          return (
            <line
              key={`side-${i}`}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              className="polygon-side"
              style={{ strokeWidth: 2.5 * strokeScale }}
            />
          );
        })}

        {isClosed && pixelPoints.length > 2 && (
          <line
            x1={pixelPoints[pixelPoints.length - 1].x}
            y1={pixelPoints[pixelPoints.length - 1].y}
            x2={pixelPoints[0].x}
            y2={pixelPoints[0].y}
            className="polygon-side closing-side"
            style={{
              strokeWidth: 2.5 * strokeScale,
              strokeDasharray: `${8 * strokeScale},${5 * strokeScale}`,
            }}
          />
        )}

        {renderPreview()}

        {pixelPoints.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r={(i === 0 ? 7 : 5) * strokeScale}
            className={i === 0 ? "point point-first" : "point"}
          />
        ))}
      </svg>

      <p className="canvas-hint">
        {points.length === 0 && "Click anywhere to place your first point."}
        {points.length > 0 &&
          !isClosed &&
          points.length < 3 &&
          "Enter the next side length, then click to set its direction."}
        {points.length >= 3 &&
          !isClosed &&
          "Enter the next length and click for direction, or click the first (yellow) point to close the shape."}
        {isClosed && "Shape closed. Click Reset to start a new one."}
        {"  •  Scroll or use +/− to zoom, drag to pan."}
      </p>
    </div>
  );
}
