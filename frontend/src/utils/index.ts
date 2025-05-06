export const calcDynamicFontSize = (
  text: string,
  {
    maxSize = 1, // px: starting font size
    minSize = 1, // px: smallest font size
    maxChars = 1, // px: after this many chars, font hits minSize
  } = {}
) => {
  const len = text.length;
  const clamped = Math.min(len, maxChars);
  const range = maxSize - minSize;
  const shrinkFactor = clamped / maxChars;
  const size = maxSize - range * shrinkFactor;
  return size;
};
