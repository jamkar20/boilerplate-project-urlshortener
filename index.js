require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urls = {};

let latest_id = 1;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.post("/api/shorturl", function (req, res) {
  console.log(req.body);
  const regex =
    /^https?:\/\/(localhost|((www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,})|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?(\/[^\s]*)?$/;

  if (!regex.test(req.body.url)) {
    return res.json({ error: "invalid url" });
  }

  let short_url = latest_id.toString();
  latest_id += 1;

  urls[short_url] = req.body.url;

  return res.json({
    original_url: req.body.url,
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
