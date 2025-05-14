import React, { useEffect, useRef } from "react";
import { Howl } from "howler";

export const SongPlayer: React.FC = () => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/Dont_Fear_the_Reaper.mp3"],
      volume: 0.3,
      loop: true,
      autoplay: true,
      html5: true,
      preload: true,
      onloaderror: (_id, err) => {
        console.error("Audio load error:", err);
      },
      onplayerror: () => {
        soundRef.current?.once("unlock", () => {
          soundRef.current?.play();
        });
      },
    });

    soundRef.current.play();

    return () => {
      soundRef.current?.stop();
      soundRef.current?.unload();
    };
  }, []);

  return null;
};
