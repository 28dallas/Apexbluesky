import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { consumeCredits } from '@/lib/server/billing';

const prompts = {
  regex: (input: string) => `Generate a JavaScript regular expression for this requirement: ${input}\n\nReturn exactly these sections: Regex, Explanation, Examples. State flags and limitations. Do not claim the pattern validates things it cannot.`,
  sql: (input: string) => `Generate a safe SQL query from this request: ${input}\n\nIf table names, columns, SQL dialect, or assumptions are missing, use clearly named placeholders and list the assumptions. Prefer SELECT queries. Never generate destructive statements unless the user explicitly asks. Return sections: SQL, Assumptions, Explanation.`,
  flashcards: (input: string) => `Create 5 to 10 accurate study flashcards from these notes. Use only information in the notes; do not invent facts. Format each as:\nQ: ...\nA: ...\n\nNotes:\n${input}`,
  blogPost: (input: string) => `Write a useful, original blog post from this topic or outline: ${input}\n\nUse a clear title, short introduction, descriptive headings, practical detail, and a concise conclusion. Do not invent sources, statistics, or citations.`,
  productDescription: (input: string) => `Write a concise, accurate product description from these product details: ${input}\n\nLead with the customer benefit, use readable paragraphs and bullet points where helpful, and do not invent specifications, guarantees, or reviews.`,
  email: (input: string) => `Draft a professional email based on this request: ${input}\n\nInclude a useful subject line, appropriate greeting, concise body, and closing. Do not invent names, dates, or commitments.`,
  blogTitles: (input: string) => `Generate 8 specific, non-clickbait blog title options for this topic: ${input}\n\nVary the angle and keep each title under 70 characters where possible.`,
} as const;

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const tool = body?.tool as keyof typeof prompts;
    const input = typeof body?.input === 'string' ? body.input.trim() : '';
    if (!tool || !(tool in prompts) || input.length < 5 || input.length > 12000) {
      return NextResponse.json({ error: 'Provide a supported request between 5 and 12,000 characters.' }, { status: 400 });
    }
    await consumeCredits(request, 2);

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompts[tool](input));
    const text = result.response.text().trim();
    if (!text) throw new Error('Empty response from AI provider.');
    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI assistant tool error:', error);
    return NextResponse.json({ error: 'Failed to generate a result. Please try again.' }, { status: 500 });
  }
}
