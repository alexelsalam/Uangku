export default async function apiAuth(url, payload) {
  // const API_BASE = import.meta.env.VITE_API_URL || "";
  const newURL = `https://uangku-api.vercel.app${url}`;
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
      throw new Error(`Error: ${result.message}`);
    }
    const result = await res.json();

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
