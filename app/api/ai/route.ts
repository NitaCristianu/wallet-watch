import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { input, context } = await req.json();

        const completion = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: context },
                { role: "user", content: input },
            ],
        });

        const aiReply = completion.choices[0].message.content;
        return NextResponse.json({ success: true, reply: aiReply });
    } catch (err: unknown) {
        const error = err as Error;
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Something went wrong" },
            { status: 500 },
        );
    }
}
