export const calcDynamicFontSize = (
  text: string,
  {
    maxSize = 1, // px: starting font size (when at or below minChars)
    minSize = 1, // px: smallest font size (when at or above maxChars)
    minChars = 0, // chars: below or equal to this, font remains at maxSize
    maxChars = 1, // chars: at or above this, font hits minSize
  } = {}
) => {
  const len = text.length;
  const clampedLen = Math.min(Math.max(len, minChars), maxChars);
  if (maxChars === minChars) {
    return maxSize;
  }

  const factor = (clampedLen - minChars) / (maxChars - minChars);
  const size = maxSize - factor * (maxSize - minSize);
  return size;
};
