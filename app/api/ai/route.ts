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
    } catch (err: any) {
        console.error("OpenAI Error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Something went wrong" },
            { status: 500 },
        );
    }
}
