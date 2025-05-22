import { actionType, projectType } from "@/constants/types";
import AIClient from "../components/AI-client";

function AISection({
    project,
    actions,
    currency,
}: {
    project: projectType;
    actions: actionType[];
    currency: string;
}) {
    const callback = async (input: string, context: string) => {
        "use server";
        console.log(input);
    };

    return (
        <section className="h-screen">
            <AIClient
                servercallback={callback}
                initmessages={[
                    {
                        author: "ai",
                        content: "Hello, how can I help you today?",
                    },
                ]}
                project={project}
                actions={actions}
                currency={currency}
            />
        </section>
    );
}

export default AISection;
