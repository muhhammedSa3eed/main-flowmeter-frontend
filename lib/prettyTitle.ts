// utils/prettyTitle.ts
export function prettyTitleFromPath(pathname: string) {
    const parts = pathname.split("/").filter(Boolean);        // ['dashboard','EditRFP','8']
    if (parts.length === 0) return "Home";
  
    let candidate = parts.at(-1)!;                            // آخر جزء
    const prev       = parts.at(-2) ?? candidate;
  
    // اعتبره Dynamic ID إذا كان:
    //   1) كلّه أرقام      (مثل 8 أو 123)
    //   2) أو UUID-ish     (حروف/أرقام وشرطات 8-4-4-4-12)
    const isDynamicId =
      /^\d+$/.test(candidate) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        candidate
      );
  
    if (isDynamicId) candidate = prev;                       // استخدم الجزء السابق
  
    // حوّل kebab / snake إلى Title Case بسيط
    return candidate
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  