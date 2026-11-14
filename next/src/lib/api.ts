const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function authenticatedFetch(path: string) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    return response;
  }
  return fetch(`${API_URL}${path}`, {
    credentials: "include",
  });
}