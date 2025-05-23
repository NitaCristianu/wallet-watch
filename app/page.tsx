import { auth, signIn } from "@/auth";
import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import Testimonials from "./components/Testimonials";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShowPictures from "./components/show";

export default async function Home() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <main className="bg-[#f9fdf0] text-foreground font-sans min-h-screen selection pt-10 scroll-smooth">
            <Navbar />

            <div className="flex flex-col items-center justify-center tracking-wide text-center mt-40 px-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b to-black/10 bg-clip-text text-text-primary mb-2 mt-5 leading-normal">
                    Cash tracking,{" "}
                    <span className="tracking-wide gradient">redefined</span>
                </h1>
                <h5 className="text-base md:text-lg text-text-secondary max-w-xl tracking-wide">
                    Meet the innovation in cash tracking — our AI-powered
                    platform helps you take control of your money.
                </h5>
                <form
                    action={async () => {
                        "use server";
                        await signIn("google");
                    }}
                    className="flex items-center space-x-3 mt-10"
                >
                    <button className="mt-10 px-4 py-2 bg-accent-500 bg-gradient-to-b to-black/10 text-white rounded-md shadow-md hover:bg-green-700 hover:scale-105 transform transition duration-200 flex items-center gap-2">
                        sign up
                        <img
                            src="arrow.svg"
                            alt="Arrow Icon"
                            className="w-5 h-6"
                        />
                    </button>
                </form>
            </div>

            <Cards />

            <ShowPictures />

            {/* <div>
        <Image src="/wwim1.jpg" alt="Wallet Watch" className="w-[230px] h-auto mt-10" />
      </div> */}

            <Testimonials />
            <div className="bg-black-900 text-gray-100 flex justify-between items-center p-20 gap-10 max-sm:flex-col mt-[10vh]">
                <div>
                    <h1 className="text-5xl md:text-8xl ">WalletWatch</h1>
                    <p className="px-2 font-[200]">Simplifying your life.</p>
                </div>
                <div className="flex-col text-gray-100 gap-5 md:gap-8 flex max-sm:text-sm text-left font-light text-xl md:pr-20">
                    <Link href={"/"} type="submit">
                        <h2 className=" text-gray-200">Back to Wallet Watch</h2>
                    </Link>

                    <Link href="/tutorial">
                        <h2 className=" text-gray-200">See Tutorials</h2>
                    </Link>
                </div>
            </div>

            {/* <div className="motto">@nitpreainternationalcompany2025</div> */}
        </main>
    );
}
