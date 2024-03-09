import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;
        console.log('Received prompt:', prompt);

        // Call the Gemini API and get the formatted output
        const formattedOutput = await callGeminiAPI(prompt);

        // Send the formatted output to the client
        res.status(200).json(formattedOutput);
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function callGeminiAPI(prompt) {
    try {
        console.log('Prompt:', prompt);

        // Get the Gemini AI model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content using the model and provided prompt
        const result = await model.generateContent(`extract the questions and options from this response "${prompt}" and return a json which is in the format like this "[{"text" : "extracted question", "options" : [extracted options]}]"`);
        
        // Extract the response text
        const response = await result.response;
        const text = response.text();
        
        console.log('Generative AI Output:', text);

        return JSON.parse(text); // Return the parsed output
    } catch (error) {
        console.error('Generative AI Error:', error);
        throw error; // Propagate the error
    }
}
