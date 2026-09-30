const express = require("express");

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

    // Load the downloader lazily so the health/root route can still boot
    // even if the third-party scraper has a runtime compatibility issue.
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
