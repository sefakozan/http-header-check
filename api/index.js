export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.json({ 
      message: 'HTTP Header Check API is running!',
      endpoints: {
        'GET /api/hello': 'Hello message',
        'POST /api/check': 'Check HTTP headers of a URL',
        'GET /api/add': 'Add two numbers (query params: num1, num2)',
        'POST /api/multiply': 'Multiply two numbers (body: {num1, num2})'
      },
      version: '1.0.0'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
