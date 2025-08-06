import axios from 'axios';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const response = await axios.get(url);
      res.json({ headers: response.headers });
    } catch (error) {
      res.status(400).json({ error: 'Invalid URL or request failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
