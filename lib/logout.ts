// app/lib/auth.client.ts
"use client";
import Cookies from "js-cookie";

export async function logout(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`,
    { method: "POST", credentials: "include" }
  );

  if (!res.ok) {
    const { message = "Logout failed" } = await res.json().catch(() => ({}));
    return { success: false, message };
  }

  const all = Cookies.get() ?? {};
  Object.keys(all).forEach((k) => Cookies.remove(k));

  return { success: true, message: "Logged out successfully." };
}
