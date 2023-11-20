# Translation Microservice

This microservice will translate text from most detectable languages into English via use of the DeepL translation API. 

# Requesting/Receiving Data

(POST) https://deepl-translator-jwmr.onrender.com/translate

To request a translation, utilize the URL above in an HTTP POST request containing the payload (the text to be translated)

Here is an example call in JSON format:
```json
{
    "payload": "Non-English text goes here"
}
```
The API/microservice will respond with a JSON object containing the translated text in the following format:
```json
{
    "translated": "Translated (to English) text here" 
}
```

# Error Handling

In a case in which the microservice receives an invalid or empty payload, error messages will be displayed. For example:
```javascript
{
    "translated": "The original text",
    "note": "Text already in English or translation not supported"
}
```

# Rate Limit

The rate limit is currently set to 100 translation requests per 15 minutes

# UML Sequence Diagram
```markdown
![UML-sequence](https://github.com/rob-cosentino/translation-microservice/assets/112352526/e490eec8-3c6f-439d-ab41-57e947010eb4)