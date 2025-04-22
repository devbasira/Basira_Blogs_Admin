
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return null; // or a loading state
  }

  return (
    <div className="flex overflow-y-hidden h-screen bg-background">
      <Sidebar />
      <main className="flex-1  p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
