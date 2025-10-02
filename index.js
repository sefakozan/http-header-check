import axios from 'axios';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}
	next();
});

// Serve static files from docs directory
app.use(express.static(path.join(__dirname, 'docs')));

// API Routes

// Ana API endpoint
app.get('/api', (req, res) => {
	res.json({
		message: 'HTTP Header Check API is running!',
		endpoints: {
			'GET /api/hello': 'Hello message',
			'POST /api/check': 'Check HTTP headers of a URL',
			'GET /api/add': 'Add two numbers (query params: num1, num2)',
			'POST /api/multiply': 'Multiply two numbers (body: {num1, num2})',
			'GET /api/test': 'Test endpoint',
			'POST /api/reverse': 'String Reverse',
		},
		version: '1.0.0',
		timestamp: new Date().toISOString(),
	});
});

// Hello endpoint
app.get('/api/hello', (req, res) => {
	res.json({
		message: 'hello dizini',
		status: 'success',
		timestamp: new Date().toISOString(),
	});
});

// HTTP başlıklarını getiren route
app.post('/api/check', async (req, res) => {
	try {
		const { url } = req.body;

		if (!url) {
			return res.status(400).json({ error: 'URL is required' });
		}

		const response = await axios.get(url, {
			timeout: 10000, // 10 second timeout
			headers: {
				'User-Agent': 'HTTP-Header-Checker/1.0',
			},
		});

		res.json({ headers: response.headers });
	} catch (error) {
		console.error('Error:', error.message);
		res.status(400).json({
			error: error.code === 'ENOTFOUND' ? 'Domain not found' : 'Invalid URL or request failed',
		});
	}
});

// İki sayıyı toplayan GET endpoint'i
app.get('/api/add', (req, res) => {
	const { num1, num2 } = req.query;

	if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
		return res.status(400).json({
			error: 'Please provide two valid numbers as query parameters (num1 and num2)',
		});
	}

	const sum = Number(num1) + Number(num2);
	res.json({ result: sum });
});

// İki sayıyı çarpan POST endpoint'i
app.post('/api/multiply', (req, res) => {
	try {
		let { num1, num2 } = req.body;

		if (num1 === undefined || num2 === undefined) {
			return res.status(400).json({
				error: 'Please provide two valid numbers in the request body (num1 and num2)',
			});
		}

		num1 = String(num1).trim();
		num2 = String(num2).trim();

		if (isNaN(num1) || isNaN(num2) || num1 === '' || num2 === '') {
			return res.status(400).json({
				error: 'Please provide two valid numbers in the request body (num1 and num2)',
			});
		}

		const product = Number(num1) * Number(num2);
		res.json({ result: product });
	} catch (error) {
		res.status(400).json({ error: 'Invalid request body' });
	}
});

// Stringin tersini dönen POST endpoint'i
app.post('/api/reverse', (req, res) => {
	let reqObj = req.body; // reqObj Objectir
	let str = reqObj.str0;

	// string charArr çevrildi
	const charArrStr = str.split('');

	reverseString(charArrStr);

	// charArr stringe çevrildi
	str = charArrStr.join('');
	res.json({ result: str });

	function reverseString(cArr) {
		for (let i = 0; i < cArr.length / 2; i++) {
			let temp = cArr[i];
			cArr[i] = cArr[cArr.length - 1 - i];
			cArr[cArr.length - 1 - i] = temp;
		}
	}
});

// Stringin tersini dönen GET endpoint'i
app.get('/api/getreverse', function asd(request, response) {
	let reqObj = request.query; // reqObj Objectir
	let str = reqObj.str; // /getreverse?str=HelloWorld
	// string charArr çevrildi
	const charArrStr = str.split('');

	reverseString(charArrStr);

	// charArr stringe çevrildi
	str = charArrStr.join('');
	response.json({ result: str });

	function reverseString(cArr) {
		for (let i = 0; i < cArr.length / 2; i++) {
			let temp = cArr[i];
			cArr[i] = cArr[cArr.length - 1 - i];
			cArr[cArr.length - 1 - i] = temp;
		}
	}
});

// Test endpoint
app.get('/api/test', (req, res) => {
	res.json({
		status: 'success',
		message: 'API is working perfectly!',
		timestamp: new Date().toISOString(),
		method: req.method,
	});
});

app.post('/api/test', (req, res) => {
	res.json({
		status: 'success',
		message: 'POST request received successfully!',
		timestamp: new Date().toISOString(),
		method: req.method,
		body: req.body,
	});
});

// Serve the main HTML file for any non-API routes
// POST, Browserdan çağrılamaz. Get çağrılabilir ve get harici çağırımlar index.html yönlendirilir.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Export the Express app for Vercel
export default app;
