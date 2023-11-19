const express = require('express')
const axios = require('axios')

const app = express();
app.use(express.json());

app.post('/translate', async (req, res) => {
    try {
        const { payload } = req.body;
        console.log('Received payload:', payload)

        if (payload) {
            const deepLApiKey = '3b8b578b-5d63-fce5-6bb6-05e74c28a4fc:fx'
            const deepLUrl = `https://api-free.deepl.com/v2/translate`
    
            const response = await axios.post(deepLUrl, {
                text: [payload],
                target_lang: 'EN'
            }, {
                headers: {
                    'Authorization': `DeepL-Auth-Key ${deepLApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('DeepL API response:', response.data)

            const detectedLanguage = response.data.translations[0].detected_source_language;
            const translatedText = response.data.translations[0].text;

            // checking if input lang is english or translation is the same as input
            if (detectedLanguage !== 'EN' && translatedText !== payload) {
                res.json({ translated: translatedText })
            } else {
                // For text that is already english or undefined ('und')
                res.json({ translated: payload, note: 'Text already in English or translation not supported' });
            }
        } else {
            res.status(400).json({ error: 'No payload provided' })
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
