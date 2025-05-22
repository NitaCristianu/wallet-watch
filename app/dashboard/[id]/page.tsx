import { client } from "@/sanity/lib/client";
import { ACTIONS_BY_PROJECT_ID, PROJECT_BY_ID } from "@/sanity/lib/queries";
import { redirect } from "next/navigation";
import FloatingElements from "./sections/floating";
import { actionType, projectType } from "@/constants/types";
import GeneralSection from "./sections/general";
import GoalDashboard from "./sections/goal-dashboard";
import AISection from "./sections/aisection";
import Utilities from "./sections/utilsection";

export const revalidate = 0;

export default async function Project({ params }: { params: { id: string } }) {
    const { id: projectId } =  params;
    const project = (await client.fetch(PROJECT_BY_ID, {
        projectId,
    })) as projectType | null;
    if (!project) redirect("/dashboard");
    const project_actions = await client.fetch(ACTIONS_BY_PROJECT_ID, {
        projectId,
    });
    const currency = project.currency || "EUR";

    return (
        <main className="scroll-smooth overflow-x-hidden  scrollbar-min">
            {/* <Sidebar project_data={project} /> */}
            <section id="section-container " className=" bg-gray-200 ">
                <div className="px-[10vw]">
                    <GeneralSection
                        actions={
                            (project_actions?.actions || []) as actionType[]
                        }
                        currency={currency}
                        project={project}
                    />
                    <GoalDashboard
                        actions={
                            (project_actions?.actions || []) as actionType[]
                        }
                        currency={currency}
                        project={project}
                    />
                </div>

                <AISection
                    actions={(project_actions?.actions || []) as actionType[]}
                    currency={currency}
                    project={project}
                />
                <Utilities
                    actions={(project_actions?.actions || []) as actionType[]}
                    project={project}
                />
            </section>
            <FloatingElements project={project} />
        </main>
    );
}
