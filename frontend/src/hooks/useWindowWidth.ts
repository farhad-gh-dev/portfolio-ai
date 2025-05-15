import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentSize = (width: number): string => {
    switch (width) {
      case 1920:
        return "desktop1920";
      case 1536:
        return "desktop1536";
      case 1366:
        return "desktop1366";
      default:
        return "default";
    }
  };

  return {
    currentSize: currentSize(width),
  };
}
