export default function generateFontScale(baseSize = 16, ratio = 1.2, rootFontSize = 16) {
  const steps = {
    xs: -2,
    sm: -1,
    base: 0,
    lg: 1,
    xl: 2,
  };

  const fontSizes = {};

  for (const [label, step] of Object.entries(steps)) {
    const sizePx = baseSize * Math.pow(ratio, step);
    const remRoot = sizePx / rootFontSize; // rem relative to rootFontSize (default 16)
    const remBase = sizePx / baseSize; // rem relative to baseSize (base becomes 1rem)

    // line-height rules
    let lhMultiplier;
    if (sizePx <= 12) lhMultiplier = 1.6;
    else if (sizePx <= 16) lhMultiplier = 1.5;
    else if (sizePx <= 20) lhMultiplier = 1.4;
    else lhMultiplier = 1.2;

    // font-size + line-height token
    fontSizes[label] = [
      parseFloat(baseSize === 16 ? remRoot.toFixed(3) : remBase.toFixed(3)) +
        "rem",
      { lineHeight: lhMultiplier },
    ];
  }

  return { fontSizes };
}