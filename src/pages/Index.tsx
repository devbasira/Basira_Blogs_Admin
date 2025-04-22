import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Blog Admin Panel</h1>
        <p className="text-xl mb-8">
          Manage your blog content across multiple web applications with our streamlined admin interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/login">Login to Admin</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
