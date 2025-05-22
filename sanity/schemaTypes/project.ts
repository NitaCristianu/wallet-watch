import { defineField } from "sanity";
import action from "./action";

export default {
    title: "Project",
    name: "project",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "user",
            title: "User",
            type: "reference",
            to: [{ type: "user" }],
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            initialValue: "EUR"
        }),
        defineField({
            name: "Dedication",
            title: "Dedication",
            type: "number",
            initialValue: .5
        }),
        defineField({
            name: "dailybudget",
            title: "Override Daily Budget",
            type: "number",
            initialValue: -1
        }),
        defineField({
            name: "actions",
            title: "Actions",
            type: "array",
            of: [{ type: "action" }],
        }),
    ],
};
