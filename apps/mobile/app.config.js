import "dotenv/config";

export default {
  expo: {
    name: "zeno",
    slug: "zeno",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
