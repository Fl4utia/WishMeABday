"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../app/db/firebase/config"; // Firebase config
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const slides = [
  { url: "https://source.unsplash.com/nfTA8pdaq9A/2000x1100.png", title1: "Wish Happy Birthday", title2: "to your friends" },
  { url: "https://source.unsplash.com/okmtVMuBzkQ/2000x1100", title1: "Never forget a", title2: "birthday" },
  { url: "https://source.unsplash.com/okmtVMuBzkQ/2000x1100", title1: "Get started", title2: "today" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const router = useRouter();

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);  // User is logged in
      } else {
        setIsAuthenticated(false); // User is logged out
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isSliding) return;
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSliding) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSliding]);

  const prevSlide = () => {
    setIsSliding(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsSliding(false), 700); // Shortened transition time
  };

  const nextSlide = () => {
    setIsSliding(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsSliding(false), 700); // Shortened transition time
  };

  const handleButtonClick = () => {
    if (isAuthenticated) {
      router.push("/cards"); // Redirect to Cards page if logged in
    } else {
      router.push("/login"); // Redirect to Login page if not logged in
    }
  };

  return (
    <main>
      <section className="slides relative w-full h-screen overflow-hidden">
        {/* Navigation */}
        <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
          <nav className="slides-nav__nav rotate-90 transform origin-center">
            <button
              className="slides-nav__prev px-2 py-1 font-mono"
              onClick={prevSlide}
            >
              Prev
            </button>
            <button
              className="slides-nav__next px-2 py-1 font-mono"
              onClick={nextSlide}
            >
              Next
            </button>
            <button
              className="slides-nav__next px-2 py-1 font-mono"
              onClick={handleButtonClick}
            >
              {isAuthenticated ? "Cards" : "Login"} {/* Conditionally render button text */}
            </button>
          </nav>
        </section>

        {/* Slides */}
        {slides.map((slide, index) => (
          <section
            key={index}
            className={`slide absolute w-full h-full transition-opacity duration-[800ms] ease-in-out ${
              index === currentSlide ? "is-active z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <div className="slide__content relative w-[95%] h-[95%] md:w-[80%] md:h-[80%] mx-auto top-[2.5%] md:top-[10%]">
              <figure className="slide__figure absolute inset-0 w-full h-full">
                <div
                  className="slide__img bg-cover bg-center h-full"
                  style={{ backgroundImage: `url(${slide.url})` }}
                ></div>
              </figure>
              <header className="slide__header flex items-center h-full">
                <h2 className="slide__title text-2xl md:text-5xl font-bold">
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
        ))}
      </section>
    </main>
  );
}
