import { Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/generated/cerebral-physique-logo.dim_200x200.png"
                alt="Cerebral Physique"
                className="h-10 w-10"
              />
              <span className="text-lg font-bold text-neon-purple">
                Cerebral Physique
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Elevate your training through the mind-muscle connection, disciplined breathwork, and longevity-focused movement.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  About
                </Link>
              </li>
              <li>
                <Link to="/workout-library" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  Workout Library
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/domain-setup" className="text-muted-foreground transition-colors hover:text-neon-purple">
                  Custom Domain Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-neon-purple"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-neon-purple"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-neon-purple"
                aria-label="YouTube"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-neon-purple"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear}. Built with <Heart className="inline h-4 w-4 text-neon-purple" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-purple transition-colors hover:text-neon-purple/80"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
