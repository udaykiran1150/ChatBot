

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Directly place your API key here
const apiKey = "AIzaSyBPyKT5XYe5vlBFmayjOKzn6prSVc0hAdo";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
      generationConfig,
      history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  // console.log(result.response.text());
  const response=result.response
  return  response.text(); 
}

export default run;
