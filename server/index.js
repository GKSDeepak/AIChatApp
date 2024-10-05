const express = require("express");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// const {upload} = require("./middleware/multer.middleware");

const  multer = require( 'multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')               //cb means call back
    },
    filename: function (req, file, cb) {
     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)

    }
  });
  
const upload = multer({ storage: storage })


// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  console.log("Full API response:", result);


  return response.text();
}


app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    
    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/try', (req, res) => {
  res.send('Hello, this is some text displayed on the screen!');
});

app.post('/upload', upload.single('file'),  (req, res) => {
  console.log(req.body)
  console.log(req.file)
})


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
