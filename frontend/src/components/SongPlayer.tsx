import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

import "./SongPlayer.scss";

export const SongPlayer: React.FC = () => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/Dont_Fear_the_Reaper.mp3"],
      volume: 0.3,
      loop: true,
      html5: true,
      preload: true,
      onloaderror: (_id, err) => {
        console.error("Audio load error:", err);
      },
      onplayerror: () => {
        soundRef.current?.once("unlock", () => {
          soundRef.current?.play();
          setIsPlaying(true);
        });
      },
    });

    return () => {
      soundRef.current?.stop();
      soundRef.current?.unload();
    };
  }, []);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="song-player">
      <button
        onClick={togglePlay}
        className="play-button btn"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <i className="animation"></i>
        {isPlaying ? "Pause" : "Play"}
        <i className="animation"></i>
      </button>
    </div>
  );
};
