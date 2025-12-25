"use client";

import ProductTable from "@/components/ProductTable";
import { fetchProducts } from "@/lib/api";
import useSWR from "swr";

export default function Products() {
  const { data: products, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    fetchProducts
  );

  if (error) return <div>Failed to load</div>;
  if (!products) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Inventory Products
      </h1>

      <ProductTable products={products} />
    </div>
  );
}
