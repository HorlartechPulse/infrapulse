const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4900/api/v1";

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json as T;
}

export async function postApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { method: "POST", cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json as T;
}
