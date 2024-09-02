"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../component/navBar";

interface User {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  dob: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  aadhar?: string;
  dob?: string;
  password?: string;
}

const Register = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    dob: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //validation
  const validate = (): Errors => {
    let errors: Errors = {};

    if (!user.name.trim()) {
      errors.name = "Name is required";
    }
    if (!user.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Email address is invalid";
    }
    if (!user.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(user.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!user.aadhar) {
      errors.aadhar = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(user.aadhar)) {
      errors.aadhar = "Aadhar number must be 12 digits";
    }
    if (!user.dob) {
      errors.dob = "Date of Birth is required";
    }
    if (!user.password) {
      errors.password = "Password is required";
    } else if (user.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(user.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(user.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(user.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
      errors.password = "Password must contain at least one special character";
    }
    return errors;
  };

  // Updated handleSubmit function in app/register/page
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(validate());
    setIsSubmitting(true);

    // Check if there are no validation errors before submitting
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Set a success alert
          setAlert({ message: data.message, type: "success" });
          router.push(`/otp-verification`);
        } else {
          // Set an error alert
          setAlert({ message: data.message, type: "error" });
        }
      } catch (error) {
        console.error(error);
        setAlert({
          message: "An error occurred. Please try again.",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      setAlert({ message: "Registration Successful!", type: "success" });
      setUser({
        name: "",
        email: "",
        phone: "",
        aadhar: "",
        dob: "",
        password: "",
      });
    }
  }, [errors]);

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-violet-500 to-purple-900 ">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg max-w-4xl p-6 md:p-0">
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center items-center p-6">
            <img
              src="/sign_up_image.svg"
              alt="Registration Illustration"
              className="rounded-lg"
            />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 flex flex-col justify-center p-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white  p-6 rounded shadow-md w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Let's get Started
              </h2>
              <h6 className="text-xm font-normal mb-6 text-center text-violet-800">
                Enter the details
              </h6>

              <input
                type="text"
                name="name"
                placeholder="Name"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.name ? "border-red-500" : ""
                }`}
                value={user.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mb-2">{errors.name}</p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-2">{errors.email}</p>
              )}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.phone ? "border-red-500" : ""
                }`}
                value={user.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
              )}

              <input
                type="text"
                name="aadhar"
                placeholder="Aadhar Number"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.aadhar ? "border-red-500" : ""
                }`}
                value={user.aadhar}
                onChange={handleChange}
              />
              {errors.aadhar && (
                <p className="text-red-500 text-sm mb-2">{errors.aadhar}</p>
              )}

              <input
                type="date"
                name="dob"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.dob ? "border-red-500" : ""
                }`}
                value={user.dob}
                onChange={handleChange}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mb-2">{errors.dob}</p>
              )}

              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full p-2 mb-4 border rounded ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
              >
                Register
              </button>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
