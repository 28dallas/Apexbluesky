import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.length < 5) {
            return NextResponse.json({ error: 'Text too short to check.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert English grammar proofreader. 
Analyze the following text for spelling, punctuation, and grammatical errors.

Original Text:
"${text}"

Instructions:
1. First, provide the corrected version of the text. Prefix it exactly with "Corrected Text:\n".
2. Second, provide a brief bulleted list explaining what errors were found and fixed. Prefix this exactly with "\nChanges Made:\n".
3. If there are absolutely no errors, just return: "No grammar issues found! Your text looks great."
Do not include any other conversational filler.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text().trim();

        return NextResponse.json({ text: feedback });
    } catch (error: any) {
        console.error('Gemini API Error (Grammar Checker):', error);
        return NextResponse.json({ error: 'Failed to check grammar' }, { status: 500 });
    }
}
