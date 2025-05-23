"use client";

import AIBackground from "@/app/backgrounds/ai-background";
import { MaterialSymbolsAccountCircle } from "@/constants/Icons";
import { actionType, messageType, projectType } from "@/constants/types";
import {
    AnimatePresence,
    delay,
    easeInOut,
    easeOut,
    motion,
    useScroll,
    useTransform,
} from "framer-motion";
import { Send, SendHorizontal, SendIcon } from "lucide-react";
import { useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

function prune<T extends Record<string, any>>(value: T): Partial<T> {
    const forbidden = new Set([
        "_type",
        "_weak",
        "internalGroqTypeReferenceTo",
    ]);
    const allowUnderscore = new Set(["_id", "_key"]);

    if (Array.isArray(value)) {
        return value.map(prune) as unknown as Partial<T>;
    }

    if (value !== null && typeof value === "object") {
        return Object.entries(value).reduce((acc, [k, v]) => {
            if (
                // Drop disallowed meta keys
                (k.startsWith("_") && !allowUnderscore.has(k)) ||
                forbidden.has(k)
            ) {
                return acc;
            }
            // Recurse into nested objects / arrays
            acc[k as keyof T] =
                typeof v === "object" && v !== null ? (prune(v) as any) : v;
            return acc;
        }, {} as Partial<T>);
    }
    return value;
}

/**
 * Builds the full system/context prompt for the OpenAI call.
 *
 * - `project`   : the user’s active WalletWatch project
 * - `actions`   : all actions linked to that project (goals, transfers, commits)
 * - `preferredCurrency` : ISO-4217 currency code the assistant must default to
 * - `prevConversation`  : prior chat turns for extra short-term memory
 */
export function getContext(
    project: projectType,
    actions: actionType[],
    preferredCurrency: string,
    prevConversation: messageType[],
): string {
    const cleanedProject = prune(project);
    const cleanedActions = actions.map(prune);

    const conversationBlock = prevConversation
        .map(({ author, content }) => `${author.toUpperCase()}: ${content}`)
        .join("\n");

    return [
        "You are WalletWatch, an AI financial-planning assistant.",
        "Your job: give concise, actionable guidance that reduces the user's stress and uncertainty.",
        `Always speak in the user's preferred currency (${preferredCurrency}).`,
        "",
        "=== USER PROJECT ===",
        JSON.stringify(cleanedProject, null, 2),
        "",
        "=== USER ACTIONS ===",
        JSON.stringify(cleanedActions, null, 2),
        "",
        "=== CONVERSATION SO FAR ===",
        conversationBlock,
        "",
        "When you answer:",
        "- Prioritise clarity over jargon.",
        "- Provide precise numeric examples when helpful.",
        "- Suggest next steps the user can take inside WalletWatch.",
    ].join("\n");
}

export function FormatMessageContent({ content }: { content: string }) {
    const lines = content.split("\n");

    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Handle numbered step headings like "1. **Set a goal**"
        const numberedStepMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*/);
        if (numberedStepMatch) {
            elements.push(
                <h3 key={i} className="font-semibold mt-4 text-white">
                    {numberedStepMatch[1]}. {numberedStepMatch[2]}
                </h3>,
            );
            continue;
        }

        // Handle generic bold headings like "**Plan Savings**"
        const boldHeadingMatch = line.match(/^\*\*(.+?)\*\*$/);
        if (boldHeadingMatch) {
            elements.push(
                <h4 key={i} className="font-semibold mt-3 text-white">
                    {boldHeadingMatch[1]}
                </h4>,
            );
            continue;
        }

        // Handle bullet points (hyphen or dot)
        if (line.startsWith("- ") || line.startsWith("•")) {
            elements.push(
                <li key={i} className="ml-4 list-disc text-gray-100">
                    {line.replace(/^[-•]\s*/, "")}
                </li>,
            );
            continue;
        }

        // Handle "Next Steps:"
        if (/^next steps:?/i.test(line)) {
            elements.push(
                <h4 key={i} className="mt-4 font-bold text-accent-400">
                    Next Steps:
                </h4>,
            );
            continue;
        }

        // Default paragraph, bold inline if necessary
        const parts = line.split(/\*\*(.+?)\*\*/g); // Inline bold
        elements.push(
            <p key={i} className="text-gray-100">
                {parts.map((part, idx) =>
                    idx % 2 === 1 ? (
                        <strong key={idx} className="font-semibold text-white">
                            {part}
                        </strong>
                    ) : (
                        <span key={idx}>{part}</span>
                    ),
                )}
            </p>,
        );
    }

    return <div className="flex flex-col gap-2">{elements}</div>;
}

