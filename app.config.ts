import 'dotenv/config';

const IS_DEV =
  process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'Scope Dev' : 'Scope',
    slug: 'Scope',
    version: '1.0.4',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'Scope',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/2fb3b0c8-e8a1-443b-b4da-7748ebcf38ac"
    },
    runtimeVersion: "1.0.4",
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1E1E1E',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? 'com.kuarulabs.scope.dev' : 'com.kuarulabs.scope',
      googleServicesFile: './google-services.json',
    },
    android: {
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: 'pan',
      googleServicesFile: IS_DEV ? './google-services-dev.json' : './google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#1E1E1E',
      },
      versionCode: 9,
      package: IS_DEV ? 'com.kuarulabs.scope.dev' : 'com.kuarulabs.scope',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
        },
      ],
      [
        'react-native-fbsdk-next',
        {
          appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
          clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
          displayName: 'Scope',
          scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID}`,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission:
            'This identifier will be used to deliver personalized ads to you.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: '2fb3b0c8-e8a1-443b-b4da-7748ebcf38ac',
      },
    },
  },
};
