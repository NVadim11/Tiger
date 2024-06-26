const webpack = require("webpack");

module.exports = function override(config) {
  // Игнорировать определённые предупреждения, если необходимо
  config.ignoreWarnings = [/Failed to parse source map/];

  // Убедиться, что объект fallback существует в конфигурации resolve
  const fallback = config.resolve.fallback || {};

  // Добавить полифиллы для необходимых модулей
  Object.assign(fallback, {
    zlib: require.resolve("browserify-zlib"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    "process/browser": require.resolve("process/browser"),
    path: require.resolve("path-browserify"),
  });

  // Обновить fallback в конфигурации resolve webpack
  config.resolve.fallback = fallback;

  // Убедиться, что массив plugins существует в конфигурации
  config.plugins = config.plugins || [];

  // Предоставить необходимые глобальные переменные
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
