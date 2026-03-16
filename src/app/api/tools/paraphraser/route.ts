import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text, options } = await req.json();

        if (!text || text.length < 10) {
            return NextResponse.json({ error: 'Text too short. Please provide at least a sentence.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const tone = options?.tone || 'Standard';

        const prompt = `You are an expert copywriter and editor. Please paraphrase and rewrite the following text.
Tone/Style Requirement: ${tone}

Original Text:
"${text}"

Instructions:
1. Provide a single, beautifully rewritten version of the text that maintains the original meaning.
2. Improve the flow, vocabulary, and clarity.
3. If the Tone is "Professional", make it sound formal and business-appropriate.
4. If the Tone is "Casual", make it sound friendly and conversational.
5. Do NOT include any intro dialogue like "Here is the rewritten text:". Just return the text itself.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rewrittenText = response.text().trim();

        return NextResponse.json({ text: rewrittenText });
    } catch (error: any) {
        console.error('Gemini API Error (Paraphraser):', error);
        return NextResponse.json({ error: 'Failed to paraphrase text' }, { status: 500 });
    }
}
