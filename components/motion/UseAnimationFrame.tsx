"use client";

import { useAnimationFrame } from "motion/react";
import { useRef } from "react";
export default function RotatingCube() {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame((time) => {
    if (!ref.current) return;

    // Rotate based on time using sine function for smooth animation
    const rotateX = Math.sin(time / 1000) * 180; // Rotation along X-axis
    const rotateY = Math.cos(time / 1000) * 180; // Rotation along Y-axis

    ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  return (
    <div className="container">
      <div className="cube" ref={ref}>
        <div className="side front">
          <div className="image">
            <h4>Neuss</h4>
          </div>
        </div>
        <div className="side left">
          <div className="image">
          <h4>Neuss</h4>
          </div>
        </div>
        <div className="side right">
          <div className="image">
          <h4>Neuss</h4>
          </div>
        </div>
        <div className="side top">
          <div className="image">
          <h4>Neuss</h4>
          </div>
        </div>
        <div className="side bottom">
          <div className="image">
          <h4>Neuss</h4>
          </div>
        </div>
        <div className="side back">
          <div className="image">
          <h4>Neuss</h4>
          </div>
        </div>
      </div>
      <StyleSheet />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>{`
      .container {
        perspective: 800px;
        width: 1.5rem; /* Adjusted for half the size */
        height: 1.5rem; /* Adjusted for half the size */
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .cube {
        width: 1.5rem; /* Adjusted for half the size */
        height: 1.5rem; /* Adjusted for half the size */
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-in-out;
      }

      .side {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.7;
      }

      /* Replace colors with rgb(30, 82, 57) and rgb(195, 239, 217) */
      .front {
        transform: rotateY(0deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(30, 82, 57); /* Custom Green */
      }
      .right {
        transform: rotateY(90deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(195, 239, 217); /* Light Green */
      }
      .back {
        transform: rotateY(180deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(30, 82, 57); /* Custom Green */
      }
      .left {
        transform: rotateY(-90deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(195, 239, 217); /* Light Green */
      }
      .top {
        transform: rotateX(90deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(30, 82, 57); /* Custom Green */
      }
      .bottom {
        transform: rotateX(-90deg) translateZ(0.75rem); /* Adjusted for half the size */
        background-color: rgb(195, 239, 217); /* Light Green */
      }

      /* Image inside the cube */
      .image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.5rem;
      }

      .image Image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

    `}</style>
  );
}
