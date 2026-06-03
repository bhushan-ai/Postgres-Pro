import "dotenv/config";
import app from "./server";
import { createServer } from "node:http";
import { initSocket } from "./socket/socket";
import { serve } from "@hono/node-server";

const PORT: number = parseInt(process.env.PORT || "4000", 10);

const server = createServer(async (req, res) => {
  const response = await app.fetch(req as any);

  res.writeHead(response.status, Object.fromEntries(response.headers));

  const body = await response.text();
  res.end(body);
});

initSocket(server);

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server running on http://localhost:${PORT}`);
