// components/HorizontalScroll.jsx
"use client";
import { useEffect, useRef } from "react";
import Card from "./Card";

export default function HorizontalScroll() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;

    const onWheel = (e) => {
      if (!el) return;

      const delta = e.deltaY;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft >= maxScrollLeft;
      const atStart = el.scrollLeft <= 0;

      if ((delta > 0 && !atEnd) || (delta < 0 && !atStart)) {
        e.preventDefault();
        el.scrollLeft += delta;
      }
    };

    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => el?.removeEventListener("wheel", onWheel);
  }, []);

  const cards = [
    {
      color: "#F4F4F4",
      firstHeading: "Your",
      secondHeading: "Journey",
      description: "Discover personalized skincare solutions that adapt to your unique needs.",
      imageUrl: "/assets/card1.png",
    },
    {
      color: "#E1F7E7",
      firstHeading: "Advanced",
      secondHeading: "Analysis",
      description: "Our technology analyzes your skin to create a custom routine.",
      imageUrl: "/assets/card2.png",
    },
    {
      color: "#FDE6E0",
      firstHeading: "Evolve",
      secondHeading: "With You",
      description: "Continuous improvement as your skin changes over time.",
      imageUrl: "/assets/card3.png",
    },
  ];

  return (
    <section className="h-[300vh] relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center bg-black text-white">
        <h1 className="text-[8vw] font-light text-gray-400 leading-none mb-2">what we bring to</h1>
        <h2 className="text-[8vw] font-light text-white leading-none mb-8">the table!</h2>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory px-8 py-4 w-full"
        >
          <div className="flex gap-8 h-full w-max">
            {cards.map((card, index) => (
              <div key={index} className="snap-center flex-shrink-0">
                <Card {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
