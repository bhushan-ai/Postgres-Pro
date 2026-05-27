import "dotenv/config";
import app from "./server";

const PORT = process.env.PORT || 4000;

export default {
  port: PORT,
  fetch: app.fetch,
};
