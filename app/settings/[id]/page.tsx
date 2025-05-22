import { projectType } from "@/constants/types";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_ID } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/writeclient";
import {
    ArrowRightCircle,
    Delete,
    Euro,
    SaveAll,
    TextIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClientSettingsPage from "./client";

export default async function Project({ params }: { params: { id: string } }) {
    const { id: projectId } = params;
    const project = (await client.fetch(PROJECT_BY_ID, {
        projectId,
    })) as projectType | null;
    if (!project) redirect("/dashboard");
    const action = async (form: FormData) => {
        "use server";
        const dailybudget =
            form.get("hasdailybudget") == "on" ? form.get("dailybudget") : -1;
        await writeClient
            .patch(projectId)
            .set({
                title: form.get("title"),
                dailybudget,
                Dedication: Number(form.get("dedication")),
                currency : form.get("currency"),
            })
            .commit();
    };
    return (
        <section className="h-screen grid place-items-center overflow-hidden">
            <div className="relative flex flex-col items-center">
                <h1 className="text-5xl p-4 font-semibold mb-10">
                    {project.title} - Settings
                </h1>

                <ClientSettingsPage action={action} project={project} />

                <div className="flex gap-5">
                    <Link
                        className="bg-black-500 p-3 pl-5 pr-4 relative rounded-xl text-gray-100 mt-5 gap-2 flex hover:bg-black-700 transition"
                        href={`/dashboard/${project._id}`}
                    >
                        Back to dashboard
                        <ArrowRightCircle />
                    </Link>
                    <form
                        action={async () => {
                            "use server";
                            await writeClient.delete(projectId);
                            redirect("/");
                        }}
                    >
                        <button
                            className="bg-red-500 p-3 pl-5 pr-4 relative rounded-xl text-gray-100 mt-5 gap-2 flex hover:bg-red-700 transition cursor-pointer"
                            type="submit"
                        >
                            Delete project
                            <Delete />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
