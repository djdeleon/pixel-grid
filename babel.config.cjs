module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" }, // compile for current Node version
      },
    ],
  ],
};
