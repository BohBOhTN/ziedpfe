import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  Heart, 
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        {
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm': isScrolled || !isLandingPage,
          'bg-transparent': !isScrolled && isLandingPage,
        }
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MediRDV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'} 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Tableau de bord
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Menu utilisateur</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}>
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Connexion
              </Link>
              <Link to="/signup">
                <Button>S'inscrire</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-9 w-9 rounded-md"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col space-y-1 py-3 px-2 border-b">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Link 
                  to={user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'} 
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  Tableau de bord
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start p-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/signup" 
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;