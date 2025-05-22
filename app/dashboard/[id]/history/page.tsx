import { projectType } from "@/constants/types";
import { client } from "@/sanity/lib/client";
import { ACTIONS_BY_PROJECT_ID, PROJECT_BY_ID } from "@/sanity/lib/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowBigRight, ArrowRightCircle } from "lucide-react";
import { writeClient } from "@/sanity/lib/writeclient";
import dynamic from "next/dynamic";
import { Metadata } from "next";



const ClientComponent = dynamic(() => import("./client"));
export const revalidate = 0;

export default async function Project(data : any) {
    const { id: projectId } = data.params;
    const project = (await client.fetch(PROJECT_BY_ID, {
        projectId,
    })) as projectType | null;
    if (!project) redirect("/dashboard");
    const project_actions = await client.fetch(ACTIONS_BY_PROJECT_ID, {
        projectId,
    });

    const callback = async (ids: string[], projectId: string) => {
        "use server";
        if (!projectId) return;
        await writeClient
            .patch(projectId)
            .unset(ids.map((id) => `actions[id == "${id}"]`))
            .commit();
    };

    return (
        <section className="h-screen grid place-items-center overflow-hidden">
            <div className="relative flex flex-col items-center">
                <h1 className="text-5xl p-4 mb-3 font-semibold">
                    {project.title} - History
                </h1>
                <ClientComponent
                    callback={callback}
                    projectId={projectId}
                    actions={(project_actions?.actions as any) || []}
                />
                <Link
                    className="bg-black-500 p-3 pl-5 pr-4 relative rounded-xl text-gray-100 mt-5 gap-2 flex hover:bg-black-700 transition"
                    href={`/dashboard/${project._id}`}
                >
                    Back to dashboard
                    <ArrowRightCircle />
                </Link>
            </div>
        </section>
    );
}
