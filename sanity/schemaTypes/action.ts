import { defineField } from "sanity";

export default {
    title: "Action",
    name: "action",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
        }),
        defineField({
            name: "ammount",
            title: "Amount",
            type: "number",
        }),
        defineField({
            name: "other",
            title: "Other",
            type: "string",
        }),
        defineField({
            name: "color",
            title: "Color",
            type: "string",
        }),
        defineField({
            name: "frequency",
            title: "Frequency",
            type: "number",
        }),
        defineField({
            name: "type",
            title: "Type",
            type: "string",
            options: {
                list: ["commit", "transfer", "goal"],
            },
        }),
        defineField({
            name: "date1",
            title: "Start Date",
            type: "date",
        }),
        defineField({
            name: "id",
            title: "Index-ID",
            type: "string",
            initialValue: ()=> crypto.randomUUID(),
        }),
        defineField({
            name: "date2",
            title: "End Date",
            type: "date",
            hidden: ({ parent }) => parent?.type !== "commit",
        }),
    ],
};
