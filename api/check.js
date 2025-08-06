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
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'HTTP-Header-Checker/1.0'
        }
      });
      
      res.json({ headers: response.headers });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ 
        error: error.code === 'ENOTFOUND' ? 'Domain not found' : 'Invalid URL or request failed' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
