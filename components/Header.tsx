import React from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { SparkleIcon } from './icons';

interface HeaderProps {
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-secondary sticky top-0 z-40 shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between max-w-2xl">
        <div className="flex items-center">
            <SparkleIcon />
            <h1 className="text-xl font-bold ml-2 text-light">Universal Saver</h1>
        </div>
        {user && (
            <div className="flex items-center">
                <span className="text-sm text-medium mr-4 hidden sm:block">{user.displayName || user.email}</span>
                <button 
                    onClick={handleSignOut}
                    className="bg-gray-700 text-light text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-gray-600 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;