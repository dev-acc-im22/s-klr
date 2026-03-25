'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Ghost, Menu, Moon, Sun, LayoutDashboard, Home } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useGhostMode } from '@/hooks/useGhostMode';
import { useHydrated } from '@/components/providers/HydrationProvider';

/**
 * Navigation links configuration
 */
const publicNavLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Demo Store' },
];

const dashboardNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/courses', label: 'Courses' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/analytics', label: 'Analytics' },
];

/**
 * Navbar Component
 * 
 * Only renders on public pages. Dashboard pages have their own sidebar navigation.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isGhostMode, toggleGhostMode, showToggle, mounted } = useGhostMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHydrated = useHydrated();

  // Handle scroll for sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render Navbar on dashboard routes - they have their own sidebar
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Use mounted to prevent hydration mismatch
  const navLinks = (mounted && isGhostMode) ? dashboardNavLinks : publicNavLinks;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isScrolled && 'shadow-md shadow-blue-500/5'
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={mounted && isGhostMode ? '/dashboard' : '/'}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Creator<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Ghost Mode Toggle */}
          {showToggle && (
            <Button
              variant={isGhostMode ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleGhostMode}
              className={cn(
                'transition-all duration-300',
                isGhostMode && 'bg-blue-500 hover:bg-blue-600'
              )}
              aria-label={`Ghost mode ${isGhostMode ? 'on' : 'off'}`}
              title={`Ghost Mode: ${isGhostMode ? 'ON - Click to exit' : 'OFF - Click to enter dashboard'}`}
            >
              <Ghost className={cn('h-5 w-5', isGhostMode && 'animate-pulse')} />
            </Button>
          )}

          {/* Conditional Buttons */}
          {mounted && isGhostMode ? (
            <Button variant="outline" asChild>
              <Link href="/demo">
                <Home className="mr-2 h-4 w-4" />
                View Store
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Ghost Mode Toggle (Mobile) */}
          {showToggle && (
            <Button
              variant={isGhostMode ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleGhostMode}
              className={cn(
                'transition-all duration-300',
                isGhostMode && 'bg-blue-500 hover:bg-blue-600'
              )}
            >
              <Ghost className={cn('h-5 w-5', isGhostMode && 'animate-pulse')} />
            </Button>
          )}

          {/* Mobile Menu Sheet - Only render after hydration to prevent ID mismatch */}
          {isHydrated ? (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">C</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                      Creator<span className="text-primary">Hub</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-2">
                  {/* Navigation Links */}
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start text-muted-foreground hover:text-foreground"
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}

                  <div className="my-4 h-px bg-border" />

                  {/* Ghost Mode Status */}
                  {showToggle && (
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-2">
                        <Ghost
                          className={cn(
                            'h-4 w-4',
                            isGhostMode ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                        <span className="text-sm font-medium">
                          Ghost Mode: {isGhostMode ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      {isGhostMode && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          ✅ Full dashboard access enabled
                        </p>
                      )}
                    </div>
                  )}

                  <div className="my-4 h-px bg-border" />

                  {/* Auth Buttons */}
                  {mounted && isGhostMode ? (
                    <SheetClose asChild>
                      <Button asChild className="mt-2">
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="mt-2">
                          <Link href="/signup">Sign Up Free</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            // Placeholder button before hydration
            <Button variant="ghost" size="icon" aria-label="Open menu" disabled>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
