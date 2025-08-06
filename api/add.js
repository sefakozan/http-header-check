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
    const { num1, num2 } = req.query;
    
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ 
        error: 'Please provide two valid numbers as query parameters (num1 and num2)' 
      });
    }
    
    const sum = Number(num1) + Number(num2);
    res.json({ result: sum });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
