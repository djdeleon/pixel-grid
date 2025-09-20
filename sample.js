#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import generateFontScale from "./generateFontScale.js";
import generateSpacingScale from "./generateSpacingScale.js";

inquirer
  .prompt([
    {
      type: "list",
      name: "gridSystem",
      message: "Choose what Grid System to use",
      choices: [
        { name: "8 and 4 Point Grid", value: 4 },
        { name: "2x Grid", value: 2 },
      ],
    },
    {
      type: "input",
      name: "baseFontSize",
      message: "Enter Base Font Size (px):",
      default: "16px",
      validate: function (input) {
        const num = parseInt(input);
        if (isNaN(num)) {
          return "Please enter a valid number";
        }
        return true;
      },
      filter: function (input) {
        return parseInt(input);
      },
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
  ])
  .then(
    ({ gridSystem: grid, baseFontSize: base, contrastRatio: ratio }) => {
      const fontSizes = generateFontScale(base, ratio);
      const { spacing, cssVars } = generateSpacingScale(grid);

      console.log(fontSizes)
      console.log(cssVars)

      // Generate Tailwind preset
      const presetFile = path.join(process.cwd(), "pixel-grid-preset.js");
      const presetContent = `const plugin = require("tailwindcss/plugin")

export default {
  theme: {
    fontSize: ${JSON.stringify(fontSizes)},
    extend: {
      spacing:  ${JSON.stringify(spacing)},
    }
  },
};`;

      fs.writeFileSync(presetFile, presetContent);

      console.log(
        "✅ Pixel Grid Tailwind preset generated: pixel-grid-tailwind.preset.js",
      );
    },
  )
  .catch(error => {
    if (error.name === "ExitPromptError") {
      console.log("\nInstallation terminated...");
      process.exit(0);
    }
    throw error;
  });