function AIClient({
    project,
    actions,
    currency,
    initmessages,
    servercallback,
}: {
    project: projectType;
    actions: actionType[];
    initmessages: messageType[];
    currency: string;
    servercallback: (input: string, context: string) => void;
}) {
    const [messages, setMessages] = useState(initmessages);
    const { scrollYProgress } = useScroll();
    const size = useTransform(scrollYProgress, [0.2, 0.8], ["60%", "100%"]);
    const radius = useTransform(scrollYProgress, [0.2, 0.8], [64, 0]);
    const [loading, setLoading] = useState(false);

    const context = getContext(project, actions, currency, initmessages);
    const [input, setInput] = useState("");

    async function send(overrideinput = input) {
        if (loading || overrideinput.trim().length === 0) return;

        setLoading(true);
        setMessages((prev) => [
            ...prev,
            { author: "user", content: overrideinput },
        ]);

        setInput(""); // Clear input

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: overrideinput, context }),
            });

            const data = await res.json();

            if (data.success && data.reply) {
                setMessages((prev) => [
                    ...prev,
                    { author: "ai", content: data.reply },
                ]);
                setLoading(false);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        author: "ai",
                        content: "Sorry, something went wrong with the AI.",
                    },
                ]);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    author: "ai",
                    content: "Server error. Try again later.",
                },
            ]);
            setLoading(false);
        }
    }

    return (
        <>
            <motion.div
                style={{ width: size, height: size, borderRadius: radius }}
                className="bg-black-900 absolute left-1/2 -translate-x-1/2 overflow-hidden from-accent-700/10 bg-radial "
            >
                {/* 
                <motion.div
                    className="fixed h-[120vh]"
                    style={{ opacity: 0 }}
                    whileInView={{
                        opacity: 0.1,
                        transition: { delay: 1, duration: 0.5 },
                    }}
                >
                   
                </motion.div> */}
                <motion.div
                    className="absolute left-1/2 top-1/4 -translate-1/2 h-full flex flex-col justify-center text-gray-100 items-center "
                >
                    <MaterialSymbolsAccountCircle className="fill-current w-20 h-20 md:w-50 md:h-50 mb-3" />
                    <h1 className="text-lg font-light">
                        Great to see you, {project.user?.name}.
                    </h1>
                    {/* red square now pushes everything below it */}
                </motion.div>
                <div
                    className="w-5/6 md:4/6 lg:w-3/6 left-1/2 -translate-x-1/2 absolute top-1/4 min-h-[35vh] rounded-lg translate-y-50 overflow-y-auto"
                    id="converstation-div"
                >
                    <div className="relative w-full h-[35vh] flex flex-col overflow-y-auto px-5 scrollbar-min gap-5">
                        {messages.map((message, i) => {
                            const isUser = message.author === "user";
                            return (
                                <div
                                    key={i}
                                    style={{
                                        alignSelf: isUser
                                            ? "flex-end"
                                            : "flex-start",
                                        background: isUser ? "#222" : "#282",
                                    }}
                                    className="flex flex-col w-fit p-2 rounded-xl max-w-[25vw] shadow-2xl"
                                >
                                    {/* {message.content.split("\n").map((line, index) => (
                            <p key={index} className="text-gray-100 text-wrap">
                                {line}
                            </p>
                        ))} */}
                                    <FormatMessageContent
                                        content={message.content}
                                    />
                                </div>
                            );
                        })}
                        <AnimatePresence>
                            {loading ?? (
                                <motion.h1 className="text-gray-100">
                                    AI is writing...
                                </motion.h1>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="absolute w-full max-sm:px-10 md:w-3/5 lg:3/5 bottom-10 backdrop-blur-2xl left-1/2 -translate-x-1/2 ">
                    <div className=" -top-4 -translate-y-full text-text-primary  flex gap-4 left-4 w-full pr-20 max-md:text-xs relative max-sm:hidden">
                        {...[
                            "Make a plan",
                            "What if I save more aggresevely",
                            "Can I afford a new house in next 10 years?",
                            "Advice",
                        ].map((suggestion, i) => (
                            <motion.button
                                whileHover={{
                                    background: "#ddd",
                                    color: "#111",
                                    scale: 1.05,
                                    transition: {
                                        duration: 0.3,
                                        ease: easeInOut,
                                    },
                                }}
                                className="min-w-fit text-white/40 bg-black-600 cursor-pointer grow rounded-full py-px px-5 font-light"
                                key={i}
                                type="submit"
                                onClick={() => send(suggestion)}
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </div>
                    <div className="relative w-full h-full flex gap-5 items-center max-sm:flex-col-reverse">
                        <TextareaAutosize
                            name="userinput"
                            className="text-lg p-2 px-5 text-gray-100 w-full outline-0 rounded-2xl max-h-[20vh] h-fit bg-black-800/30 border border-gray-100/30 resize-none focus:bg-gray-200/10"
                            placeholder="Tell me how the best tailored plan for achieving my goals."
                            value={input}
                            onChange={(e) => setInput(e.currentTarget.value)}
                        />
                        <motion.button
                            disabled={loading}
                            className="h-10 aspect-square cursor-pointer bg-white rounded-full md:pl-px max-sm:p-5 items-center flex"
                            whileHover={{ scale: 1.2, rotate: -10 }}
                            onClick={() => send()}
                        >
                            <p className="md:hidden">Send</p>
                            <SendHorizontal className="translate-x-2/7" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default AIClient;
