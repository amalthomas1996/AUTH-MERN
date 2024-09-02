"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";

const Welcome = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register"); // Redirect to the registration page
  };

  return (
    <div className="all_container">
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-neutral-200">
        <div className="text-center">
          <Image
            src="/welcome-image.svg"
            alt="Welcome"
            width={500}
            height={500}
            className="mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hi There,</h1>
          <h2 className="text-3xl font-semibold text-gray-600">
            Welcome to MERN Authentication
          </h2>
          <button
            onClick={handleGetStarted}
            className="mt-8 px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
