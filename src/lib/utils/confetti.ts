/**
 * Confetti animation utilities
 */
import confetti from "canvas-confetti";
import { CONFETTI_CONFIG } from "../constants/app";

interface ConfettiPosition {
  x: number;
  y: number;
}

/**
 * Launches confetti animation from a specific element
 * @param event - The mouse event from the clicked element
 * @param duration - Duration of the animation in milliseconds
 * @returns Promise that resolves when animation is complete
 */
export function launchConfetti(
  event: React.MouseEvent<HTMLElement>,
  duration: number = CONFETTI_CONFIG.DURATION
): Promise<void> {
  return new Promise((resolve) => {
    // Get the center coordinates of the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Screen dimensions for normalizing coordinates
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const origin: ConfettiPosition = {
      x: x / screenWidth,
      y: y / screenHeight,
    };

    const frameCount = Math.max(1, Math.ceil(duration / 16));
    let frameIndex = 0;

    const frame = () => {
      // Launch confetti in two directions
      confetti({
        particleCount: CONFETTI_CONFIG.PARTICLE_COUNT,
        angle: CONFETTI_CONFIG.ANGLE_1,
        spread: CONFETTI_CONFIG.SPREAD,
        origin,
      });

      confetti({
        particleCount: CONFETTI_CONFIG.PARTICLE_COUNT,
        angle: CONFETTI_CONFIG.ANGLE_2,
        spread: CONFETTI_CONFIG.SPREAD,
        origin,
      });

      frameIndex += 1;

      if (frameIndex < frameCount) {
        setTimeout(frame, 16);
      } else {
        resolve();
      }
    };

    frame();
  });
}

/**
 * Launches confetti from screen center
 */
export function launchCenterConfetti(duration: number = CONFETTI_CONFIG.DURATION): void {
  const frameCount = Math.max(1, Math.ceil(duration / 16));
  let frameIndex = 0;

  const frame = () => {
    confetti({
      particleCount: CONFETTI_CONFIG.PARTICLE_COUNT * 2,
      angle: 60,
      spread: 55,
      origin: { x: 0.5, y: 0.5 },
    });

    confetti({
      particleCount: CONFETTI_CONFIG.PARTICLE_COUNT * 2,
      angle: 120,
      spread: 55,
      origin: { x: 0.5, y: 0.5 },
    });

    frameIndex += 1;

    if (frameIndex < frameCount) {
      setTimeout(frame, 16);
    }
  };

  frame();
}
