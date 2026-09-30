const express = require("express");
const app = express();
const snapsave = require("../snapsave-downloader/src/index");

app.get("/", (req, res) => {
  res.json({ message: "Instagram Video Downloader API" });
});

app.get("/igdl", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is missing" });
    }

    const downloadedURL = await snapsave(url);
    return res.json({ url: downloadedURL });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
