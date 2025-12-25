import { fetchProducts } from "@/lib/api";

export default async function Products() {
  const products = await fetchProducts();

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p:any) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>{p.quantity}</td>
            <td>
              {p.quantity < p.lowStockThreshold ? "LOW" : "OK"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
