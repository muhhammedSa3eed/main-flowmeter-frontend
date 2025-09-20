import { DeviceDB } from "@/types";

export async function getDevices(): Promise<DeviceDB[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/`, {
    method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
  });

  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }

  const devices = await response.json();
  return devices;
}
