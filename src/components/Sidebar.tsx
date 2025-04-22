import React from 'react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PenSquare,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const {  signOut, profile } = useAuth();
  console.log(profile)
  const { toast } = useToast();


  const [showAuthorForm, setShowAuthorForm] = React.useState(false);
  const [newAuthor, setNewAuthor] = React.useState({
    email: '',
    password: '',
    displayName: '',
  });

  const { signUp } = useAuth(); 

  const handleAuthorCreate = async () => {
    if (!newAuthor.email || !newAuthor.password || !newAuthor.displayName) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }

    try {
      await signUp(newAuthor.email, newAuthor.password, newAuthor.displayName);
      toast({ title: 'Author created', description: 'New author has been registered' });
      setShowAuthorForm(false);
      setNewAuthor({ email: '', password: '', displayName: '' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create author', variant: 'destructive' });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: PenSquare,
      label: 'Create Blog',
      href: '/blogs/create',
    },
  ];

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">Blog Admin</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors",
                  location.pathname === item.href && "bg-accent font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {location.pathname === '/dashboard' && (
        <div className="px-4 pb-4">
          {showAuthorForm ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Display Name"
                value={newAuthor.displayName}
                onChange={(e) => setNewAuthor({ ...newAuthor, displayName: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newAuthor.email}
                onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newAuthor.password}
                onChange={(e) => setNewAuthor({ ...newAuthor, password: e.target.value })}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAuthorCreate} className="flex-1">
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAuthorForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="default"
              className="w-full flex items-center gap-2"
              onClick={() => setShowAuthorForm(true)}
            >
              Create New Author
            </Button>
          )}
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{profile?.display_name}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
