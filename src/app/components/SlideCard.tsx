/**
 * Slide Card Component
 * Displays individual slide with background image and title
 */
"use client";

import type { Slide } from "@/lib/constants/slides";

interface SlideCardProps {
  slide: Slide;
  isActive: boolean;
  index: number;
}

export default function SlideCard({ slide, isActive, index }: SlideCardProps) {
  return (
    <section
      className={`slide absolute w-full h-full transition-opacity duration-[800ms] ease-in-out ${
        isActive ? "is-active z-10 opacity-100" : "z-0 opacity-0"
      }`}
      aria-hidden={!isActive}
      aria-label={`Slide ${index + 1}: ${slide.title1} ${slide.title2}`}
    >
      <div className="slide__content relative w-[95%] h-[95%] md:w-[80%] md:h-[80%] mx-auto top-[2.5%] md:top-[10%]">
        <figure className="slide__figure absolute inset-0 w-full h-full">
          <div
            className="slide__img bg-cover bg-center h-full rounded-lg"
            style={{ backgroundImage: `url(${slide.url})` }}
            role="img"
            aria-label={`Background image for ${slide.title1}`}
          />
        </figure>
        <header className="slide__header flex items-center h-full">
          <h2 className="slide__title text-2xl md:text-5xl font-bold text-white drop-shadow-lg">
            <span className="title-line block">
              <span className="inline-block">{slide.title1}</span>
            </span>
            <span className="title-line block">
              <span className="inline-block">{slide.title2}</span>
            </span>
          </h2>
        </header>
      </div>
    </section>
  );
}
