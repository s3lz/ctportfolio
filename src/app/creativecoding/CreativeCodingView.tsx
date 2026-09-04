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
// Where the strip begins with nothing open, level with the heading above it.
// The design bled this disc off the left edge, which reads as a record that got
// cut off now that every disc on the page is a project someone can open.
const TRACK_START_LEFT = 16;
// An opened disc parks here, hanging off the edge, with its copy alongside.
const PARKED_LEFT = -81;
const OPEN_REST_LEFT = 727.16;
const DRAG_THRESHOLD = 6;
// Design places the copy at frame x 382; the parked disc sits at frame -81.
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

  // The discs keep the design's spacing at every screen width, which is what
  // leaves them overlapping like a row of records. Stretching the strip to reach
  // the right edge instead would pull them apart until they only touched.
  const trackBounds = useCallback(
    (isOpen: boolean) => {
      const lastLeft = isOpen
        ? OPEN_REST_LEFT + Math.max(0, discs.length - 2) * DISC_STEP
        : TRACK_START_LEFT + Math.max(0, discs.length - 1) * DISC_STEP;
      const contentRight = lastLeft + DISC_SIZE;
      return {
        // Only an opened disc hangs off the left, so only then is there
        // something to the left worth dragging into view.
        max: isOpen ? -PARKED_LEFT : 0,
        min: Math.min(0, trackWidth - contentRight),
      };
    },
    [discs.length, trackWidth],
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
    <main className="creativeCoding is-index">
      <div className="creativeCodingFrame">
        <nav className="creativeCodingNav" aria-label="Primary navigation">
          <Link href="/">home</Link>
          <span className="creativeCodingNavGroup">
            <Link href="/sketchbook">sketchbook</Link>
            <Link href="/aboutme">about me</Link>
          </span>
        </nav>

        <header className="creativeCodingHeader">
          <h1>projects</h1>
          <p>view my work at the intersection of art and technology</p>
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
                  ? PARKED_LEFT
                  : OPEN_REST_LEFT + (index - 1) * DISC_STEP
                : TRACK_START_LEFT + index * DISC_STEP;
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

              return disc.title ? (
                <button
                  key={disc.id}
                  type="button"
                  className={discClass}
                  style={{ left }}
                  aria-label={`${isActive ? "Close" : "Open"} ${disc.title}`}
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
                    left: PARKED_LEFT + INFO_OFFSET_X,
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
                    left: PARKED_LEFT + INFO_OFFSET_X,
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

        {/* The drag track needs horizontal room it doesn't have on a phone, so
            narrow screens get the same discs as a vertical stack that scrolls
            with the page. Tapping a disc parks it off the left edge and opens
            its copy alongside, mirroring the desktop open state. Earlier discs
            sit on top of later ones, so the stack reads as a spindle. */}
        <div className="ccStack">
          {discs.map((disc, index) => {
            const isOpen = disc.id === activeId;
            const art = (
              <Image
                src={`/creativecodingpics/cd-${disc.color}.png`}
                alt=""
                width={DISC_SIZE}
                height={DISC_SIZE}
                sizes="62vw"
                draggable={false}
                className="ccStackArt"
              />
            );

            if (!disc.title) {
              return (
                <div
                  key={disc.id}
                  className="ccStackItem"
                  style={{ zIndex: discs.length - index }}
                  aria-hidden="true"
                >
                  <span className="ccStackDisc is-static">{art}</span>
                </div>
              );
            }

            return (
              <div
                key={disc.id}
                className={`ccStackItem${isOpen ? " is-open" : ""}`}
                style={{ zIndex: isOpen ? discs.length + 1 : discs.length - index }}
              >
                <button
                  type="button"
                  className="ccStackDisc"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Close" : "Open"} ${disc.title}`}
                  onClick={() => openDisc(disc)}
                >
                  {art}
                </button>

                {disc.href ? (
                  <Link
                    href={disc.href}
                    className="ccStackInfo"
                    aria-label={`Go to ${disc.title} project`}
                  >
                    <h2>{disc.title}</h2>
                    <div className="ccStackDescription">
                      {disc.description?.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    {disc.date && <p className="ccStackDate">{disc.date}</p>}
                    <p className="ccStackGo">→ go to project</p>
                  </Link>
                ) : (
                  <div className="ccStackInfo">
                    <h2>{disc.title}</h2>
                    <div className="ccStackDescription">
                      {disc.description?.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    {disc.date && <p className="ccStackDate">{disc.date}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
