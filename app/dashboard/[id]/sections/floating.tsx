import { writeClient } from "@/sanity/lib/writeclient";
import FloatingClient from "../components/FloatingClient";
import { action_type, projectType } from "@/constants/types";
import { nanoid } from "nanoid";

function FloatingElements({ project }: { project: projectType }) {
    const writeAction = async (data: any, type: action_type) => {
        "use server";

        const minDays = 1;
        const maxDays = 365;
        const frequency = Math.round(
            minDays * Math.pow(maxDays / minDays, data.frequency / 100),
        );

        const item_data = {
            _key: nanoid(),
            title: data.title,
            description: data.description,
            currency: data.currency,
            ammount: Number(data.ammount),
            other: data.other,
            color: data.color,
            id : crypto.randomUUID(),
            frequency,
            type,
            ...(type === "commit"
                ? { date1: data["date-from"], date2: data["date-untill"] }
                : { date1: data.date }),
        };

        await writeClient
            .patch(project._id)
            .setIfMissing({ actions: [] })
            .append("actions", [item_data])
            .commit();
    };

    return (
        <section className="pl-90 w-full h-full absolute left-0 top-0 z-2">
            <FloatingClient project={project} servercallback={writeAction} />
        </section>
    );
}

export default FloatingElements;
