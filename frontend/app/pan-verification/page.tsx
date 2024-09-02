"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";
import { useSearchParams } from "next/navigation";

const PanVerification = () => {
  const router = useRouter();
  //getting phone number from url
  const searchParams = useSearchParams();
  // const phone = searchParams.get("phone");
  const phone = searchParams.get("phone") || "";
  const [pan, setPan] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [verificationStatusColor, setVerificationStatusColor] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPan(e.target.value);
  };

  const validatePan = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan); // Validate PAN format
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePan(pan)) {
      setVerificationStatus(
        "PAN number must be exactly 10 characters (5 letters, 4 digits, 1 letter)."
      );
      setVerificationStatusColor("text-red-500");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/pan/pan-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pan, phone }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "PAN verified successfully") {
          setVerificationStatus("PAN Verified Successfully");
          setVerificationStatusColor("text-green-500");
          router.push(`/bank-verification?phone=${encodeURIComponent(phone)}`);
        } else {
          setVerificationStatus("PAN Verification Failed: " + data.message);
          setVerificationStatusColor("text-red-500");
        }
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
    } catch (error) {
      console.error(error);
      setVerificationStatus("Failed to verify PAN. Please try again.");
      setVerificationStatusColor("text-red-500");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-purple-500">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            PAN Verification
          </h2>

          <input
            type="text"
            name="pan"
            placeholder="PAN Number"
            className="w-full p-2 mb-4 border rounded"
            value={pan}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
            disabled={isSubmitting}
          >
            Verify PAN
          </button>

          {verificationStatus && (
            <p className={`mt-4 ${verificationStatusColor}`}>
              {verificationStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PanVerification;
