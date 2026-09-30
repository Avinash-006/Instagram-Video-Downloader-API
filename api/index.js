const express = require("express");

// Explicit imports ensure Vercel includes these transitive runtime dependencies
// used by the SnapSave downloader.
require("axios");
require("cheerio");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Instagram Video Downloader API",
    status: "ok",
    endpoint: "/igdl?url=<instagram-url>"
  });
});

app.get("/igdl", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL parameter is missing" });
    }

    const snapsave = require("../snapsave-downloader/src/index");
    const downloadedURL = await snapsave(url);

    return res.status(200).json({ url: downloadedURL });
  } catch (err) {
    console.error("Downloader error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "Unknown error"
    });
  }
});

module.exports = app;
