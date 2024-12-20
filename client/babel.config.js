module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Keep the Expo preset
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // Alias for importing environment variables
          path: ".env", // Path to your .env file
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
