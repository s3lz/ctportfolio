"use client";

import type { ReactNode } from "react";
import { useLightbox } from "./LightboxContext";

type ZoomableProps = {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
};

export default function Zoomable({ src, alt, children, className }: ZoomableProps) {
  const { open } = useLightbox();

  return (
    <button
      type="button"
      className={["cmZoomable", className].filter(Boolean).join(" ")}
      onClick={() => open({ src, alt })}
      aria-label={`View larger image: ${alt}`}
    >
      {children}
    </button>
  );
}
