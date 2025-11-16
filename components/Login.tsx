import React from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithRedirect } from 'firebase/auth';
import { SparkleIcon } from './icons';

const Login: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      // Use signInWithRedirect as it's more robust in sandboxed environments (like iframes)
      // where pop-ups can be blocked.
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-4">
          <SparkleIcon />
          <h1 className="text-3xl font-bold ml-2 text-light">Universal Saver</h1>
        </div>
        <p className="text-medium mb-8">
          Your personal cloud archive. Save links, reels, and content from anywhere, synced across all your devices.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center w-full max-w-xs mx-auto"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;