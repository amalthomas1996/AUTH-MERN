"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "../component/navBar";

// Define the User interface at the top of the file
interface User {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  dob: string;
  pan: string;
  bankAccount: string;
  gst: string;
  pincode: string;
}

const LandingPage = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [user, setUser] = useState<User | null>(null); // User | null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${phone}`
        );
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    if (phone) {
      fetchUser();
    } else {
      setError("No phone number provided");
      setLoading(false);
    }
  }, [phone]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-black-800">
            Welcome, {user?.name}!
          </h1>
          <div className="text-lg text-gray-700">
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {user?.phone}
            </p>

            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {user ? new Date(user.dob).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-5">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Verified Documents
          </h1>
          <div className="text-lg text-gray-700">
            <p>
              <span className="font-semibold">Aadhar:</span> {user?.aadhar}
            </p>
            <p>
              <span className="font-semibold">Pan:</span> {user?.pan}
            </p>
            <p>
              <span className="font-semibold">Bank Account No:</span>{" "}
              {user?.bankAccount}
            </p>
            <p>
              <span className="font-semibold">GSTIN:</span> {user?.gst}
            </p>
            <p>
              <span className="font-semibold">PIN Code:</span> {user?.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
