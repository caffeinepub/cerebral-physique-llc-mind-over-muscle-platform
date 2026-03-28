import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/workout-library", label: "Library" },
    { to: "/programs", label: "Programs" },
    { to: "/nutrition", label: "Nutrition" },
    { to: "/blog", label: "Blog" },
    { to: "/store", label: "Store" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      data-ocid="header.panel"
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-purple-900/40"
    >
      {/* Nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors tracking-wide uppercase text-xs"
                activeProps={{
                  className:
                    "px-3 py-1.5 text-sm font-medium text-purple-400 bg-purple-900/20 rounded-md tracking-wide uppercase text-xs",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/creator"
                data-ocid="nav.creator.link"
                className="px-3 py-1.5 text-xs font-medium text-purple-400 hover:text-white hover:bg-purple-900/30 rounded-md transition-colors uppercase tracking-wide"
              >
                Creator
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                data-ocid="nav.dashboard.link"
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors uppercase tracking-wide"
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid="header.auth.button"
              className="px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-wide"
            >
              {isLoggingIn
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="header.mobile_menu.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/98 border-t border-purple-900/30">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/creator"
                className="block px-3 py-2 text-sm font-medium text-purple-400 hover:text-white hover:bg-purple-900/20 rounded-md transition-colors uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                Creator Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                handleAuth();
                setMobileMenuOpen(false);
              }}
              disabled={isLoggingIn}
              className="w-full mt-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-wide"
            >
              {isLoggingIn
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
