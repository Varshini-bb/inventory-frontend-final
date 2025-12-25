"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { updateStock, fetchStockHistory } from "@/lib/api";
import { mutate } from "swr";

export default function StockPage() {
  const params = useParams();
  const id = params.id as string;

  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [qty, setQty] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    if (!id) return;
    const data = await fetchStockHistory(id);
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, [id]);

  const submit = async () => {
    if (qty <= 0) return;

    setLoading(true);

    await updateStock({
      productId: id,
      type,
      quantity: qty,
      note,
    });

    // reload history (products list updates via revalidatePath)
    await loadHistory();

    // Invalidate and refetch products
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/products`);

    // reset form
    setQty(0);
    setNote("");

    setLoading(false);
  };

  return (
    <div>
      <h1>Stock Movement</h1>

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="IN">Stock IN</option>
        <option value="OUT">Stock OUT</option>
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />

      <input
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>

      <h2>History</h2>

      {history.length === 0 ? (
        <p>No stock movements yet</p>
      ) : (
        <ul>
          {history.map((h: any) => (
            <li key={h._id}>
              {h.type} - {h.quantity} (
              {new Date(h.createdAt).toDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
