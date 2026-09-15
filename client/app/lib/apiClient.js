import next from "next";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000";

async function request(
  endpoint,
  { method = "GET", body, headers = {}, revalidate, tags = [] } = {},
) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    next: {},
  };

  if (typeof revalidate === "number") {
    config.next.revalidate = revalidate;
  }

  if (tags.length > 0) {
    config.next.tags = tags;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${baseUrl}${endpoint}`, config);

  let data;
  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const error = new Error(data?.message || "API request failed");
    error.status = res.status;
    error.data = data;
    throw error;
    // throw new Error(data?.message || "API request failed");
  }
  return data;
}

export const apiClient = {
  get: (url, options = {}) => request(url, { ...options, method: "GET" }),
  post: (url, body, options = {}) =>
    request(url, { ...options, method: "POST", body }),
  put: (url, body, options = {}) =>
    request(url, { ...options, method: "PUT", body }),
  patch: (url, body, options = {}) =>
    request(url, { ...options, method: "PATCH", body }),
  delete: (url, body, options = {}) =>
    request(url, { ...options, method: "DELETE", body }),
};
