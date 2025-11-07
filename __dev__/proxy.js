import express from "express";
import fetch from "node-fetch";

import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/api/stream", async (req, res) => {
  const prompt = req.query.prompt;
  const response = await fetch(
    `https://vera-assignment-api.vercel.app/api/stream?prompt=${encodeURIComponent(
      prompt
    )}`
  );
  res.setHeader("Content-Type", "text/event-stream");
  response.body.pipe(res);
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));
