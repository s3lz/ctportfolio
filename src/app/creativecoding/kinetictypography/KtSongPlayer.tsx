"use client";

import { useEffect, useRef, useState } from "react";

type KtSongPlayerProps = {
  src: string;
  title: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

export default function KtSongPlayer({ src, title }: KtSongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      syncDuration();
    };
    const onEnded = () => setIsPlaying(false);

    // Some browsers report duration as unset (or Infinity, for certain
    // encodings) at loadedmetadata time and only correct it once playback
    // starts, so we re-check on every relevant event instead of just once.
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("canplay", syncDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("canplay", syncDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(event.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="ktSongPlayer">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className="ktSongPlayerButton"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <rect x="2" y="1" width="3" height="12" rx="1" />
            <rect x="9" y="1" width="3" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M3 1.3v11.4l9.5-5.7L3 1.3z" />
          </svg>
        )}
      </button>
      <div className="ktSongPlayerBody">
        <p className="ktSongPlayerTitle">{title}</p>
        <input
          type="range"
          className="ktSongPlayerRange"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={seek}
          aria-label="Seek"
        />
      </div>
      <span className="ktSongPlayerTime">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
