import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function App() {
  const [type, setType] = useState('pic');
  const [size, setSize] = useState(20);
  const [count, setCount] = useState(2);
  const [puzzles, setPuzzles] = useState([]);

  const generatePuzzle = (id) => {
    // dummy puzzle as grid for now
    const grid = Array(size).fill(null).map(() => Array(size).fill(' '));
    return { id, grid };
  };

  const generateAll = () => {
    const newPuzzles = [];
    for (let i = 0; i < count; i++) {
      newPuzzles.push(generatePuzzle(i + 1));
    }
    setPuzzles(newPuzzles);
  };

  const exportPDF = async () => {
    const pdf = new jsPDF();
    for (let i = 0; i < puzzles.length; i++) {
      const el = document.getElementById(`puzzle-${puzzles[i].id}`);
      // eslint-disable-next-line
      const canvas = await html2canvas(el);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 190);
      if (i < puzzles.length - 1) pdf.addPage();
    }
    pdf.save('puzzles.pdf');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Pic & Fill Puzzles Generator</h1>
      <div>
        <label>Type: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pic">Pic-a-Pix</option>
          <option value="fill">Fill-a-Pix</option>
        </select>
      </div>
      <div>
        <label>Size: </label>
        <select value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
          <option value={15}>15x15</option>
          <option value={20}>20x20</option>
          <option value={25}>25x25</option>
          <option value={30}>30x30</option>
        </select>
      </div>
      <div>
        <label>Count: </label>
        <input type="number" min="1" max="10" value={count} onChange={(e) => setCount(parseInt(e.target.value))} />
      </div>
      <button onClick={generateAll}>Generate</button>
      <button onClick={exportPDF} disabled={!puzzles.length}>Export PDF</button>
      <div style={{ marginTop: 20 }}>
        {puzzles.map((p) => (
          <div key={p.id} id={`puzzle-${p.id}`} style={{ marginBottom: 20 }}>
            <h3>{type} #{p.id} ({size}x{size})</h3>
            <table style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {p.grid.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ border: '1px solid #000', width: 15, height: 15, textAlign: 'center' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
