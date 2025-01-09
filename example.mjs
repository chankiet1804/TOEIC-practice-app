import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Lấy từ file .env
  });

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Check this sentence for me: 'I am the best in a classes.'",
        },
    ],
});

console.log(completion.choices[0].message);