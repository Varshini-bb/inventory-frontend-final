"use client";

import { useEffect, useState } from "react";
import { updateStock, fetchStockHistory } from "@/lib/api";

export default function StockPage({ params }: any) {
  const { id } = params;
  const [type, setType] = useState("IN");
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const data = await fetchStockHistory(id);
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const submit = async () => {
    await updateStock({
      productId: id,
      type,
      quantity: qty,
      note
    });
    loadHistory();
  };

  return (
    <div>
      <h1>Stock Movement</h1>

      <select onChange={e => setType(e.target.value)}>
        <option value="IN">Stock IN</option>
        <option value="OUT">Stock OUT</option>
      </select>

      <input
        type="number"
        placeholder="Quantity"
        onChange={e => setQty(+e.target.value)}
      />

      <input
        placeholder="Note"
        onChange={e => setNote(e.target.value)}
      />

      <button onClick={submit}>Update</button>

      <h2>History</h2>
      <ul>
        {history.map((h: any) => (
          <li key={h._id}>
            {h.type} - {h.quantity} ({new Date(h.createdAt).toDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
