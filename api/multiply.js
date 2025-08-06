export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    let { num1, num2 } = req.body;
    
    if (!num1 || !num2) {
      return res.status(400).json({ 
        error: 'Please provide two valid numbers in the request body (num1 and num2)' 
      });
    }
    
    num1 = String(num1).trim();
    num2 = String(num2).trim();
    
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ 
        error: 'Please provide two valid numbers in the request body (num1 and num2)' 
      });
    }
    
    const product = Number(num1) * Number(num2);
    res.json({ result: product });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
