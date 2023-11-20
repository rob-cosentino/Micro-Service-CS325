// Loading environment variables (.env)
require('dotenv').config()

// Node Modules
const express = require('express')
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const app = express();

// Utilizing express.json for JSON request parsing
app.use(express.json());

// Rate limit for the API (abuse prevention - 100 calls per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,      
    max: 100
});
app.use(limiter)



// Defining post endpoint
app.post('/translate', async (req, res) => {
    try {
        const { payload } = req.body;
        console.log('Received payload:', payload)

        if (payload) {
            const deepLApiKey = process.env.DEEPL_API_KEY
            const deepLUrl = `https://api-free.deepl.com/v2/translate`
    
            // POST request to DeepL 
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

            // Extract detected language and translated text 
            const detectedLanguage = response.data.translations[0].detected_source_language;
            const translatedText = response.data.translations[0].text;

            // Translation conditions 
            if (detectedLanguage !== 'EN' && translatedText !== payload) {
                res.json({ translated: translatedText })
            } else {
                // For text that is already english or undefined ('und')
                res.json({ translated: payload, note: 'Text already in English or translation not supported' });
            }
        } else {
            // For empty inputs
            res.status(400).json({ error: 'No payload provided' })
        }    
    } catch (error) {
        // For errors regarding the API 
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
