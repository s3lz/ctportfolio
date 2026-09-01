"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type CreativeCodingDisc = {
  id: string;
  color: "pink" | "gray" | "blue" | "orange";
  title?: string;
  description?: string[];
  date?: string;
  href?: string;
};

type CreativeCodingViewProps = {
  discs: CreativeCodingDisc[];
};

const DESIGN_WIDTH = 1280;
const DISC_SIZE = 390.388;
const DISC_STEP = 242.388;
const CLOSED_LEFT = -81;
const OPEN_REST_LEFT = 727.16;
const DRAG_THRESHOLD = 6;
// Design places the copy at frame x 382; the track starts at frame -81.
const INFO_OFFSET_X = 463;
// Vertically centred on the open disc, which sits flush with the top of the track.
const INFO_CENTER_Y = DISC_SIZE / 2;

export default function CreativeCodingView({ discs }: CreativeCodingViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const skipClickRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startTranslate: number;
    moved: boolean;
  } | null>(null);

  const [trackWidth, setTrackWidth] = useState(DESIGN_WIDTH);

  const activeDisc = discs.find((disc) => disc.id === activeId) ?? null;

  const orderedDiscs = activeDisc
    ? [activeDisc, ...discs.filter((disc) => disc.id !== activeDisc.id)]
    : discs;

  // On a wide screen the design spacing would leave the strip short of the right
  // edge, so spread the discs until the last one runs off it. Capped at the disc
  // width so they always keep some overlap instead of drifting apart.
  const stepFor = useCallback(
    (isOpen: boolean) => {
      const firstLeft = isOpen ? OPEN_REST_LEFT : CLOSED_LEFT;
      const gaps = Math.max(1, discs.length - (isOpen ? 2 : 1));
      const spread = (trackWidth - DISC_SIZE - firstLeft) / gaps;
      return Math.min(DISC_SIZE, Math.max(DISC_STEP, spread));
    },
    [discs.length, trackWidth],
  );

  const trackBounds = useCallback(
    (isOpen: boolean) => {
      const lastLeft = isOpen
        ? OPEN_REST_LEFT + Math.max(0, discs.length - 2) * stepFor(true)
        : CLOSED_LEFT + Math.max(0, discs.length - 1) * stepFor(false);
      const contentRight = lastLeft + DISC_SIZE;
      return {
        max: Math.max(0, -CLOSED_LEFT),
        min: Math.min(0, trackWidth - contentRight),
      };
    },
    [discs.length, stepFor, trackWidth],
  );

  const updateTranslate = useCallback(
    (value: number, isOpen = Boolean(activeId)) => {
      const { min, max } = trackBounds(isOpen);
      const next = Math.min(max, Math.max(min, value));
      translateRef.current = next;
      setTranslateX(next);
    },
    [activeId, trackBounds],
  );

  useEffect(() => {
    const measure = () => {
      setTrackWidth(viewportRef.current?.clientWidth ?? DESIGN_WIDTH);
      updateTranslate(translateRef.current);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [updateTranslate]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    skipClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateRef.current,
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD && !drag.moved) {
      drag.moved = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!drag.moved) return;

    const scale =
      event.currentTarget.getBoundingClientRect().width /
      (event.currentTarget.clientWidth || 1);
    updateTranslate(drag.startTranslate + dx / (scale || 1));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (drag.moved) skipClickRef.current = true;
  };

  const openDisc = (disc: CreativeCodingDisc) => {
    if (!disc.title) return;
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    if (activeId === disc.id) {
      setActiveId(null);
      translateRef.current = 0;
      setTranslateX(0);
      return;
    }
    setActiveId(disc.id);
    translateRef.current = 0;
    setTranslateX(0);
  };

  const ignoreClickAfterDrag = (event: { preventDefault: () => void }) => {
    if (!skipClickRef.current) return;
    skipClickRef.current = false;
    event.preventDefault();
  };

  return (
    <main className="creativeCoding">
      <div className="creativeCodingFrame">
        <nav className="creativeCodingNav" aria-label="Primary navigation">
          <Link href="/">home</Link>
          <span className="creativeCodingNavGroup">
            <Link href="/sketchbook">sketchbook</Link>
            <Link href="/aboutme">about me</Link>
          </span>
        </nav>

        <header className="creativeCodingHeader">
          <h1>creative coding</h1>
          <p>projects reflecting my interest in the intersectionality of art and technology</p>
        </header>

        <div
          ref={viewportRef}
          className={`creativeCodingViewport${isDragging ? " is-dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <div
            className={`creativeCodingTrack${activeDisc ? " is-open" : ""}${
              isDragging ? "" : " is-settling"
            }`}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {orderedDiscs.map((disc, index) => {
              const isActive = disc.id === activeId;
              const left = activeDisc
                ? isActive
                  ? CLOSED_LEFT
                  : OPEN_REST_LEFT + (index - 1) * stepFor(true)
                : CLOSED_LEFT + index * stepFor(false);
              const discArt = (
                <Image
                  src={`/creativecodingpics/cd-${disc.color}.png`}
                  alt=""
                  width={DISC_SIZE}
                  height={DISC_SIZE}
                  sizes="40vw"
                  draggable={false}
                  className="creativeCodingDiscOuter"
                />
              );

              const discClass = `creativeCodingDisc is-interactive${
                isActive ? " is-active" : ""
              }`;

              if (disc.title && isActive && disc.href) {
                return (
                  <Link
                    key={disc.id}
                    href={disc.href}
                    className={discClass}
                    style={{ left }}
                    aria-label={`Open ${disc.title} project`}
                    aria-expanded={true}
                    onClick={ignoreClickAfterDrag}
                  >
                    {discArt}
                  </Link>
                );
              }

              return disc.title ? (
                <button
                  key={disc.id}
                  type="button"
                  className={discClass}
                  style={{ left }}
                  aria-label={`Open ${disc.title}`}
                  aria-expanded={isActive}
                  onClick={() => openDisc(disc)}
                >
                  {discArt}
                </button>
              ) : (
                <div
                  key={disc.id}
                  className="creativeCodingDisc"
                  style={{ left }}
                  aria-hidden="true"
                >
                  {discArt}
                </div>
              );
            })}

            {activeDisc &&
              (activeDisc.href ? (
                <Link
                  href={activeDisc.href}
                  className="creativeCodingInfo is-link"
                  style={{
                    left: CLOSED_LEFT + INFO_OFFSET_X,
                    top: INFO_CENTER_Y,
                  }}
                  aria-label={`Open ${activeDisc.title} project`}
                  onClick={ignoreClickAfterDrag}
                >
                  <h2>{activeDisc.title}</h2>
                  <div className="creativeCodingDescription">
                    {activeDisc.description?.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  {activeDisc.date && (
                    <p className="creativeCodingDate">{activeDisc.date}</p>
                  )}
                  <p className="creativeCodingGo">→ go to project</p>
                </Link>
              ) : (
                <section
                  className="creativeCodingInfo"
                  style={{
                    left: CLOSED_LEFT + INFO_OFFSET_X,
                    top: INFO_CENTER_Y,
                  }}
                  aria-live="polite"
                >
                  <h2>{activeDisc.title}</h2>
                  <div className="creativeCodingDescription">
                    {activeDisc.description?.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  {activeDisc.date && (
                    <p className="creativeCodingDate">{activeDisc.date}</p>
                  )}
                </section>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
