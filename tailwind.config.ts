import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Montserrat', 'Helvetica', 'sans-serif'],
        nav: ['"Space Mono"', 'monospace'],
      },
      colors: {
        dark: '#111',
        border: '#ccc',
        transBg: '#ededed',
      },
      transitionTimingFunction: {
        'cb-1': 'cubic-bezier(.4,0,.2,1)',
        'cb-2': 'cubic-bezier(.19,1,.22,1)',
        'cb-3': 'cubic-bezier(.77,0,.175,1)',
        'cb-4': 'cubic-bezier(.99,1,.92,1)',
      },
      padding: {
        '3em': '3em',
      },
      screens: {
        med: '54em',
        large: '65em',
        xlarge: '91em',
      },
    },
  },
  plugins: [],
};
export default config;


