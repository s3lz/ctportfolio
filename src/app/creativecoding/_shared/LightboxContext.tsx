"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightboxImage = { src: string; alt: string };

type LightboxContextValue = {
  open: (image: LightboxImage) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LightboxImage | null>(null);

  const open = useCallback((image: LightboxImage) => setActive(image), []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, close]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {active && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          className="cmLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
        >
          <button
            type="button"
            className="cmLightboxClose"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.src}
            alt={active.alt}
            className="cmLightboxImage"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}
