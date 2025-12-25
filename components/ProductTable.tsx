"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";

export default function ProductTable({ products }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

      let status = "OK";
      if (p.quantity < p.lowStockThreshold) status = "LOW";
      if (p.lastSoldAt) {
        const days =
          (Date.now() - new Date(p.lastSoldAt).getTime()) /
          (1000 * 60 * 60 * 24);
        if (days > 60) status = "DEAD";
      }

      const matchFilter = filter === "ALL" || filter === status;
      return matchSearch && matchFilter;
    });
  }, [search, filter, products]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const exportCSV = () => {
    const rows = [
      ["Name", "SKU", "Quantity"],
      ...filtered.map((p: any) => [p.name, p.sku, p.quantity])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
  };

  return (
    <div>
      <div className="controls">
        <input
          placeholder="Search name / SKU"
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="OK">OK</option>
          <option value="LOW">Low</option>
          <option value="DEAD">Dead</option>
        </select>

        <button className="btn btn-success" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((p: any) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>
                <StatusBadge
                  quantity={p.quantity}
                  lowStockThreshold={p.lowStockThreshold}
                  lastSoldAt={p.lastSoldAt}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push(`/products/${p._id}`)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
