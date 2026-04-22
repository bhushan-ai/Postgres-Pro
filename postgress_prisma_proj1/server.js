import express from "express";
import "dotenv/config";
const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Server is running fine!!");
});

app.listen(prompt, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
