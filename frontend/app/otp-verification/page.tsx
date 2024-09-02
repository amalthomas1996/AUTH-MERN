"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";
const PhoneOtpVerification = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneOtp, setPhoneOtp] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [resendAllowed, setResendAllowed] = useState<boolean>(false);
  const [phoneDisabled, setPhoneDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendAllowed(true);
      setPhoneDisabled(false);
    }
  }, [timer, otpSent]);

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handlePhoneOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setPhoneDisabled(true); // Disable phone input when sending OTP
    try {
      const response = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ message: data.message, type: "success" });
        setOtpSent(true);
        setTimer(30);
        setResendAllowed(false);
      } else {
        setAlert({ message: data.message, type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        message: "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, otp: phoneOtp }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ message: data.message, type: "success" });

        router.push(
          `/email-verification?phone=${encodeURIComponent(phoneNumber)}`
        );
      } else {
        setAlert({ message: data.message, type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        message: "Failed to verify OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Phone Number Verification
          </h2>
          <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
            <div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full p-2 mb-4 border rounded"
                disabled={phoneDisabled} // Disable input based on state
              />
            </div>
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isSubmitting}
              >
                Send OTP
              </button>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!resendAllowed || isSubmitting}
                >
                  {resendAllowed ? "Resend OTP" : `Resend in ${timer}s`}
                </button>
              </div>
            )}
            {otpSent && (
              <div>
                <input
                  type="text"
                  name="phoneOtp"
                  placeholder="Enter Phone OTP"
                  value={phoneOtp}
                  onChange={handlePhoneOtpChange}
                  className="w-full p-2 mb-4 border rounded"
                />
              </div>
            )}
            {otpSent && (
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                Verify OTP
              </button>
            )}
          </form>
          {alert.message && (
            <div
              className={`fixed top-20 right-4 p-4 rounded shadow-lg text-white ${
                alert.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {alert.message}
              <button
                className="ml-4 text-white top-20"
                onClick={() => setAlert({ message: "", type: null })}
              >
                ✖
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneOtpVerification;
