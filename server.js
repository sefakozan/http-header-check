import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors()); // CORS'u etkinleştir
app.use(express.urlencoded({ extended: true }));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.send('Merhaba, bu bir metin yanıtıdır!');
});


app.get('/hello', (req, res) => {
    res.send('hello dizini');
});

// get: /topla, iki sayı al topla dön
// post: /carp, iki sayı al çarp dön

// HTTP başlıklarını getiren route
app.post('/check', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url);
        res.json({ headers: response.headers });
    } catch (error) {
        res.status(400).json({ error: 'Invalid URL or request failed' });
    }
});

// İki sayıyı toplayan GET endpoint'i
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query; // Query parametrelerinden sayıları al
    // Parametrelerin sayı olup olmadığını kontrol et
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Please provide two valid numbers as query parameters (num1 and num2)' });
    }
    const sum = Number(num1) + Number(num2); // Sayıları topla
    res.json({ result: sum }); // JSON olarak sonucu döndür
});

// İki sayıyı çarpan POST endpoint'i
app.post('/multiply', (req, res) => {
    let { num1, num2 } = req.body;
    num1 = num1.trim();
    num2 = num2.trim();
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Please provide two valid numbers in the request body (num1 and num2)' });
    }
    const product = Number(num1) * Number(num2);
    res.json({ result: product });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));