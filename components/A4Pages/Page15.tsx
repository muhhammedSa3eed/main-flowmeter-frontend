import React from "react";
import Image from "next/image";
import "../../app/styles/report.css";
export default function Page15() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/assets/page15.png"
        alt="Product Manual"
        width={1000}
        height={1400}
      />
    </div>
  );
}
