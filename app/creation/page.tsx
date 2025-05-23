import { redirect } from "next/navigation";
import Step1 from "./steps/step1";
import { auth } from "@/auth";
import { projectType } from "@/constants/types";
import { PROJECTS_BY_USER } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeclient";

async function ProjectCreation() {
    const session = await auth();
    if (!session || !session?.user) redirect("/");

    const projects = await client.fetch<projectType[]>(PROJECTS_BY_USER, {
        userId: session.user.id,
    });

    return (
        <section>
            <Step1
                projects={projects}
                callback={async (title: string, currency: string, actions : any[]) => {
                    "use server";
                    if (!session.user) return;
                    const project = await writeClient.create({
                        _type: "project",
                        title,
                        currency,
                        actions: actions,
                        user: {
                            _type: "reference",
                            _ref: session.user.id, 
                        },
                    });

                    redirect("/dashboard/" + project._id);
                }}
            />
        </section>
    );
}

export default ProjectCreation;
