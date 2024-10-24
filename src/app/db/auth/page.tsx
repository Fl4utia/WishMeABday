"use client";
import Link from "next/link"; 
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const SignIn = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        console.log({ result });
        sessionStorage.setItem('user', 'true');
        router.push('/cards');
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred during Google login");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-black">
      <section  className="slides relative w-full h-full overflow-hidden flex flex-col items-center justify-center flex-grow">
      <h1 className="text-center text-2xl font-bold  mt-12 slide__title">Get started</h1>
        
        {error && <p className="text-red-500 text-sm ">{error}</p>}

        {/* Google Sign-In Button */}
        <div className="center-screen border rounded-md">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center text-content border w-full text-black font-bold py-2 px-4 rounded-lg transition-all"
            >
              {/* Google Icon */}
              <Image
                src="/google.svg" 
                alt="Google Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </button>
        </div>

      </section>
    </main>
  );
};

export default SignIn;
