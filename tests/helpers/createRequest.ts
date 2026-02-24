import { NextRequest } from "next/server";

interface CreateRequestOptions {
  method?: string;
  token?: string;
  body?: any;
  query?: Record<string, string>;
}

export function createRequest(url: string, { method = "GET", token, body, query }: CreateRequestOptions = {}) {
  const queryString = query
    ? "?" + new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString()
    : "";

  return new NextRequest(`http://localhost${url}${queryString}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
