"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";
import { useSearchParams } from "next/navigation";

const AddressLookup = () => {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [pincode, setPincode] = useState<string>("");
  const [address, setAddress] = useState<{
    city: string;
    district: string;
    state: string;
    postalDetails: string;
  }>({
    city: "",
    district: "",
    state: "",
    postalDetails: "",
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (pincode.length === 6) {
      handlePincodeLookup();
    }
  }, [pincode]);

  const handlePincodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  };

  const handlePincodeLookup = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/address/pincode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, pincode }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddress({
          city: data.city,
          district: data.district,
          state: data.state,
          postalDetails: data.postalDetails,
        });
        setAlert({
          message: "Address details fetched successfully",
          type: "success",
        });
      } else {
        setAlert({ message: "Failed to fetch address details", type: "error" });
        setAddress({ city: "", district: "", state: "", postalDetails: "" });
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      setAlert({
        message: "An error occurred while fetching the address details",
        type: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleProceedToKYC = () => {
    router.push(`/aadhar-verification?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center font-mono">
            Let's Find Where You Are
          </h2>
          <h5 className="mb-6 text-center">
            Please enter your postal PIN code
          </h5>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={handlePincodeChange}
                className="w-full p-2 mb-4 border rounded"
                maxLength={6}
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={address.city}
                readOnly
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={address.district}
                readOnly
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={address.state}
                readOnly
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="postalDetails"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Details
              </label>
              <textarea
                id="postalDetails"
                name="postalDetails"
                value={address.postalDetails}
                readOnly
                className="w-full p-2 mb-4 border rounded bg-gray-100"
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleProceedToKYC}
              >
                Proceed To KYC Verification
              </button>
            </div>
          </div>
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

export default AddressLookup;
