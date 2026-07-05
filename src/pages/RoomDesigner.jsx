import { useState, useRef } from "react";
import "./RoomDesigner.css";

const COLS = 12;
const ROWS = 8;
const CELL = 48; // px per grid cell
const WALL_HEIGHT = 160; // px, height of the back/left walls in 3D view
const STARTING_BUDGET = 500;

// height = how tall the piece stands in the 3D view (px)
const CATALOG = [
  { id: "bed", name: "Bed", icon: "🛏️", w: 2, h: 3, cost: 150, color: "#f4a6c1", height: 34 },
  { id: "wardrobe", name: "Wardrobe", icon: "🚪", w: 1, h: 2, cost: 100, color: "#a9714a", height: 130 },
  { id: "sofa", name: "Sofa", icon: "🛋️", w: 3, h: 1, cost: 120, color: "#6fa8dc", height: 46 },
  { id: "table", name: "Table", icon: "🍽️", w: 2, h: 1, cost: 60, color: "#c99a52", height: 44 },
  { id: "chair", name: "Chair", icon: "🪑", w: 1, h: 1, cost: 30, color: "#8e6cc9", height: 46 },
  { id: "tv", name: "TV Stand", icon: "📺", w: 2, h: 1, cost: 90, color: "#4a4e5a", height: 50 },
  { id: "plant", name: "Plant", icon: "🪴", w: 1, h: 1, cost: 25, color: "#5cab6e", height: 60 },
  { id: "rug", name: "Rug", icon: "▦", w: 3, h: 2, cost: 40, color: "#e8b34f", height: 3 },
  { id: "lamp", name: "Lamp", icon: "💡", w: 1, h: 1, cost: 35, color: "#e8c14f", height: 70 },
  { id: "shelf", name: "Bookshelf", icon: "📚", w: 1, h: 2, cost: 80, color: "#8a5a3a", height: 120 },
];

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export default function RoomDesigner() {
  const [budget, setBudget] = useState(STARTING_BUDGET);
  const [placed, setPlaced] = useState([]); // {uid, itemId, x, y, w, h}
  const [selectedId, setSelectedId] = useState(null);
  const [rotated, setRotated] = useState(false);
  const [hoverCell, setHoverCell] = useState(null);
  const [viewMode, setViewMode] = useState("2d"); // "2d" | "3d"
  const [message, setMessage] = useState("Pick something from the catalog, then click the room to place it.");
  const roomRef = useRef(null);
  const nextUid = useRef(1);

  const selectedItem = CATALOG.find((c) => c.id === selectedId) || null;
  const footprint = selectedItem
    ? rotated
      ? { w: selectedItem.h, h: selectedItem.w }
      : { w: selectedItem.w, h: selectedItem.h }
    : null;

  const cozyScore = placed.reduce((sum, p) => {
    const item = CATALOG.find((c) => c.id === p.itemId);
    return sum + (item ? Math.round(item.cost / 10) : 0);
  }, 0);

  const pickItem = (item) => {
    if (viewMode === "3d") {
      setMessage("Switch back to 2D to keep decorating — 3D is just for viewing your room.");
      return;
    }
    if (item.cost > budget) {
      setMessage(`Not enough coins for a ${item.name.toLowerCase()} — you need ${item.cost}, you have ${budget}.`);
      return;
    }
    setSelectedId(item.id);
    setRotated(false);
    setMessage(`${item.name} selected. Click the room to place it, or Rotate first.`);
  };

  const cellFromEvent = (e) => {
    const rect = roomRef.current.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL);
    const row = Math.floor((e.clientY - rect.top) / CELL);
    return { col, row };
  };

  const handleMouseMove = (e) => {
    if (viewMode !== "2d" || !selectedItem) return;
    const { col, row } = cellFromEvent(e);
    setHoverCell({ col, row });
  };

  const isValidPlacement = (x, y, w, h) => {
    if (x < 0 || y < 0 || x + w > COLS || y + h > ROWS) return false;
    const candidate = { x, y, w, h };
    return !placed.some((p) => rectsOverlap(candidate, p));
  };

  const handleRoomClick = (e) => {
    if (viewMode !== "2d" || !selectedItem || !footprint) return;
    const { col, row } = cellFromEvent(e);
    const x = Math.min(Math.max(col, 0), COLS - footprint.w);
    const y = Math.min(Math.max(row, 0), ROWS - footprint.h);

    if (!isValidPlacement(x, y, footprint.w, footprint.h)) {
      setMessage("That spot won't work — it's off the room or overlapping something.");
      return;
    }

    setPlaced((prev) => [
      ...prev,
      { uid: nextUid.current++, itemId: selectedItem.id, x, y, w: footprint.w, h: footprint.h },
    ]);
    setBudget((b) => b - selectedItem.cost);
    setMessage(`Placed a ${selectedItem.name.toLowerCase()}. Pick another item, or click a placed one to remove it.`);
  };

  const removePlaced = (uid, e) => {
    e.stopPropagation();
    const target = placed.find((p) => p.uid === uid);
    if (!target) return;
    const item = CATALOG.find((c) => c.id === target.itemId);
    setPlaced((prev) => prev.filter((p) => p.uid !== uid));
    if (item) setBudget((b) => b + item.cost);
    setMessage(`Removed the ${item ? item.name.toLowerCase() : "item"} and refunded your coins.`);
  };

  const resetRoom = () => {
    setPlaced([]);
    setBudget(STARTING_BUDGET);
    setSelectedId(null);
    setRotated(false);
    setMessage("Room cleared. Pick something from the catalog to start again.");
  };

  const ghostValid =
    viewMode === "2d" && selectedItem && hoverCell
      ? isValidPlacement(
          Math.min(Math.max(hoverCell.col, 0), COLS - footprint.w),
          Math.min(Math.max(hoverCell.row, 0), ROWS - footprint.h),
          footprint.w,
          footprint.h
        )
      : false;

  return (
    <div className="rd-page">
      <aside className="rd-catalog">
        <h2 className="rd-title">Room Designer</h2>
        <p className="rd-subtitle">Furnish the room, one piece at a time.</p>

        <div className="rd-stats">
          <div className="rd-coin-badge">
            <span className="rd-coin-icon">🪙</span>
            <span>{budget}</span>
          </div>
          <div className="rd-score">
            Cozy Score <strong>{cozyScore}</strong>
          </div>
        </div>

        <div className="rd-items">
          {CATALOG.map((item) => (
            <button
              key={item.id}
              className={`rd-item${selectedId === item.id ? " rd-item-active" : ""}${
                item.cost > budget ? " rd-item-disabled" : ""
              }`}
              onClick={() => pickItem(item)}
              style={{ "--swatch": item.color }}
            >
              <span className="rd-item-icon">{item.icon}</span>
              <span className="rd-item-name">{item.name}</span>
              <span className="rd-item-cost">🪙 {item.cost}</span>
            </button>
          ))}
        </div>

        {selectedItem && viewMode === "2d" && (
          <button className="rd-rotate-btn" onClick={() => setRotated((r) => !r)}>
            ⟳ Rotate {selectedItem.name}
          </button>
        )}

        <button className="rd-reset-btn" onClick={resetRoom}>
          Clear Room
        </button>
      </aside>

      <main className="rd-room-area">
        <div className="rd-view-toggle">
          <button
            className={`rd-toggle-btn${viewMode === "2d" ? " rd-toggle-active" : ""}`}
            onClick={() => setViewMode("2d")}
          >
            📐 2D Edit
          </button>
          <button
            className={`rd-toggle-btn${viewMode === "3d" ? " rd-toggle-active" : ""}`}
            onClick={() => setViewMode("3d")}
          >
            🏠 View in 3D
          </button>
        </div>

        {viewMode === "2d" ? (
          <div
            ref={roomRef}
            className="rd-room"
            style={{ width: COLS * CELL, height: ROWS * CELL }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCell(null)}
            onClick={handleRoomClick}
          >
            {placed.map((p) => {
              const item = CATALOG.find((c) => c.id === p.itemId);
              return (
                <div
                  key={p.uid}
                  className="rd-furniture"
                  title="Click to remove"
                  onClick={(e) => removePlaced(p.uid, e)}
                  style={{
                    left: p.x * CELL,
                    top: p.y * CELL,
                    width: p.w * CELL,
                    height: p.h * CELL,
                    background: item ? item.color : "#999",
                  }}
                >
                  <span className="rd-furniture-icon">{item ? item.icon : "?"}</span>
                </div>
              );
            })}

            {selectedItem && hoverCell && footprint && (
              <div
                className={`rd-ghost${ghostValid ? " rd-ghost-valid" : " rd-ghost-invalid"}`}
                style={{
                  left: Math.min(Math.max(hoverCell.col, 0), COLS - footprint.w) * CELL,
                  top: Math.min(Math.max(hoverCell.row, 0), ROWS - footprint.h) * CELL,
                  width: footprint.w * CELL,
                  height: footprint.h * CELL,
                }}
              />
            )}
          </div>
        ) : (
          <div className="rd-stage">
            <div className="rd-room3d" style={{ width: COLS * CELL, height: ROWS * CELL }}>
              <div className="rd-floor3d" />

              <div
                className="rd-wall3d rd-wall-back"
                style={{ width: COLS * CELL, height: WALL_HEIGHT }}
              />
              <div
                className="rd-wall3d rd-wall-left"
                style={{ width: WALL_HEIGHT, height: ROWS * CELL }}
              />

              {placed.map((p) => {
                const item = CATALOG.find((c) => c.id === p.itemId);
                const h = item ? item.height : 40;
                return (
                  <div
                    key={p.uid}
                    className="rd-box3d"
                    onClick={(e) => removePlaced(p.uid, e)}
                    title="Click to remove"
                    style={{
                      left: p.x * CELL,
                      top: p.y * CELL,
                      width: p.w * CELL,
                      height: p.h * CELL,
                    }}
                  >
                    <div
                      className="rd-box-top"
                      style={{ background: item ? item.color : "#999", transform: `translateZ(${h}px)` }}
                    >
                      <span className="rd-box-icon">{item ? item.icon : "?"}</span>
                    </div>
                    <div
                      className="rd-box-front"
                      style={{ height: h, background: item ? item.color : "#999" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="rd-message">{message}</p>
      </main>
    </div>
  );
}
