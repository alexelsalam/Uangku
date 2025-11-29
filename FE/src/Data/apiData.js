export default async function apiData(params, query) {
  const url = `/${params ? `${params}` : ""}${query ? `?${query}` : ""}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("apiData error:", error);
    throw error; // penting: rethrow supaya caller (Home) tahu terjadi error
  }
}
