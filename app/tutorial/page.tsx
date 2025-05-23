import React from "react";
import Navbar from "../components/Navbar";
import Slideshow from "../components/Slideshow";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Tutorial = async () => {

    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fdf0]">
                <h1 className="text-4xl font-semibold">Tutorial section</h1>
                <Slideshow />
            </div>
        </div>
    );
};

export default Tutorial;
