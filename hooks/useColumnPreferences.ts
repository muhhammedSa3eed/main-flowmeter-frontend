/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useColumnPreferences = (tableName: string) => {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [tempColumnVisibility, setTempColumnVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/get/preferences/${tableName}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch preferences");

        const data = await res.json();
        const prefs = data.preferences;

        if (prefs && typeof prefs === "object") {
          setColumnVisibility(prefs);
          setTempColumnVisibility(prefs);
        }
      } catch (err) {
        toast.error("❌ Failed to load preferences:");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [tableName]);

  const savePreferences = async () => {
    try {
      await fetch("http://localhost:5000/api/users/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tableName,
          preferences: tempColumnVisibility,
        }),
      });
    } catch (err) {
        toast.error("❌ Failed to save preferences:");
    }
  };

  return {
    columnVisibility,
    tempColumnVisibility,
    setColumnVisibility,
    setTempColumnVisibility,
    savePreferences,
    loading,
  };
};
