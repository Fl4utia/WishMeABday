"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import ConfettiCard from "@/components/ConfettiCards";

interface HomeProps {
  name: string; // Assuming you will pass the name as a prop
}

export default function Home({ name }: HomeProps) {
  const router = useRouter();

  const handleClick = (index: number) => {
    // Lanzar confeti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Redirigir después de un pequeño retraso
    setTimeout(() => {
      router.push(`/route${index}`); // Cambia '/route${index}' con las rutas reales
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-black">
      {/* Navigation */}
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          <button className="slides-nav__prev px-2 py-1 font-mono">Card</button>
          <button className="slides-nav__next px-2 py-1 font-mono">Dashboard</button>
        </nav>
      </section>

      <section className="slides relative w-full h-full overflow-hidden flex flex-col items-center justify-center flex-grow">
        <h1 className="text-center text-2xl font-bold mb-8 mt-12 slide__title">Welcome, {name}!</h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-3 pt-20">
          {/* Círculos con imágenes */}
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              onClick={() => handleClick(index)} // Acción al hacer clic
              className="relative w-36 h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer transform transition-transform duration-500 hover:scale-110"
            >
              <Image
                src={`/path/to/your/image${index}.jpg`} // Reemplaza con la ruta de tus imágenes
                alt={`Image ${index}`}
                layout="fill" // Esto asegura que la imagen llene el contenedor
                objectFit="cover" // Esto recorta la imagen para que ajuste el círculo
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
