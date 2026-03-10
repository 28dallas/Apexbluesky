import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import toolsData from '@/data/tools.json';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Build a concise knowledge base from tools.json
    const toolsInfo = Object.values(toolsData).map(tool => ({
        name: (tool as any).title,
        category: (tool as any).category,
        description: (tool as any).description,
        affiliate: (tool as any).affiliate?.name
    }));

    const systemPrompt = `
    You are "ApexAI", the official assistant for ApexBlueSky Tools (apexblueskytools.online).
    Your goal is to help users navigate the website and find the right tools for their tasks.
    
    WEBSITE CONTEXT:
    - Founder: Nathan Krop, a Software Engineer from Kenya.
    - Tech Stack: Next.js, TypeScript, Tailwind CSS (Vanilla CSS modules used for components).
    - Privacy: Most tools run locally in the browser (client-side).
    
    AVAILABLE TOOLS:
    ${JSON.stringify(toolsInfo, null, 2)}
    
    GUIDELINES:
    1. Be professional, helpful, and friendly.
    2. If a user asks for a tool we have, direct them to it.
    3. If they need advanced features, recommend our affiliate partners (Adobe for PDF, Canva for Design, Grammarly for Writing, Hostinger for Web, Wise for Finance).
    4. Keep answers concise.
    5. Always mention that our tools are "Privacy First" and process data locally where applicable.
  `;

    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
