import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import toolsData from '@/data/tools.json';
import type { ToolCatalog } from '@/types/tools';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        console.log('--- Chat API Request Start ---');
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        console.log('API Key present:', !!apiKey);

        if (!apiKey) {
            console.error('CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY is missing');
            return new Response(JSON.stringify({
                error: 'Configuration Error',
                details: 'Missing Google AI API Key'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const googleProvider = createGoogleGenerativeAI({
            apiKey: apiKey,
        });

        // Build a concise knowledge base from tools.json
        const toolsInfo = Object.values(toolsData as ToolCatalog).map(tool => ({
            name: tool.title,
            category: tool.category,
            description: tool.description,
            affiliate: tool.affiliate?.name
        }));

        const systemPrompt = `
    You are "Blue", the official assistant for ApexBlueSky Tools (apexblueskytools.online).
    Your goal is to help users navigate the website and find the right tools for their tasks.
    
    WEBSITE CONTEXT:
    - Support: Contact users through the website contact page or support@apexblueskytools.online.
    - Tech Stack: Next.js, TypeScript.
    - Privacy: Most tools run locally in the browser (client-side).
    
    ENGAGEMENT GUIDELINES:
    - TikTok & App: Only mention our TikTok tutorials or mobile app if the user specifically asks how to learn more, where to find tutorials, or how to use the tools on mobile. DO NOT mention them in every response. The user has already seen the welcome message.
    
    AVAILABLE TOOLS:
    ${JSON.stringify(toolsInfo, null, 2)}
    
    GUIDELINES:
    1. Be professional, helpful, and friendly.
    2. If a user asks for a tool we have, direct them to it.
    3. If they need advanced features, recommend our affiliate partners (Adobe for PDF, Canva for Design, Grammarly for Writing, Hostinger for Web, Wise for Finance).
    4. Provide clear guidance on how to use the 53+ tools available on our site.
    5. Always mention that our tools are "Privacy First" and process data locally where applicable.
  `;

        const result = streamText({
            model: googleProvider('gemini-flash-latest'),
            system: systemPrompt,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Chat API Error:', message);
        return new Response(JSON.stringify({
            error: 'Blue is currently busy. Please try again in a moment.',
            details: message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
