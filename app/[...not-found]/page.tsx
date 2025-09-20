/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [gearRotation, setGearRotation] = useState(0);

  // Rotate the gears continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setGearRotation((prevRotation) => prevRotation + 2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-sans p-4">
      <div className="bg-muted p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4 relative max-w-lg w-full">
        <div className="animate-tanker-truck">
          <svg
            className="w-14 h-14 text-gray-800 dark:text-gray-300" // Use Tailwind colors for theme control
            xmlns="http://www.w3.org/2000/svg"
            width="100px"
            height="100px"
            viewBox="0 0 47.093 47.093"
          >
            <g>
              <g>
                <path
                  fill="currentColor" // Dynamic color based on parent class
                  d="M46.852,22.406L42.02,14.89c-0.275-0.43-0.752-0.688-1.264-0.688h-6.334c-0.828,0-1.5,0.671-1.5,1.5v12.012h-4.83
                    c2.627-1.436,4.412-4.221,4.412-7.418c0-4.655-3.787-8.443-8.441-8.443H8.443C3.788,11.853,0,15.641,0,20.296
                    c0,2.973,1.548,5.586,3.876,7.092c-0.094,0.104-0.188,0.213-0.271,0.326H2.943c-0.83,0-1.5,0.672-1.5,1.5
                    c0,0.75,0.552,1.364,1.271,1.479c0.108,2.521,2.179,4.547,4.728,4.547c1.235,0,2.352-0.483,3.197-1.262
                    c0.846,0.775,1.961,1.262,3.195,1.262c2.542,0,4.605-2.012,4.729-4.522h16.36c0.121,2.513,2.188,4.522,4.729,4.522
                    c2.618,0,4.75-2.131,4.75-4.75c0-0.707-0.164-1.369-0.443-1.975l2.592-2.146c0.347-0.284,0.543-0.709,0.543-1.155v-1.997
                    C47.088,22.93,47.006,22.648,46.852,22.406z M7.429,32.228c-0.959,0-1.736-0.779-1.736-1.738c0-0.961,0.777-1.737,1.736-1.737
                    c0.961,0,1.738,0.776,1.738,1.737C9.168,31.448,8.39,32.228,7.429,32.228z M13.867,32.228c-0.959,0-1.737-0.779-1.737-1.738
                    c0-0.961,0.778-1.737,1.737-1.737c0.96,0,1.738,0.776,1.738,1.737C15.605,31.448,14.827,32.228,13.867,32.228z M39.68,32.228
                    c-0.959,0-1.735-0.779-1.735-1.738c0-0.961,0.776-1.737,1.735-1.737c0.961,0,1.738,0.776,1.738,1.737
                    C41.418,31.448,40.641,32.228,39.68,32.228z M43.162,22.218h-7.24h-0.5v-5.516h4.752l3.697,5.516H43.162z"
                />
              </g>
            </g>
          </svg>
        </div>
        <div className="text-center md:ml-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            404 - Page Not Found
          </h1>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Oops! This page is out of order or doesn’t exist.
          </p>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Check the URL or return to the control room.
          </p>
          <Link href="/" className="text-primary font-semibold text-lg">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
