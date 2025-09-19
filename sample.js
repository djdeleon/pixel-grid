#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import generateFontScale from "./generateFontScale.js";

// Helper to snap values to 4px baseline
const snap4px = (px) => Math.round(px / 4) * 4;

inquirer
  .prompt([
    {
      type: "list",
      name: "gridSystem",
      message: "Choose what Grid System to use",
      choices: ["8 and 4 Point Grid", "2x Grid"],
    },
    {
      type: "list",
      name: "baseFontSize",
      message: "Enter Base Font Size:",
      choices: [
        { name: "16px", value: 16 },
        { name: "18px", value: 18 },
      ],
    },
    {
      type: "list",
      name: "contrastRatio",
      message: "Choose the Contrast Type Scale Ratio:",
      choices: [
        { name: "Minor Third (1.2)", value: 1.2 },
        { name: "Major Third (1.25)", value: 1.25 },
        { name: "Perfect Fourth (1.333)", value: 1.333 },
        { name: "Tritone (1.414)", value: 1.414 },
        { name: "Perfect Fifth (1.5)", value: 1.5 },
        { name: "Minor Sixth (1.6)", value: 1.6 },
        { name: "Golden Ratio (1.618)", value: 1.618 },
        { name: "Major Sixth (1.667)", value: 1.667 },
        { name: "Minor Seventh (1.778)", value: 1.778 },
        { name: "Major Seventh (1.875)", value: 1.875 },
        { name: "Octave (2.0)", value: 2.0 },
      ],
    },
    {
      type: "list",
      name: "color",
      message: "Set default Color:",
      choices: ["Slate", "Rose", "Indigo", "Sky", "Emerald", "Amber"],
    },
  ])
  .then(
    ({ gridSystem: grid, baseFontSize: base, contrastRatio: ratio, color }) => {
      color = color.toLowerCase();
      console.log(grid);
      console.log(base);
      console.log(ratio);
      console.log(color);

      const { fontSizes } = generateFontScale(base, ratio);

      console.log(fontSizes);

      // Generate Tailwind preset
      const presetFile = path.join(process.cwd(), "pixel-grid-preset.js");
      const presetContent = `
export default {
  theme: {
    fontSize: ${JSON.stringify(fontSizes)}
  },
  corePlugins: {},
  plugins: []
};`;

      fs.writeFileSync(presetFile, presetContent);

      console.log(
        "✅ Pixel Grid Tailwind preset generated: pixel-grid-tailwind.preset.js",
      );
    },
  )
  .catch((error) => console.error(error));