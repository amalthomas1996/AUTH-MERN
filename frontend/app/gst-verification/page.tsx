"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import NavBar from "../component/navBar";

const GSTVerification = () => {
  //getting phone number from url
  const searchParams = useSearchParams();
  // const phone = searchParams.get("phone");
  const phone = searchParams.get("phone") || "";
  const [gstin, setGstin] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ gstin?: string }>({});
  const router = useRouter();

  // Validation function
  const validate = () => {
    const newErrors: { gstin?: string } = {};

    if (!gstin) {
      newErrors.gstin = "GSTIN is required.";
    } else if (!/^[0-9A-Z]{15}$/.test(gstin)) {
      newErrors.gstin = "Invalid GSTIN format. Must be 15 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/gst/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gstin, phone }),
      });

      const data = await response.json();

      if (data !== null) {
        setMessage("GSTIN verified successfully!");
        setTimeout(() => {
          router.push(`/landing-page?phone=${encodeURIComponent(phone)}`);
        }, 2000);
      } else {
        setMessage("GSTIN not found or invalid.");
      }
    } catch (error) {
      setMessage("An error occurred during verification. Please try again.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            GSTIN Verification
          </h1>
          <div className="mb-6">
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="Enter GSTIN"
              className={`w-full p-3 border rounded-lg shadow-sm ${
                errors.gstin ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.gstin && (
              <p className="text-red-500 text-sm mt-1">{errors.gstin}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Verify
          </button>
          {message && (
            <p
              className={`mt-6 text-lg font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default GSTVerification;
