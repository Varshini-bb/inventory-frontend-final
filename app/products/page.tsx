import { fetchProducts } from "@/lib/api";

export default async function Products() {
  const products = await fetchProducts();

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Qty</th>
          <th align="left">Status</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p: any) => {
          const quantity = Number(p.quantity ?? 0);
          const threshold = Number(p.lowStockThreshold ?? 0);

          let status = "OK";
          if (quantity === 0) status = "DEAD";
          else if (quantity < threshold) status = "LOW";

          return (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{quantity}</td>
              <td>{status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
