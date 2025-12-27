/**
 * Slide configuration for the landing page carousel
 */
export interface Slide {
  url: string;
  title1: string;
  title2: string;
}

export const LANDING_SLIDES: Slide[] = [
  {
    url: "https://source.unsplash.com/nfTA8pdaq9A/2000x1100.png",
    title1: "Wish Happy Birthday",
    title2: "to your friends",
  },
  {
    url: "https://source.unsplash.com/okmtVMuBzkQ/2000x1100",
    title1: "Never forget a",
    title2: "birthday",
  },
  {
    url: "https://source.unsplash.com/okmtVMuBzkQ/2000x1100",
    title1: "Get started",
    title2: "today",
  },
];

/**
 * Slide transition settings
 */
export const SLIDE_CONFIG = {
  TRANSITION_DURATION: 700, // ms
  AUTO_PLAY_INTERVAL: 5000, // ms (set to 0 to disable)
} as const;
