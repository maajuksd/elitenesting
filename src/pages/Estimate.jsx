import { useState } from "react";
import "./Estimate.css";

function Estimate() {
  const [rows, setRows] = useState([
    {
      material: "",
      quantity: "",
      unit: "Nos",
      rate: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        material: "",
        quantity: "",
        unit: "Nos",
        rate: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  // Auto-resize a textarea to fit its content (so wrapped text is never cut off)
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const total = rows.reduce((sum, row) => {
    return sum + (Number(row.quantity) || 0) * (Number(row.rate) || 0);
  }, 0);

  return (
    <div className="estimate-container">

      <div className="estimate-header">

        <div>
          <h1>BUILDING CONSTRUCTION ESTIMATE</h1>
          <p className="company">
            Elite Nesting | Interior Design & Contracting
          </p>
        </div>

        <img
          src="/logo.png"
          alt="Company Logo"
          className="company-logo"
        />

      </div>

      <div className="project">

        <input placeholder="Project Name" />

        <input placeholder="Client Name" />

        <input placeholder="Estimate No." />

        <input
          type="text"
          placeholder="dd/mm/yyyy"
          pattern="\d{2}/\d{2}/\d{4}"
          title="Format: dd/mm/yyyy"
          maxLength={10}
        />

      </div>

      <table>

        <thead>

          <tr>

            <th>Sl. No</th>

            <th>Material Specification</th>

            <th>Quantity</th>

            <th>Unit</th>

            <th>Rate (₹)</th>

            <th>Amount (₹)</th>

            <th className="no-print">Action</th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => {

            const amount =
              (Number(row.quantity) || 0) *
              (Number(row.rate) || 0);

            return (
              <tr key={index}>

                <td>{index + 1}</td>

                <td>
                  <textarea
                    rows={1}
                    value={row.material}
                    onChange={(e) => {
                      handleChange(index, "material", e.target.value);
                      autoResize(e);
                    }}
                    onInput={autoResize}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                  />
                </td>

                <td>

                  <select
                    value={row.unit}
                    onChange={(e) =>
                      handleChange(index, "unit", e.target.value)
                    }
                  >
                    <option>Nos</option>
                    <option>Bag</option>
                    <option>Kg</option>
                    <option>rm</option>
                    <option>m²</option>
                    <option>m³</option>
                    <option>Litre</option>
                    <option>LS</option>
                  </select>

                </td>

                <td>
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(index, "rate", e.target.value)
                    }
                  />
                </td>

                <td>₹ {amount.toFixed(2)}</td>

                <td className="no-print">

                  <button
                    className="delete"
                    onClick={() => deleteRow(index)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

      <div className="buttons no-print">

        <button onClick={addRow}>
          Add Material
        </button>

        <button onClick={() => window.print()}>
          Print Estimate
        </button>

      </div>

      <h2 className="total print-total">
        Grand Total : ₹ {total.toLocaleString()}
      </h2>

    </div>
  );
}

export default Estimate;
