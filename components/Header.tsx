import React from 'react';
import { SparkleIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary sticky top-0 z-40 shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between max-w-2xl">
        <div className="flex items-center">
            <SparkleIcon />
            <h1 className="text-xl font-bold ml-2 text-light">Universal Saver</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
