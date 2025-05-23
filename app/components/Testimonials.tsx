"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Exceeded our expectations with innovative designs that brought our vision to life – a truly remarkable creative agency.",
    name: "Luca",
    title: "IT programmer at APPLE",
  },
  {
    quote:
      "Their ability to capture our brand essence is unparalleled – an invaluable creative collaborator.",
    name: "Georgeta Craciunescu",
    title: "Member of Flow by David Enciu",
  },
  {
    quote:
      "Creative geniuses who listen, understand, and craft captivating visuals – an agency that truly gets us.",
    name: "Alexandru Rudau",
    title: "Co-founder of Flow by David Enciu",
  },
  {
    quote:
      "A refreshing and imaginative agency that consistently delivers exceptional results – highly recommended.",
    name: "Iosif Savu",
    title: "CEO and Co-founder of Flow by David Enciu",
  },
  {
    quote:
      "From concept to execution, their creativity knows no bounds – a game-changer for our brand.",
    name: "David Enciu",
    title: "Janitor at Flow by David Enciu",
  },
];

const extended = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="w-full bg-[#f9fdf0] py-25 px-6 md:px-12 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Opinions from the most frequent users
      </h2>
      
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 70,
          ease: "linear",
        }}
      >
        {extended.map((t, i) => (
          <div
            key={i}
            className="min-w-[300px] md:min-w-[350px] p-6 rounded-xl shadow-lg flex flex-col gap-4"
          >
            <div className="text-xl text-gray-800 font-medium leading-relaxed">
              <span className="text-accent-500 text-3xl leading-none">“</span>
              {t.quote}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.title}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
