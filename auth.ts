import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { client } from "./sanity/lib/client";
import { USER_BY_EMAIL } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/writeclient";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({account, profile}) {
            const existingUser = await client.fetch(USER_BY_EMAIL, {
                email : profile?.email
            });
            if (!existingUser){
                await writeClient.create({
                    _type : 'user',
                    name : profile?.name,
                    email : profile?.email,
                    image : profile?.picture
                });
            }
            return true;
        },
        async jwt({ token, profile }) {
            if (profile){
                const user = await client.fetch(USER_BY_EMAIL, {
                    email : profile.email
                });

                token.id = user?._id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) session.user.id = token.id as string;
            return session;
        },
    },
})