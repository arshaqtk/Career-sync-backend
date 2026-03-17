import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import UserModel from '../user/models/user.model';
import { JobModel } from '../jobs/models/job.model';
import { ENV } from '../../config/env';

// 1. Initialize Groq
const client = new Groq({ apiKey: ENV.GROQ_API_KEY || "" });

// 2. Define Types
type Tone = 'professional' | 'enthusiastic' | 'concise';

interface GenerateRequest {
  jobId: string;
  tone?: Tone;
}

export const generateCoverLetter = async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
  const { jobId, tone = 'professional' } = req.body;
console.log(req.auth?.id);
console.log(jobId);
console.log(tone);
  // --- 1. Validate input ---
  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  if (!req.auth?.id) {
    return res.status(400).json({ error: 'user id is required' });
  } 

  // --- 2. Fetch both documents in parallel ---   
const [candidate, job] = await Promise.all([
  UserModel.findById(req.auth.id).select("candidateData.resumeData"),

  JobModel.findById(jobId)
    .populate({
      path: "company",
      select: "name"
    })
    .select("title description skills experienceMin experienceMax salary field location remote jobType")
]);

  if (!candidate) { 
    return res.status(404).json({ error: 'Candidate profile not found' });
  }
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const resumeData = candidate.candidateData?.resumeData;

  if (!resumeData?.skills?.length) {
    return res.status(400).json({
      error: 'Please upload your resume before generating a cover letter'
    });
  }

  // --- 3. Set streaming headers BEFORE any write ---
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // --- 4. Build prompt ---
  const { fullName = 'Candidate', currentTitle = 'Professional', skills = [], experience = [] } = resumeData;
  const topSkills = skills.slice(0, 8).join(', ');
  const recentRole = experience[0]
    ? `${experience[0].title} at ${experience[0].company}`
    : 'a previous role';
  const jobDesc = (job as any).description?.slice(0, 800) ?? '';

  const toneGuide: Record<Tone, string> = {
    professional: 'formal, confident, results-focused',
    enthusiastic: 'energetic, passionate, startup-friendly',
    concise:      'brief, direct, bullet-point style'
  };

  const prompt = `
You are an expert career coach writing a cover letter for a job application.

IMPORTANT: Use only real names. Never include IDs, ObjectIds, or database references in the output.
CANDIDATE:
- Name: ${fullName}
- Current role: ${currentTitle}
- Key skills: ${topSkills}
- Most recent experience: ${recentRole}

JOB:
- Title: ${(job as any).title}
- Company: ${(job as any).company.name}
- Location: ${(job as any).company.location}
- Description: ${jobDesc}

TONE: ${toneGuide[tone]}
 
RULES:
- 3 paragraphs only — opening, body, closing
- Never start with "I am writing to apply for..."
- Never include MongoDB IDs, numbers, or database references anywhere
- Use the candidate's first name naturally (not full name repeatedly)
- Write in first person ("I", "my", "me") — NOT third person
- Mention 2–3 specific skills from the candidate that match the job
- End with a clear call to action
- Output plain text only, no markdown, no subject line
- Sound human and natural, not robotic or overly formal 
  `.trim();

  // --- 5. Stream from Groq ---
  try {
    const stream = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach. Output plain text only, no markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,       // slight creativity for cover letters
      max_tokens: 1024,
      stream: true,           // ✅ enable streaming
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) {
        fullContent += text;
        res.write(text);      // stream each chunk to client
      }
    }

    // --- 6. Save to MongoDB after stream completes ---
    await UserModel.findByIdAndUpdate(
      (req as any).auth.id,
      {
        $push: {
          'candidateData.coverLetters': {
            jobId,
            content: fullContent,
            tone,
            createdAt: new Date()
          }
        }
      }
    );

    res.end();

  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Generation failed', detail: err.message });
    } else {
      res.write('\n\n[Error: generation failed. Please try again.]');
      res.end();
    }
  }
};


export const getCoverLetterHistory = async (req: Request, res: Response) => {
  const candidate = await UserModel.findById((req as any).user.id)
    .populate('candidateData.coverLetters.jobId', 'title company');

  if (!candidate) return res.status(404).json({ error: 'Not found' });

  res.json({ coverLetters: candidate.candidateData?.coverLetters });
};