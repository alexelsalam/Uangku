/// <reference types="vite/client" />

export default async function apiAuth(url: string, payload: unknown) {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const newURL = `${API_BASE}${url}`;
  try {
    const res = await fetch(newURL, {
      method: "POST", // Default to GET if method is not provided,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
