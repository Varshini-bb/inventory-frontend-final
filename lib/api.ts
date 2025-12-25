const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchDashboard = async () =>
  fetch(`${API}/dashboard`).then(res => res.json());

export const fetchProducts = async () =>
  fetch(`${API}/products`).then(res => res.json());
export const updateStock = async (data: any) =>
  fetch(`${API}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const fetchStockHistory = async (id: string) =>
  fetch(`${API}/stock/${id}`).then(res => res.json());

export async function createProduct(data: {
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
}) {
  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
}
