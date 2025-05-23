import { signIn } from "@/auth";
import Link from "next/link";

const Navbar = () => {
    return (
        <div className="fixed -translate-x-1/2 left-1/2 px-20 rounded-xl border border-white/10 z-50 top-6 w-[90%] bg-gray-100/30 backdrop-blur-xl max-w-6xl">
            <div className="flex justify-between items-center w-full rounded-xl p-3 shadow-md transition-shadow duration-300">
                <div className="flex gap-4 ">
                    <Link href={"/"} type="submit">
                        <h2 className="text-base font-semibold text-text-primary">
                            Wallet Watch
                        </h2>
                    </Link>

                    <Link href="/tutorial">
                        <h2 className="text-base font-semibold text-text-secondary">
                            Tutorial
                        </h2>
                    </Link>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google");
                    }}
                    className="flex items-center space-x-3"
                >
                    <button
                        type="submit"
                        className="py-1 pb-2 px-3 bg-[#28a745] text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                    >
                        log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Navbar;
