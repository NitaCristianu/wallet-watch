import { auth, signOut } from "@/auth";
import { projectType } from "@/constants/types";
import { client } from "@/sanity/lib/client";
import { PROJECTS_BY_USER } from "@/sanity/lib/queries";
import { Link2, Link2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();
    if (!session || !session?.user) redirect("/");

    const projects = await client.fetch<projectType[]>(PROJECTS_BY_USER, {
        userId: session.user.id,
    });

    return (
        <section className="h-screen w-full flex flex-col justify-center items-center gap-10">
            <div id="log in" className="flex flex-col">
                <div className="flex flex-col items-center gap-5">
                    <img
                        className="rounded-full"
                        src={session?.user?.image as string}
                        alt="profile"
                    />
                    <h1 className="text-3xl font-semibold">
                        Welcome, {session?.user?.name}
                    </h1>
                </div>
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                    }}
                >
                    <button
                        type="submit"
                        className="cursor-pointer text-center w-full bg-red-500 rounded-xl mt-4 p-2 text-red-200 hover:bg-red-400 transition"
                    >
                        Log out
                    </button>
                </form>
            </div>
            <div className="min-w-100 w-[40vw] mt-5 rounded-xl text-gray-600 text-left p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-700 mb-3">
                        PROJECTS
                    </h1>
                    <Link
                        href={"/creation"}
                        className="bg-black-700 hover:bg-black-300 text-gray-100 p-2 rounded-full mb-3 px-4 cursor-pointer transition"
                    >
                        Create new project
                    </Link>
                </div>
                {...projects.map((project, i) => (
                    <div
                        key={project._id}
                        className={`hover:text-gray-800 ease-out duration-150 cursor-pointer w-full h-min py-4 card to-black/2! my-4 p-5 flex justify-between bg-gray-100/40! border-gray-900/20 text-left hover:bg-gray-300/50! transition`}
                    >
                        <Link href={`/dashboard/${project._id}`} className="w-full">
                            {project.title}
                        </Link>
                        <Link2Icon />
                    </div>
                ))}
            </div>
        </section>
    );
}
