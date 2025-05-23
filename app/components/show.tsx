"use client";
import { motion } from "framer-motion";
import Image from "next/image";

function InfoBox({
    text,
    href,
    index,
}: {
    text: string;
    href: string;
    index: 0 | 1;
}) {
    return (
        <div
            className="w-3/5 mx-auto h-[70vh] flex gap-20 items-center"
            style={{ flexDirection: index == 0 ? "row-reverse" : "row", marginTop : index == 0 ? "0px" : "-20vh" }}
        >
            <div className="text-xl text-text-secondary text-wrap w-3/5 card h-fit p-10">
                <p className="text-left">{text}</p>
            </div>
            <div className="card relative h-full w-2/5 rounded-2xl overflow-hidden">
                <Image fill src={href} alt="showcaseimg" className="object-cover" />
            </div>
        </div>
    );
}

function ShowPictures() {
    return (
        <section className="space-y-10 mb-[10vh]">
            <InfoBox
                text="WalletWatch simplifies financial decisions through AI-powered insights. Track spending, set goals, and get personalized guidance—all in one calm, clear platform."
                href="/wwim1.jpg"
                index={0}
            />
            <InfoBox
                text="WalletWatch helps you stay on top of your money—effortlessly. Visualize your finances with clean, intuitive cards that show your progress and spending at a glance."
                href="/wwim2.jpg"
                index={1}
            />
        </section>
    );
}

export default ShowPictures;
