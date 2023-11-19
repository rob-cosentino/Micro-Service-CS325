import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { franc } from 'franc';

const app = express();
app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
    try {
        const { payload } = req.body;
        const lang = franc(payload);
        console.log("Detected language:", lang)

        // Checking if language is not english 
        if (lang !== 'eng' && lang !== 'und') {
            // Making post request to LibreTranslate API to translate
            const translateResponse = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                body: JSON.stringify({
                    q: payload,
                    source: lang,  // Detect language
                    target: 'en'   // Target language is english 
                }),
                header: { 'Content-Type': 'application/json' }
            });

            if (!translateResponse.ok) {
                throw new Error('There was an error with the translation API');
            }

            const translatedData = await translateResponse.json();
            console.log("Translated language:", lang)
            res.json({ translated: translatedData.translatedText });
        } else {
            // For text that is already english or undefined ('und')
            res.json({ translated: payload });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
// res.json({ translated: translatedText });

