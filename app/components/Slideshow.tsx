"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const cards = [
  { title: "Commit", description: "Rezolvă totul", gif: "/animationcommit.gif" },
  { title: "Transfer", description: "vis.", gif: "/animationtransfer.gif" },
  { title: "Goal", description: "Rulează", gif: "/animationgoal.gif" },
  { title: "History", description: "Ușor de iubit.", gif: "/history.gif" },
  { title: "Settings", description: "Ce faci ", gif: "/settings.gif" },
  { title: "Download as json", description: "Totul", gif: "/json.gif" },
];

export default function Slideshow() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateButtons = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;

    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector("div");
    const cardWidth = card?.clientWidth ?? 300;
    const gap = 24;

    slider.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });

    setTimeout(updateButtons, 300);
  };

  useEffect(() => {
    updateButtons();
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", updateButtons);
    return () => slider.removeEventListener("scroll", updateButtons);
  }, []);

  return (
    <section className="relative mt-20 overflow-hidden">
      <div className="relative max-w-[100vw] overflow-hidden">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory gap-6"
          style={{
            paddingInline: "5vw",
            scrollPaddingLeft: "5vw",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="snap-start shrink-0 w-[calc(100vw/3.6)] bg-white rounded-xl shadow-md border border-gray-200 p-6"
            >
              <div className="w-full h-[20rem] rounded-lg overflow-hidden mb-3">
                <Image
                  src={card.gif}
                  alt={card.title}
                  width={500}
                  height={512}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
        )}

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        )}
      </div>
    </section>
  );
}