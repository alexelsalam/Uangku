export default async function apiData(
  params,
  query,
  methoded = "GET",
  payload
) {
  // console.log(method);
  const API_BASE = import.meta.env.VITE_API_URL || "";
  console.log(API_BASE);
  const url = `${API_BASE}/transactions${params ? `/${params}` : ""}${
    query ? `?${query}` : ""
  }`;
  try {
    const res = await fetch(url, {
      method: methoded, // Default to GET if method is not provided,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: methoded === "POST" ? JSON.stringify(payload) : null,
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
