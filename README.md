# Birthday Cards App

<div align="center">

<img src="https://i.ibb.co/VcwYyLd/f.png" alt="Birthday Cards App Icon" width="200"/>

<br/>

<img src="https://s12.gifyu.com/images/bhzhw.gif" alt="Birthday Card Demo" width="800"/>

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green?style=for-the-badge&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

### A modern, interactive web application for creating and sending personalized birthday cards with AI-generated messages.

[Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Tech Stack](#tech-stack)

</div>

---

## Project Overview

This application allows users to:
- Choose from multiple birthday card designs
- Generate personalized birthday messages using AI (OpenAI GPT)
- Send birthday cards via email
- Authenticate securely using Google Sign-In (Firebase Auth)
- Enjoy interactive animations and confetti effects
- Experience a responsive, mobile-friendly design

## Documentation

- **Project Definition**: [Google Doc](https://docs.google.com/document/d/12H-8ZWMMZJGwY_Au9-M_V7rOe9Ud7HGca6-igmBImv4/edit?usp=sharing)
- **Database Schema**: [Lucidchart](https://lucid.app/lucidchart/9458501d-1211-47f4-9fec-d414eafa17ee/edit?viewport_loc=42%2C-43%2C907%2C752%2C0_0&invitationId=inv_38ae5084-d897-41cc-82ba-bd11cada5a3e)

## Features

- **AI-Powered Messages**: Generate unique, personalized birthday wishes using OpenAI's GPT model
- **Multiple Card Designs**: Three distinct card templates with different visual styles
- **Google Authentication**: Secure login with Firebase Authentication
- **Email Integration**: Send cards directly via Resend API
- **Interactive UI**: Smooth transitions, confetti animations, and keyboard navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

<p align="center">
  <img src="https://i.ibb.co/VcwYyLd/f.png" alt="Birthday Cards App" width="120"/>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,firebase,nodejs" alt="Tech Stack" />
</p>

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white) |
| **Backend** | ![Firebase](https://img.shields.io/badge/Firebase-11.0-orange?logo=firebase&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) |
| **AI** | ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green?logo=openai&logoColor=white) |
| **Email** | ![Resend](https://img.shields.io/badge/Resend-API-000000) |
| **Testing** | ![Jest](https://img.shields.io/badge/Jest-29.7-C21325?logo=jest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-React-E33332?logo=testing-library&logoColor=white) |
| **Tools** | ![npm](https://img.shields.io/badge/npm-10+-CB3837?logo=npm&logoColor=white) ![Git](https://img.shields.io/badge/Git-2.0-F05032?logo=git&logoColor=white) |

</div>

---

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Google account (for Firebase project creation)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Resend API key ([Sign up here](https://resend.com/))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fl4utia/semana_tec.git
   cd semana_tec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory (see [Environment Variables](#-environment-variables) section below):
   ```bash
   cp env_example .env.local
   ```
   
   Then edit `.env.local` with your actual credentials.

4. **Set up Firebase**
   
   a. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Give your project a name (e.g., "birthday-cards-app")
   
   b. **Enable Authentication**
   - In your Firebase project, navigate to **Authentication** in the left sidebar
   - Click "Get started"
   - Go to the **Sign-in method** tab
   - Enable **Google** as a sign-in provider
   - Click "Save"
   
   c. **Enable Firestore Database**
   - Navigate to **Firestore Database** in the left sidebar
   - Click "Create database"
   - Choose **Start in production mode** (or test mode for development)
   - Select a Cloud Firestore location (choose closest to your users)
   - Click "Enable"
   
   d. **Get Firebase Configuration**
   - Go to **Project Settings** (gear icon in the left sidebar)
   - Scroll down to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Register your app with a nickname
   - Copy the Firebase config object and paste the values into your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI Configuration
NEXT_PUBLIC_OPENAI_KEY=your_openai_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Resend Email Configuration
NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key

# Google OAuth (Optional - Firebase auto-generates if not provided)
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

**Important**: Never commit `.env.local` to version control. Use `env_example` as a template.

## Project Structure

```
semana_tec/
├── public/                    # Static assets
│   ├── audios/               # Audio files
│   ├── cards/                # Card images
│   └── *.svg                 # SVG icons
├── src/
│   └── app/
│       ├── api/              # API routes
│       │   ├── openai/       # OpenAI integration
│       │   └── send/         # Email sending
│       ├── birthday1/        # Card template 1
│       ├── birthday2/        # Card template 2
│       ├── birthday3/        # Card template 3
│       ├── cards/            # Card selection page
│       ├── components/       # Reusable components
│       ├── dashboard/        # User dashboard
│       ├── db/               # Database config
│       │   ├── auth/         # Auth pages
│       │   └── firebase/     # Firebase config
│       ├── login/            # Login page
│       ├── modules/          # CSS modules
│       └── page.tsx          # Home page
├── .env.local                # Environment variables (not in git)
├── env_example               # Environment template
└── README.md                 # This file
```

## Usage

1. **Landing Page**: Scroll or use arrow keys to navigate through introduction slides
2. **Login**: Click "Login" and authenticate with your Google account
3. **Select Card**: Choose from three card designs on the cards page
4. **Customize**: Add recipient information and generate AI message
5. **Send**: Send the card via email to the recipient

## Testing

To run tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy on Vercel (Recommended)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Fl4utia/semana_tec)

</div>

**Steps:**
1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Follow TypeScript best practices
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Keep components small and focused
- Write descriptive comments for complex logic
- Use environment variables for sensitive data

---

## Security Notes

- Never commit API keys or secrets to version control
- Rotate all API keys if accidentally exposed
- Review Firebase security rules regularly
- Use environment variables for all sensitive configuration

---

## License

This project is private and maintained by [Fl4utia](https://github.com/Fl4utia).

---

## Acknowledgments

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## Support

<div align="center">

[![Open Issue](https://img.shields.io/badge/Open-Issue-red?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Fl4utia/semana_tec/issues)

**Made for celebrating birthdays | Star this repo if you found it helpful**

</div>

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Note**: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
