"use client";

export async function adminFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    const body = await res.json();
    if (!res.ok) {
      return { error: body.error ?? "Request failed" };
    }
    return { data: body as T };
  } catch {
    return { error: "Network error" };
  }
}
