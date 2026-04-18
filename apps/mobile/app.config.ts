// Expo app config.
//
// NOTE — when the real Cisco Spaces Wayfinding native SDK is added, this file
// is where the config plugin will be declared. Example (placeholder, not a
// real plugin):
//
//   plugins: ['./plugins/with-cisco-wayfinding'],
//
// That plugin will wire the SDK into iOS/Android native projects during
// `expo prebuild`. Keep this comment so reviewers know where to look.
export default {
  expo: {
    name: 'Javits Wayfinder',
    slug: 'javits-wayfinder',
    version: '0.1.0',
    orientation: 'portrait',
    scheme: 'wayfinder',
    userInterfaceStyle: 'automatic',
    splash: {
      backgroundColor: '#FFFFFF',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.javits.wayfinder',
    },
    android: {
      package: 'com.javits.wayfinder',
    },
    plugins: [],
    experiments: {
      typedRoutes: true,
    },
  },
};
