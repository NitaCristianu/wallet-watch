import { auth, signIn  } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session && session.user) redirect("/dashboard");

  return (<main className="h-screen grid place-items-center">
    {!session || !(session?.user) ? <section id="log-out">
      <h1 className="text-2xl font-bold w">
        Wallet-Watch
      </h1>
      <form action={async () => {
        "use server";
        await signIn("google", {redirectTo : "/dashboard"});
      }}>
        <button type="submit" className="cursor-pointer text-center w-full bg-blue-500 rounded-xl mt-4 p-2 text-blue-200">
          Log in
        </button>
      </form>
    </section> : null}
  </main>);
}