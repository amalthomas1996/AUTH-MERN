"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";
import { useSearchParams } from "next/navigation";

const AadhaarVerification = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAadhaar(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/aadhaar/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhaar, phone }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setVerificationStatus("Aadhaar verified successfully");
        router.push(`/pan-verification?phone=${encodeURIComponent(phone)}`);
      } else {
        setVerificationStatus(data.message || "Aadhaar verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("An error occurred during verification");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-purple-500">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Aadhaar Verification
          </h2>

          <input
            type="text"
            name="aadhaar"
            placeholder="Enter Aadhaar Number"
            className="w-full p-2 mb-4 border rounded"
            value={aadhaar}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
          >
            Verify
          </button>

          {verificationStatus && (
            <div
              className={` p-4 ${
                verificationStatus.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {verificationStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AadhaarVerification;
