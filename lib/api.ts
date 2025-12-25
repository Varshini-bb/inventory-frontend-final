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
