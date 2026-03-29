/// <reference types="vite/client" />

export default async function apiData(
  params?: string | number | null,
  query?: string | null,
  method: string = "GET",
  payload?: unknown,
) {
  // console.log(method);
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const url = `${API_BASE}/transactions${params ? `/${params}` : ""}${
    query ? `?${query}` : ""
  }`;
  try {
    const res = await fetch(url, {
      method, // Default to GET if method is not provided,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(payload) : null,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error: ${errorData.message || res.statusText}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
