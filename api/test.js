export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.json({ 
      status: 'success',
      message: 'API is working perfectly!',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  } else if (req.method === 'POST') {
    res.json({ 
      status: 'success',
      message: 'POST request received successfully!',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
