import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/generated/cerebral-physique-logo.dim_200x200.png"
            alt="Cerebral Physique"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold">Cerebral Physique</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/workout-library"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Workout Library
          </Link>
          <Link
            to="/programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Programs
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            to="/store"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Store
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/creator-dashboard' })}
              className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
            >
              Creator Dashboard
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => navigate({ to: isAuthenticated ? '/dashboard' : '/dashboard' })}
            className="bg-neon-purple text-white hover:bg-neon-purple/90"
          >
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/workout-library"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Workout Library
            </Link>
            <Link
              to="/programs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/store"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Store
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate({ to: '/creator-dashboard' });
                  setMobileMenuOpen(false);
                }}
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
              >
                Creator Dashboard
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                navigate({ to: isAuthenticated ? '/dashboard' : '/dashboard' });
                setMobileMenuOpen(false);
              }}
              className="bg-neon-purple text-white hover:bg-neon-purple/90"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
