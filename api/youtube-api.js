const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { channelId, searchQuery, maxResults } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 403) {
      throw new Error("API key quota exceeded or invalid. Please check your YouTube API key.");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
