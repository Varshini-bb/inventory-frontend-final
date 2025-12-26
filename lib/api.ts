const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Test API connection
const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products`); // ← Fixed
    console.log('API Connection Test:', response.status, response.statusText);
  } catch (error) {
    console.error('API Connection Error:', error);
  }
};

testApiConnection();

// Dashboard
export const fetchDashboard = async () => {
  console.log("=== FETCH DASHBOARD CALLED ===");
  console.log("API_URL:", API_URL);
  const res = await fetch(`${API_URL}/api/dashboard`);
  console.log("Response:", res.status);
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return res.json();
};

// Products
export const fetchProducts = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`${API_URL}/api/products`, { // ← Fixed
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Request timeout');
    } else {
      console.error('Error fetching products:', error);
    }
    throw error;
  }
};

export const fetchProduct = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`); // ← Fixed
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const res = await fetch(`${API_URL}/api/products`, { // ← Fixed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { // ← Fixed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
// Stock Management
// Stock Management
export const updateStock = async (data: {
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  note?: string;
}) => {
  const url = `${API_URL}/api/stock`;
  console.log('Making request to:', url);
  console.log('Request data:', data);
  
  try {
    const res = await fetch(url, { // ← Already correct
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Update stock error:', error);
    throw error;
  }
};

export const fetchStockHistory = async (id: string) => {
  const res = await fetch(`${API_URL}/api/stock/${id}`, { 
    cache: "no-store" 
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch stock history');
  }

  return res.json();
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { // ← Fixed
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

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

// Notifications
export const fetchNotifications = async (params?: { read?: boolean; dismissed?: boolean }) => {
  const queryParams = new URLSearchParams();
  if (params?.read !== undefined) queryParams.append('read', String(params.read));
  if (params?.dismissed !== undefined) queryParams.append('dismissed', String(params.dismissed));
  
  const url = `${API_URL}/notifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationAsRead = async (id: string) => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
};

export const markAllNotificationsAsRead = async () => {
  const res = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark all notifications as read");
  return res.json();
};

export const dismissNotification = async (id: string) => {
  const res = await fetch(`${API_URL}/notifications/${id}/dismiss`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to dismiss notification");
  return res.json();
};

export const deleteNotification = async (id: string) => {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
};

export const getNotificationSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

export const updateNotificationSettings = async (settings: any) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
};

export const triggerNotificationCheck = async () => {
  const res = await fetch(`${API_URL}/notifications/check`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to trigger check");
  return res.json();
};