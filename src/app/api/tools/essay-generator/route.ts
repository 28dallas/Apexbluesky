import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { topic, options } = await req.json();

        if (!topic || topic.length < 3) {
            return NextResponse.json({ error: 'Topic too short' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Write a professional, well-structured essay on the topic: "${topic}".
Academic Level: ${options?.level || 'University'}
Tone/Style: ${options?.tone || 'Analytical'}
Include Academic Citations: ${options?.includeCitations ? 'Yes (APA/MLA)' : 'No'}

Please ensure the essay has a clear introduction, body paragraphs, and a conclusion. 
If citations are requested, please include a References section at the end.
Format the output clearly with headings if appropriate.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Failed to generate essay' }, { status: 500 });
    }
}
