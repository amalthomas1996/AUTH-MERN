"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import NavBar from "../component/navBar";

const BankVerification = () => {
  //getting phone number from url
  const searchParams = useSearchParams();
  // const phone = searchParams.get("phone");
  const phone = searchParams.get("phone") || "";
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<{
    accountNumber?: string;
    ifsc?: string;
  }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: { accountNumber?: string; ifsc?: string } = {};

    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required.";
    } else if (!/^\d{9,18}$/.test(accountNumber)) {
      newErrors.accountNumber =
        "Invalid account number. Must be between 9 and 18 digits.";
    }

    if (!ifsc) {
      newErrors.ifsc = "IFSC code is required.";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      newErrors.ifsc =
        "Invalid IFSC code. It should be in the format: XXXX0YYYYYY.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Step 1: Initiate the verification
      const initiateResponse = await axios.post(
        "http://localhost:5000/api/bank/initiate",
        {
          accountNumber,
          ifsc,
        }
      );
      const requestId = initiateResponse.data.requestId;

      // Step 2: Check the status of the verification
      const checkStatus = async () => {
        try {
          const statusResponse = await axios.get(
            "http://localhost:5000/api/bank/status",
            {
              params: { requestId, phone, accountNumber },
            }
          );
          setMessage(statusResponse.data.message);
          setVerified(statusResponse.data.verified);

          if (statusResponse.data.verified) {
            setTimeout(() => {
              router.push(
                `/gst-verification?phone=${encodeURIComponent(phone)}`
              );
            }, 2000);
          }
        } catch (error) {
          setMessage(
            "An error occurred during status check. Please try again."
          );
        }
      };

      // Polling mechanism to check status periodically
      const intervalId = setInterval(async () => {
        await checkStatus();
      }, 3000); // check every 3 seconds

      // Stop polling after 30 seconds if verification not completed
      setTimeout(() => clearInterval(intervalId), 30000);
    } catch (error) {
      console.error(error);
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
            Bank Account Verification
          </h1>
          <div className="mb-4">
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              className={`w-full p-3 border rounded-lg shadow-sm ${
                errors.accountNumber ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber}
              </p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="Enter IFSC Code"
              className={`w-full p-3 border rounded-lg shadow-sm ${
                errors.ifsc ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.ifsc && (
              <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>
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
                verified ? "text-green-600" : "text-red-600"
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

export default BankVerification;
