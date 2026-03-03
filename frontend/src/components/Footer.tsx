import { Link } from '@tanstack/react-router';
import { Heart, Dumbbell } from 'lucide-react';
import { SiInstagram, SiYoutube, SiFacebook } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'cerebral-physique');

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Dumbbell className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Cerebral Physique</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Science-informed training for mind and body transformation.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiInstagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiYoutube className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <SiFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About' },
                { to: '/workout-library', label: 'Workout Library' },
                { to: '/programs', label: 'Programs' },
                { to: '/nutrition', label: 'Nutrition' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              {[
                { to: '/store', label: 'Affiliate Store' },
                { to: '/dashboard', label: 'My Dashboard' },
                { to: '/domain-setup', label: 'Domain Setup' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Legal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              © {currentYear} Cerebral Physique LLC. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Content is for informational purposes only. Consult a healthcare professional before starting any fitness program.
            </p>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Cerebral Physique LLC
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
