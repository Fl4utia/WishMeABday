"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { auth } from "../db/firebase/config";



export default function Home () {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push("/login");
    });
  };

  const handleClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    route: string,
    cardType: number
  ) => {
    // Get the center coordinates of the clicked circle
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Screen dimensions for normalizing coordinates
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Launch confetti from the circle's position
    const duration = 1000; // Confetti duration in ms
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: x / screenWidth, y: y / screenHeight },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: x / screenWidth, y: y / screenHeight },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Start confetti animation
    frame();

    // Wait for confetti to finish before redirecting
    setTimeout(() => {
      router.push(`${route}?cardtype=${cardType}`);
    }, duration);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-black">
      {/* Navigation */}
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
          <nav className="slides-nav__nav rotate-90 transform origin-center">
            <button
              className="slides-nav__prev px-2 py-1 font-mono"
             
            >
              Home
            </button>
            <button
              className="slides-nav__next px-2 py-1 font-mono"
              onClick={() => router.push("/dashboard")}
            >
              Cards
            </button>
            <button
              className="slides-nav__next px-2 py-1 font-mono"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </section>

      <section className="slides relative w-full h-full overflow-hidden flex flex-col items-center justify-center flex-grow">
        <h1 className="text-center text-2xl font-bold mb-8 mt-12 slide__title">Welcome!</h1>
        <div>
          <p className="text-center mt-2 text-content">Select a theme to get started</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-3 pt-20">
          {[
            { route: "/wish", imgSrc: "/cards/1.png", cardType: 1 },
            { route: "/wish", imgSrc: "/cards/2.png", cardType: 2 },
            { route: "/wish", imgSrc: "/cards/3.png", cardType: 3 },
          ].map(({ route, imgSrc, cardType }, index) => (
            <div
              key={index}
              onClick={(event) => handleClick(event, route, cardType)} // Pass cardType
              className="relative w-36 h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center cursor-pointer transform transition-transform duration-500"
            >
              <Image
                src={imgSrc}
                alt={`Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
