import React from "react";
import Image from "next/image";
import "../../app/styles/report.css";
export default function Page13() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/assets/page12.png"
        alt="Product Manual"
        width={1000}
        height={1400}
      />
    </div>
  );
}
