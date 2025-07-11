import "dotenv/config";

export default {
  expo: {
    name: "zeno",
    slug: "zeno",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      merchantId: process.env.MERCHANT_ID,
      publicKey: process.env.PUBLIC_KEY,
      merchantDisplayName: process.env.MERCHANT_DISPLAY_NAME,
    },
    plugins: ["expo-font"],
  },
};
