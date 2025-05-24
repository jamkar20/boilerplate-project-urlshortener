require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = {};

const latest_id = 1;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.post("/api/shorturl", function (req, res) {
  const regex =
    /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
  if (!regex.test(req.body.original_url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  let short_url = latest_id;
  latest_id += 1;

  urls[short_url] = req.body.original_url;

  return res.json({
    original_url: req.body.original_url,
    short_url: short_url,
  });
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  let keys = Object.keys(urls);
  let found = keys.find((x) => x.toString() === req.params.shorturl);
  if (![null, undefined].includes(found)) {
    res.redirect(urls[found]);
    return;
  }
  res.status(400).json({ error: "No short URL found for the given input" });
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
