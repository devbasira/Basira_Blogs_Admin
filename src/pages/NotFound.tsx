import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl mb-8">
          The page <span className="font-mono bg-secondary px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
