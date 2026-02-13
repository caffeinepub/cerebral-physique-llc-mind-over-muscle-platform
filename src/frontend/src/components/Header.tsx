import { Link } from '@tanstack/react-router';
import { Menu, X, Volume2, VolumeX, LayoutDashboard, User, Globe } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, toggle } = useMusicPlayer();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Workout Library', path: '/workout-library' },
    { label: 'Programs', path: '/programs' },
    { label: 'Blog', path: '/blog' },
    { label: 'Cerebral shop', path: '/store' },
    { label: 'Contact', path: '/contact' },
    { label: 'Domain Setup', path: '/domain-setup' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Perfectly Centered Logo and Brand Text */}
          <div className="flex items-center justify-center border-b border-border/20 py-6">
            <Link to="/" className="flex flex-col items-center gap-3">
              <img
                src="/assets/file_00000000f71471f5a1db16ce8a907948(1).png"
                alt="Cerebral Physique LLC logo"
                className="h-32 w-32 object-contain"
              />
              <span className="bg-gradient-to-r from-neon-purple via-deep-blue to-neon-purple bg-clip-text text-center text-2xl font-bold tracking-[0.2em] text-transparent">
                CEREBRAL PHYSIQUE, LLC
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation - centered below logo */}
          <div className="flex items-center justify-center gap-1 py-4">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  activeProps={{
                    className: 'bg-accent text-foreground',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Creator Dashboard Link - Always visible to admins */}
              {!isAdminLoading && isAdmin && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/creator-dashboard"
                        className="group rounded-md px-4 py-2 text-sm font-medium text-neon-purple transition-all hover:bg-accent hover:text-neon-purple hover:shadow-lg hover:shadow-neon-purple/20"
                        activeProps={{
                          className: 'bg-accent text-neon-purple shadow-lg shadow-neon-purple/20',
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110" />
                          Creator Dashboard
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      className="max-w-xs border-neon-purple/30 bg-card/95 backdrop-blur"
                      sideOffset={8}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-neon-purple">Creator Dashboard</p>
                        <p className="text-xs text-muted-foreground">
                          Manage exercises, blog posts, products, and memberships
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* User Dashboard / Login */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  activeProps={{
                    className: 'bg-accent text-foreground',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={loginStatus === 'logging-in'}
                  className="text-sm font-medium"
                >
                  {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
            
            {/* Music Toggle - positioned to the right */}
            <div className="ml-4 border-l border-border/40 pl-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? (
                  <Volume2 className="h-5 w-5 text-neon-purple" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex h-16 items-center justify-between md:hidden">
          {/* Logo - left-aligned on mobile */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/file_00000000f71471f5a1db16ce8a907948(1).png"
              alt="Cerebral Physique LLC logo"
              className="h-12 w-12 object-contain"
            />
            <span className="bg-gradient-to-r from-neon-purple to-deep-blue bg-clip-text text-sm font-bold tracking-wider text-transparent">
              CEREBRAL PHYSIQUE, LLC
            </span>
          </Link>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? (
                <Volume2 className="h-5 w-5 text-neon-purple" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{
                  className: 'bg-accent text-foreground',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Creator Dashboard Link - Mobile */}
            {!isAdminLoading && isAdmin && (
              <Link
                to="/creator-dashboard"
                className="block rounded-md bg-neon-purple/10 px-3 py-2 text-base font-medium text-neon-purple transition-colors hover:bg-neon-purple/20"
                activeProps={{
                  className: 'bg-neon-purple/20 text-neon-purple',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Creator Dashboard
                </span>
              </Link>
            )}

            {/* User Dashboard / Login - Mobile */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{
                  className: 'bg-accent text-foreground',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                disabled={loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
