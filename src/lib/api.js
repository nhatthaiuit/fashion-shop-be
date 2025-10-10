// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include", // nếu sau này cần cookie (auth)
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }
  return res.json();
}

// Products
export const ProductAPI = {
  list(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request(`/api/products${q ? "?" + q : ""}`);
  },
  get(id) {
    return request(`/api/products/${id}`);
  },
};

export { BASE_URL };
