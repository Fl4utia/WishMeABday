"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

interface HomeProps {
  name: string; // Assuming you will pass the name as a prop
}

export default function Home({ name }: HomeProps) {
  const router = useRouter();

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>, route: string) => {
    // Obtener las coordenadas del centro del círculo
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Obtener el tamaño de la pantalla para normalizar las coordenadas
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Lanzar confeti desde la posición del círculo clicado
    const duration = 1000; // Duración del confeti en ms
    const end = Date.now() + duration;

    const frame = () => {
      // Continuar lanzando confeti mientras la duración no termine
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: {
          x: x / screenWidth,
          y: y / screenHeight
        }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: {
          x: x / screenWidth,
          y: y / screenHeight
        }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Iniciar la animación del confeti
    frame();

    // Esperar a que la animación termine antes de redirigir
    setTimeout(() => {
      router.push(route); // Redirigir a la ruta específica
    }, duration);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-black">
      {/* Navigation */}
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          <button className="slides-nav__prev px-2 py-1 font-mono">Create</button>
          <button className="slides-nav__next px-2 py-1 font-mono">Dashboard</button>
        </nav>
      </section>

      <section className="slides relative w-full h-full overflow-hidden flex flex-col items-center justify-center flex-grow">
        <h1 className="text-center text-2xl font-bold mb-8 mt-12 slide__title">Welcome, {name}!!</h1>
        <div>
        <p className="text-center   mt-2 text-content">Select a theme to get started</p>

        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-3 pt-20">
          {/* Círculos con imágenes */}
          {[
            { route: "/birthday1", imgSrc: "/cards/1.png" },
            { route: "/birthday2", imgSrc: "/cards/2.png" },
            { route: "/birthday3", imgSrc: "/cards/3.png" },
          ].map(({ route, imgSrc }, index) => (
            <div
              key={index}
              onClick={(event) => handleClick(event, route)} // Acción al hacer clic
              className="relative w-36 h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer transform transition-transform duration-500 hover:scale-110"
            >
              <Image
                src={imgSrc} // Reemplaza con la ruta de tus imágenes
                alt={`Image ${index + 1}`}
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
