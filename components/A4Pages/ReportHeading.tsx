import React from "react";

type Level = "main" | "nested" | "sub";

const classesByLevel: Record<Level, string> = {
  main: "text-2xl font-bold text-blue-700 mb-3",
  nested: "text-lg font-semibold text-orange-500 mb-2",
  sub: "text-lg font-semibold text-green-600 mb-2",
};

export default function ReportHeading({
  level = "main",
  as,
  children,
}: {
  level?: Level;
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}) {
  const Tag: React.ElementType =
    as || (level === "main" ? "h2" : level === "nested" ? "h3" : "h4");
  const cls = classesByLevel[level];
  return <Tag className={cls}>{children}</Tag>;
}
