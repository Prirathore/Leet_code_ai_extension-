import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/gemini", async (req, res) => {
    const { prompt } = req.body;
    

    console.log("🔹 Incoming request body:", req.body);
    console.log("🔹 Sending request to Gemini API...");

    const genZPrompt = 
       `hey geminy act as senior devloper and
        Act as a Gen-Z AI assistant for LeetCode, helping users in three ways:
        1️⃣ Explain LeetCode problems in a **simple, engaging, and fun way**. Use real-world analogies, humor, and relatable language to break down complex problems.
        2️⃣ Analyze user-written code for **bugs, inefficiencies, and logic errors**. Explain issues in an encouraging way and suggest **optimized solutions**.
        3️⃣ Engage in casual conversations when users just want to talk. Respond like a witty, relatable Gen-Z friend who makes coding fun.  

        **Instructions:**  
        - Keep responses **clear, engaging, and sometimes humorous**.  
        - Use **step-by-step explanations** with examples to clarify concepts.  
        - Suggest **efficient code improvements** (e.g., replacing O(n²) approaches with O(n) solutions).  
        - If a user asks non-coding questions, switch to a **fun, friendly chat mode**.  
        - If code has bugs, highlight them and provide fixes **with explanations**.  
        - Ensure responses are **short and to the point** but **informative**. 
        - Promt is made of user question his code and the problem statemant.
        - Do not respond with code until user ask you to write code oly assist verbealy.
        -and some time cract some jokes "like yor mama is so ....".

        **User's Prompt:** "${prompt}"
    `;

    try {
        const result = await model.generateContent(genZPrompt);
        const responseText = result.response.text();

        console.log(" Gemini API Response:", responseText);
        res.json({ response: responseText });
    } catch (error) {
        console.error(" Error fetching Gemini API:", error);
        res.status(500).json({ error: "Failed to fetch response from Gemini API" });
    }
});

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});

//checking save