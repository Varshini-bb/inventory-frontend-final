const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Dashboard
export const fetchDashboard = async () =>
  fetch(`${API_URL}/dashboard`).then(res => res.json());

// Products
export const fetchProducts = async () =>
  fetch(`${API_URL}/products`, { cache: "no-store" }).then(res => res.json());

export const fetchProduct = async (id: string) =>
  fetch(`${API_URL}/products/${id}`, { cache: "no-store" }).then(res => res.json());

export async function createProduct(data: {
  name: string;
  sku: string;
  quantity?: number;
  lowStockThreshold?: number;
  description?: string;
  category?: string;
  tags?: string[];
  unit?: string;
  costPrice?: number;
  sellingPrice?: number;
  hasVariants?: boolean;
  variants?: any[];
}) {
  const res = await fetch(`${API_URL}/products`, {
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

export async function updateProduct(id: string, data: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
}

export async function duplicateProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}/duplicate`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to duplicate product");
  }

  return res.json();
}

// Product Images
export async function uploadProductImages(id: string, files: FileList) {
  try {
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    console.log(" Uploading images for product:", id);
    console.log(" Number of files:", files.length);

    const res = await fetch(`${API_URL}/products/${id}/images`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    console.log(" Response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
      console.error(" Upload error:", errorData);
      throw new Error(errorData.error || "Failed to upload images");
    }

    const data = await res.json();
    console.log(" Upload successful:", data);
    return data;
  } catch (error) {
    console.error(" Upload error:", error);
    throw error;
  }
}

export async function deleteProductImage(id: string, imageUrl: string) {
  const res = await fetch(
    `${API_URL}/products/${id}/images/${encodeURIComponent(imageUrl)}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }

  return res.json();
}

// Barcode
export async function generateBarcode(id: string) {
  const res = await fetch(`${API_URL}/products/${id}/generate-barcode`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to generate barcode");
  }

  return res.json();
}

// Stock Management
export const updateStock = async (data: {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  note?: string;
}) =>
  fetch(`${API_URL}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const fetchStockHistory = async (id: string) =>
  fetch(`${API_URL}/stock/${id}`, { cache: "no-store" }).then((res) =>
    res.json()
  );