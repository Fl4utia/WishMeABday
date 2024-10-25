// ConfettiCard.tsx
"use client";
import React from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCardProps {
  imageUrl: string;
  altText: string;
}

const ConfettiCard: React.FC<ConfettiCardProps> = ({ imageUrl, altText }) => {
  const handleClick = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      className="relative w-full h-64 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-lg border border-black overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="object-cover w-full h-full rounded-lg"
      />
    </div>
  );
};

export default ConfettiCard;
