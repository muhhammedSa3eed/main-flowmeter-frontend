// lib/fetchPreferences.ts
import { cookies } from "next/headers";
import { VisibilityState } from "@tanstack/react-table";

export async function fetchPreferences(tableName: string): Promise<VisibilityState> {
  const cookieStore = cookies();

  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch preferences");

  const json = await response.json();

  return json.preferences || {};
}
