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
import type { Sketch } from "./getSketches";

const OVERLAY_BY_DISTANCE = [0, 0.1, 0.4, 0.6, 0.7, 0.9];
const THUMB = 117;
const THUMB_ACTIVE = 150;
const GAP = 10;
const PAD = 20;
const INTRO_PAUSE = 600;
const SWIPE_DISTANCE = 40;

type SketchbookViewProps = {
  sketches: Sketch[];
};

function ArrowIcon() {
  return (
    <svg className="sketchbookArrowIcon" viewBox="0 0 110 110" aria-hidden="true">
      <path d="M21 55h67" strokeLinecap="butt" />
      <path d="M52 18 91 55 52 92" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SketchbookView({ sketches }: SketchbookViewProps) {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVariant, setShowVariant] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const zoomSwipeRef = useRef<{ startX: number; swiped: boolean } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const skipClickRef = useRef(false);
  const coverTouchedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startTranslate: number;
    moved: boolean;
  } | null>(null);

  const updateTranslate = (value: number) => {
    translateRef.current = value;
    setTranslateX(value);
  };

  const current = sketches[selected] ?? sketches[0];

  const centerOn = useCallback((index: number, viewportWidth: number) => {
    const offset = PAD + index * (THUMB + GAP);
    const centerOfSelected = offset + THUMB_ACTIVE / 2;
    return viewportWidth / 2 - centerOfSelected;
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      const viewport = viewportRef.current;
      if (!viewport || sketches.length === 0) return;
      const next = ((index % sketches.length) + sketches.length) % sketches.length;
      setSelected(next);
      updateTranslate(centerOn(next, viewport.clientWidth));
    },
    [centerOn, sketches.length],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsOpen(true);
      return;
    }
    const timer = window.setTimeout(() => {
      // Skipped if a click already toggled the cover, so the intro never fights the user.
      if (!coverTouchedRef.current) setIsOpen(true);
    }, INTRO_PAUSE);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const recenter = () => {
      updateTranslate(centerOn(selected, viewport.clientWidth));
    };
    recenter();
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, [centerOn, selected]);

  // Every enlarged view opens on the coloured version, whichever piece it is.
  useEffect(() => {
    setShowVariant(false);
  }, [selected, isZoomed]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && navRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsZoomed(false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        snapToIndex(selected + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        snapToIndex(selected - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, snapToIndex]);

  const nearestIndex = useCallback(
    (x: number, viewportWidth: number) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < sketches.length; i += 1) {
        const start = PAD + i * (THUMB + GAP);
        const size = i === selected ? THUMB_ACTIVE : THUMB;
        const center = x + start + size / 2;
        const dist = Math.abs(center - viewportWidth / 2);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    },
    [selected, sketches.length],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    skipClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateX,
      moved: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 6 && !drag.moved) {
      drag.moved = true;
      setIsDragging(true);
      // Capturing only after the drag threshold keeps a plain press targeting the
      // thumbnail, so its click handler still fires and selects that sketch.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!drag.moved) return;
    const scale =
      event.currentTarget.getBoundingClientRect().width /
      (event.currentTarget.clientWidth || 1);
    updateTranslate(drag.startTranslate + dx / (scale || 1));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (drag.moved) {
      skipClickRef.current = true;
      snapToIndex(nearestIndex(translateRef.current, viewport.clientWidth));
    }
  };

  const overlayFor = (index: number) => {
    if (hoveredThumb === index && index !== selected) return 0.05;
    const distance = Math.min(Math.abs(index - selected), OVERLAY_BY_DISTANCE.length - 1);
    return OVERLAY_BY_DISTANCE[distance];
  };

  if (!current) {
    return (
      <main className="sketchbook">
        <p className="sketchbookEmpty">No sketches found.</p>
      </main>
    );
  }

  return (
    <main className="sketchbook">
      <div className="sketchbookBgWrap">
        <Image
          src="/sketchbookpics/closet.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="sketchbookBg"
        />
      </div>
      <div className="sketchbookTint" />

      <nav
        className={`sketchbookNav${isMenuOpen ? " is-menu-open" : ""}`}
        ref={navRef}
      >
        <Link
          href="/"
          className="sketchbookHome"
          onClick={(event) => {
            // A touch screen has no hover to open the section links with, so
            // the first tap opens them and a second one follows the link.
            if (!isMenuOpen && window.matchMedia("(max-width: 700px)").matches) {
              event.preventDefault();
              setIsMenuOpen(true);
            }
          }}
        >
          home
        </Link>
        <div className="sketchbookMenu">
          <Link href="/creativecoding" className="sketchbookMenuLink">
            projects
          </Link>
          <Link href="/aboutme" className="sketchbookMenuLink">
            about me
          </Link>
        </div>
      </nav>

      <button
        type="button"
        className="sketchbookArrow sketchbookArrowLeft"
        aria-label="Previous sketch"
        onClick={() => snapToIndex(selected - 1)}
      >
        <ArrowIcon />
      </button>
      <button
        type="button"
        className="sketchbookArrow sketchbookArrowRight"
        aria-label="Next sketch"
        onClick={() => snapToIndex(selected + 1)}
      >
        <ArrowIcon />
      </button>

      <div className="sketchbookFrame">
        <div className="tagStage">
          <article className="hangTag pictureTag">
            <div className="hangTagHole" />
            <div className="hangTagRule hangTagRuleTop" />
            <button
              type="button"
              className="pictureTagArt"
              aria-label={`View ${current.name} larger`}
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={current.src}
                alt={current.name}
                fill
                sizes="399px"
                className="pictureTagImage"
              />
            </button>
            <div className="hangTagRule hangTagRuleMid" />
            <p className="pictureTagNo">{`NO. ${current.number}`}</p>
            <p className="pictureTagCompTitle">COMPOSITION/composition</p>
            <div className="pictureTagCompRow">
              <span>{current.medium}</span>
              <span>{current.compositionPercent}</span>
            </div>
            <p className="pictureTagBarcode">{current.code}</p>
            <div className="pictureTagFooter">
              <p className="pictureTagName">{current.name}</p>
              <p className="pictureTagSeason">{current.season}</p>
            </div>
          </article>

          <button
            type="button"
            className={`hangTag frontTag ${isOpen ? "is-open" : ""}`}
            aria-label="sketchbook cover"
            aria-pressed={isOpen}
            onClick={() => {
              coverTouchedRef.current = true;
              setIsOpen((open) => !open);
            }}
          >
            <div className="frontTagFace">
              <div className="hangTagHole" />
              <p className="frontTagName">selena zheng</p>
              <p className="frontTagLabel">“sketchbook”</p>
            </div>
          </button>
        </div>
      </div>

      <div className="galleryViewport">
        <div
          className="galleryInner"
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className={`galleryTrack${isDragging ? "" : " is-snapping"}`}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {sketches.map((sketch, index) => {
              const isSelected = index === selected;
              const isHovered = hoveredThumb === index;
              const size = isSelected ? THUMB_ACTIVE : isHovered ? 135 : THUMB;
              return (
                <button
                  key={sketch.src}
                  type="button"
                  className={`galleryThumb${isSelected ? " is-selected" : ""}${
                    isHovered && !isSelected ? " is-hovered" : ""
                  }`}
                  style={{ width: size, height: size }}
                  aria-label={sketch.name}
                  aria-current={isSelected ? "true" : undefined}
                  onPointerEnter={() => setHoveredThumb(index)}
                  onPointerLeave={() =>
                    setHoveredThumb((currentHover) =>
                      currentHover === index ? null : currentHover,
                    )
                  }
                  onClick={() => {
                    if (skipClickRef.current) {
                      skipClickRef.current = false;
                      return;
                    }
                    setIsZoomed(false);
                    snapToIndex(index);
                  }}
                >
                  <Image
                    src={sketch.src}
                    alt=""
                    fill
                    sizes="150px"
                    className="galleryThumbImage"
                  />
                  <span
                    className="galleryThumbDim"
                    style={{ background: `rgba(46, 39, 39, ${overlayFor(index)})` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isZoomed && (
        <button
          type="button"
          className="sketchZoom"
          aria-label="Close enlarged view"
          onPointerDown={(event) => {
            zoomSwipeRef.current = { startX: event.clientX, swiped: false };
          }}
          onPointerMove={(event) => {
            const swipe = zoomSwipeRef.current;
            if (!swipe || swipe.swiped || !current.hoverSrc) return;
            if (Math.abs(event.clientX - swipe.startX) < SWIPE_DISTANCE) return;
            swipe.swiped = true;
            setShowVariant((shown) => !shown);
          }}
          onClick={() => {
            // A swipe that flipped the variant shouldn't also close the view.
            if (zoomSwipeRef.current?.swiped) return;
            setIsZoomed(false);
          }}
        >
          <span
            className={`sketchZoomArt${current.hoverSrc ? " has-hover" : ""}${
              showVariant ? " is-variant" : ""
            }`}
          >
            <Image
              src={current.src}
              alt={current.name}
              fill
              sizes="(max-width: 700px) 92vw, 1180px"
              className="sketchZoomImage"
            />
            {current.hoverSrc && (
              <Image
                src={current.hoverSrc}
                alt=""
                fill
                sizes="(max-width: 700px) 92vw, 1180px"
                loading="eager"
                className="sketchZoomImage sketchZoomHover"
              />
            )}
          </span>
          {current.hoverSrc && (
            // Touch has no hover to swap the two versions with, so the swap is a
            // swipe there and these dots are what advertises it.
            <span className="sketchZoomSwipe" aria-hidden="true">
              <span className={`sketchZoomDot${showVariant ? "" : " is-on"}`} />
              <span className={`sketchZoomDot${showVariant ? " is-on" : ""}`} />
            </span>
          )}
        </button>
      )}

      {current.hoverSrc && !isZoomed && (
        // Fetches the hover variant at overlay size while the tag is showing, so the
        // first hover swaps without waiting on image optimization.
        <span className="sketchPreload" aria-hidden="true">
          <Image
            src={current.hoverSrc}
            alt=""
            fill
            sizes="(max-width: 700px) 92vw, 1180px"
            loading="eager"
          />
        </span>
      )}
    </main>
  );
}
