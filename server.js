const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MARKETAUX_KEY = process.env.MARKETAUX_KEY || "";

// Serve the frontend (index.html sits in the same root folder as this file)
app.use(express.static(__dirname));

// Secure proxy endpoint — the frontend calls this instead of Marketaux directly
app.get("/api/news", async (req, res) => {
  if (!MARKETAUX_KEY) {
    return res.status(500).json({ error: "MARKETAUX_KEY is not set on the server" });
  }

  try {
    const url = `https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=25&api_token=${MARKETAUX_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news from Marketaux" });
  }
});

app.listen(PORT, () => {
  console.log(`EcoWire server running on port ${PORT}`);
});
