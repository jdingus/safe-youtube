const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { channelId, searchQuery, maxResults } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;

  console.log(`Requesting URL: ${url}`);
  console.log(`Channel ID: ${channelId}`);
  console.log(`Search Query: ${searchQuery}`);
  console.log(`Max Results: ${maxResults}`);
  console.log(`API Key: ${apiKey}`);

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
};
