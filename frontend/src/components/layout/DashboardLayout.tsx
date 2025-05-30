import { useState, ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Heart, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
};

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole: 'patient' | 'doctor';
}

const DashboardLayout = ({ children, navItems, userRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès."
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Mobile header */}
      <header className="bg-background border-b sticky top-0 z-30 md:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to={`/dashboard/${userRole}`} className="flex items-center">
            <Heart className="h-6 w-6 text-primary" />
            <span className="ml-2 font-bold text-lg">MediRDV</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header - Only on desktop */}
          <div className="h-16 px-4 border-b hidden md:flex items-center">
            <Link to={`/dashboard/${userRole}`} className="flex items-center">
              <Heart className="h-6 w-6 text-primary" />
              <span className="ml-2 font-bold text-lg">MediRDV</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userRole === 'doctor' ? 'Médecin' : 'Patient'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;