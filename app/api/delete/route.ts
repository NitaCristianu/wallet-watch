// app/api/delete-actions/route.ts
import { writeClient } from "@/sanity/lib/writeclient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
            return NextResponse.json(
                { success: false, error: "Invalid or missing IDs" },
                { status: 400 },
            );
        }

        const deletions = await Promise.all(
            ids.map((id) =>
                writeClient
                    .delete(id)
                    .then(() => ({ id, success: true }))
                    .catch((error) => ({
                        id,
                        success: false,
                        error: error.message,
                    })),
            ),
        );

        return NextResponse.json({ success: true, results: deletions });
    } catch (err: unknown) {
        const error = err as Error;
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Something went wrong" },
            { status: 500 },
        );
    }
}
