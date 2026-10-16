// ============================================
// Karma + Jasmine para El Volcán Market.
// La app corre con Vite, pero Karma no se integra con Vite, así que
// para las pruebas Karma usa webpack + Babel (solo en este archivo).
//
//   npm test            -> corre todas las pruebas una vez (ChromeHeadless)
//   npm run test:watch  -> deja Chrome abierto y re-ejecuta al guardar
//
// Cobertura: se genera en coverage/ (abrir coverage/html/index.html).
// ============================================
const path = require("path");

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      { pattern: "test/**/*.spec.js?(x)", watched: false },
      // Imágenes de public/ para que los <img src="/img/..."> no den 404.
      { pattern: "public/img/**", included: false, served: true, watched: false },
    ],
    proxies: { "/img/": "/base/public/img/" },

    preprocessors: {
      "test/**/*.spec.js?(x)": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "120" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Instrumenta solo el código de la app (no los tests) para medir cobertura.
                plugins: [
                  [
                    "istanbul",
                    {
                      include: ["src/**"],
                      exclude: ["test/**", "src/main.jsx"],
                    },
                  ],
                ],
              },
            },
          },
          // Los componentes no importan CSS, pero por si alguno lo hace no rompe la prueba.
          { test: /\.css$/, type: "asset/source" },
        ],
      },
      output: { path: path.resolve(__dirname, ".karma-build") },
    },

    reporters: ["spec", "coverage"],

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
      ],
    },

    browsers: ["ChromeHeadless"],
    customLaunchers: {
      // Para Linux/contenedores donde Chrome no puede usar sandbox.
      ChromeHeadlessCI: { base: "ChromeHeadless", flags: ["--no-sandbox"] },
    },

    singleRun: true,
  });
};
