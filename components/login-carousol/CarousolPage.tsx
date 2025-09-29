// "use client";

// import React, { useRef } from "react";
// import Image from "next/image";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// export default function FullScreenCarousel() {
//   const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
//   const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

//   const images = ["1.jpg", "2.jpg", "3.jpg"];

//   return (
//     <div className="w-screen h-screen overflow-hidden" ref={emblaRef}>
//       <div className="flex h-full">
//         {images.map((src, index) => (
//           <div
//             key={index}
//             className="flex-none w-screen h-screen p-3 flex items-center justify-center"
//           >
//             <Image
//               src={`/${src}`}
//               alt={`Slide ${index + 1}`}
//               fill
//               className="object-cover rounded-2xl"
//               priority={index === 0}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// & The Fade Effect Version

// "use client";

// import React, { useRef, useState, useEffect } from "react";

// const images = ["pipe.jpg", "bottels.png", "tank.png"];

// export default function FullScreenFadeCarousel() {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % images.length);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-screen h-screen relative overflow-hidden">
//       {images.map((src, index) => (
//         <img
//           key={index}
//           src={src}
//           alt={`Slide ${index + 1}`}
//           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${
//             index === current ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "bottels.jpeg",
  "tank.png",
  "pipe.png",
  "company.jpg",
  "factory.jpg",
];

export default function FullScreenFadeCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={`/carousol/${src}`}
          alt={`Slide ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover absolute inset-0 transition-opacity duration-[1500ms] ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
