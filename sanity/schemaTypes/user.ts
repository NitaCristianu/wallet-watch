import { defineField } from "sanity";

export default {
    name: "user",
    title: "User",
    type: "document",
    fields: [
        // Basic Info
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "email",
        }),
        defineField({
            name: "image",
            title: "Profile Picture",
            type: "string",
        }),
        // Metadata
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            readOnly: true,
            initialValue: () => new Date().toISOString(),
        }),

    ],
};
