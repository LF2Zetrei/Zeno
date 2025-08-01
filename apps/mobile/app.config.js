import "dotenv/config";

export default {
  expo: {
    name: "zeno",
    slug: "zeno",
    version: "1.0.0",
    owner: "lf2zetrei",
    updates: {
      url: "https://u.expo.dev/2222c62e-e1b4-4d34-921f-4a6e4659ef80"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    android: {
      package: "com.lf2zetrei.zeno"
    },
    ios: {
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },

    extra: {
      apiUrl: process.env.API_URL,
      merchantId: process.env.MERCHANT_ID,
      publicKey: process.env.PUBLIC_KEY,
      merchantDisplayName: process.env.MERCHANT_DISPLAY_NAME,
      eas: {
        projectId: "2222c62e-e1b4-4d34-921f-4a6e4659ef80"
      }
    },
    plugins: ["expo-font"],
  },
};
