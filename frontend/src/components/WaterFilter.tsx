interface WaterFilterProps {
  id?: string;
  scale?: number;
  numOfNoiseLayers?: number;
  noisePattern?: string; // Picks a different random noise pattern each time you change it.
}
export function WaterFilter({
  id = "turbulence",
  scale = 15,
  numOfNoiseLayers = 2,
  noisePattern = "S",
}: WaterFilterProps) {
  return (
    <svg style={{ position: "fixed", opacity: 0 }} width="1px" height="1px">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          id={`${id}-seed`}
          numOctaves={`${numOfNoiseLayers}`}
          seed={noisePattern}
          baseFrequency="0.0001 0.0001"
        />
        <feDisplacementMap scale={scale} in="SourceGraphic" />
      </filter>
      <animate
        xlinkHref={`#${id}-seed`}
        attributeName="baseFrequency"
        dur="40s"
        keyTimes="0;0.5;1"
        values="0.001 0.01;0.005 0.005;0.001 0.01"
        repeatCount="indefinite"
      />
    </svg>
  );
}
