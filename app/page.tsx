import ProductTable from "@/components/ProductTable";
import { fetchProducts } from "@/lib/api";

export default async function Products() {
  const products = await fetchProducts();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Inventory Products
      </h1>

      <ProductTable products={products} />
    </div>
  );
}
