import { useState } from "react";
import "./AreaCalculation.css";
import Canvas from "./Canvas";


export default function AreaCalculation() {
  const [points, setPoints] = useState([]);
  const [currentLength, setCurrentLength] = useState("");
  const [area, setArea] = useState(0);
  const [perimeter, setPerimeter] = useState(0);
  const [closingLength, setClosingLength] = useState(0);

  const undo = () => {
    setPoints((prev) => prev.slice(0, -1));
    setArea(0);
    setPerimeter(0);
    setClosingLength(0);
  };

  const reset = () => {
    setPoints([]);
    setCurrentLength("");
    setArea(0);
    setPerimeter(0);
    setClosingLength(0);
  };

  return (
    <div className="area-page">
      <div className="sidebar">
        <div className="logo-row">
          <img src="/logo.png" alt="Company logo" className="logo" />
        </div>

        <h2>Area Calculator</h2>

        <label>Next Side Length (m)</label>

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter length"
          value={currentLength}
          onChange={(e) => setCurrentLength(e.target.value)}
        />

        <button onClick={undo}>Undo Last Point</button>

        <button onClick={reset}>Reset</button>

        <div className="results">
          <h3>Results</h3>

          <p>
            <strong>Area:</strong> {area.toFixed(2)} m²
          </p>

          <p>
            <strong>Perimeter:</strong> {perimeter.toFixed(2)} m
          </p>

          <p>
            <strong>Closing Side:</strong> {closingLength.toFixed(2)} m
          </p>
        </div>
      </div>

      <Canvas
        points={points}
        setPoints={setPoints}
        currentLength={currentLength}
        setCurrentLength={setCurrentLength}
        setArea={setArea}
        setPerimeter={setPerimeter}
        setClosingLength={setClosingLength}
      />
    </div>
  );
}
