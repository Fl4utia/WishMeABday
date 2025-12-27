/**
 * Navigation component for the application
 * Displays navigation buttons based on authentication state
 */
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/utils/auth";
import { ROUTES } from "@/lib/constants/routes";

interface NavigationProps {
  showHome?: boolean;
  showCards?: boolean;
  showDashboard?: boolean;
  showLogout?: boolean;
  showLogin?: boolean;
  onNavigate?: (route: string) => void;
}

export default function Navigation({
  showHome = false,
  showCards = false,
  showDashboard = false,
  showLogout = false,
  showLogin = false,
  onNavigate,
}: NavigationProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
      <div className="slides-nav__nav rotate-90 transform origin-center">
        {showHome && (
          <button
            className="slides-nav__prev px-2 py-1 font-mono hover:text-gray-600 transition-colors"
            onClick={() => handleNavigation(ROUTES.HOME)}
            aria-label="Go to home"
          >
            Home
          </button>
        )}

        {showCards && (
          <button
            className="slides-nav__next px-2 py-1 font-mono hover:text-gray-600 transition-colors"
            onClick={() => handleNavigation(ROUTES.CARDS)}
            aria-label="Go to cards"
          >
            Cards
          </button>
        )}

        {showDashboard && (
          <button
            className="slides-nav__next px-2 py-1 font-mono hover:text-gray-600 transition-colors"
            onClick={() => handleNavigation(ROUTES.DASHBOARD)}
            aria-label="Go to dashboard"
          >
            Dashboard
          </button>
        )}

        {showLogin && (
          <button
            className="slides-nav__next px-2 py-1 font-mono hover:text-gray-600 transition-colors"
            onClick={() => handleNavigation(ROUTES.LOGIN)}
            aria-label="Go to login"
          >
            Login
          </button>
        )}

        {showLogout && (
          <button
            className="slides-nav__next px-2 py-1 font-mono hover:text-gray-600 transition-colors"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
