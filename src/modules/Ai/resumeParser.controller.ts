// routes/resume.ts
import { Router  } from 'express';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from "openai";

const router = Router();




// --- Extract raw text from PDF or DOCX buffer ---
export const extractText = async function (buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data.text;
    } finally {
      await parser.destroy();
    }
  }
  const result = await mammoth.extractRawText({ buffer });
  return result.value; 
}

// --- Send raw text to Gemini, get structured JSON back ---

import Groq from "groq-sdk";

import { ParsedResume } from "../candidate/types/resume.types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parseResumeWithAI = async function (rawText: string): Promise<ParsedResume> { 
  const prompt = `
Extract information from this resume and return ONLY a valid JSON object.
No markdown, no explanation, no code fences — raw JSON only.

Schema:
{ 
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "currentTitle": string,
  "totalYearsExp": number,
  "summary": string,
  "skills": string[],
  "languages": string[],
  "education": [
    { "school": string, "degree": string, "startDate": string | null, "endDate": string | null, "year": number | null }
  ],
  "experience": [
    { "role": string, "company": string, "startDate": string (ISO 8601 or YYYY-MM), "endDate": string (ISO 8601 or YYYY-MM or "Present"), "description": string }
  ]
}

Rules:
- skills must be an array of individual skill strings (e.g. ["React", "Node.js"])
- totalYearsExp should be a number estimate based on work history
- description for experience should be a concise summary of highlights
- use "role" instead of "title" for work experience
- If a field is missing from the resume, use null for strings and [] for arrays
- Do NOT include any text before or after the JSON

Resume:
${rawText}
  `.trim();

  try {
    const result = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a resume parser. Always respond with raw valid JSON only. No markdown, no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,           // deterministic output for consistent JSON
      max_tokens: 2048,
    });

    const text = result.choices[0].message.content ?? "";

    // Strip any accidental markdown fences just in case
    const clean = text.replace(/```json|```/gi, "").trim();

    return JSON.parse(clean);
  } catch (error: any) {
    console.error("🔥 Resume parsing error:", error.message);
    throw new Error("Failed to parse resume with AI");
  }
};


export default router;