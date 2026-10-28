
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";

import { sendPasswordResetEmail } from "firebase/auth"; 
import { auth } from "../firebase";   //connects to existing Firebase project
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");


const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await sendPasswordResetEmail(auth, email);

    toast.success("Password reset email sent. Please check your inbox.");
    setEmail("");
  } catch (error) {
    toast.error("Unable to send reset email. Please check the email address and try again.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex justify-center px-4 pt-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
          <h1 className="mb-2 text-2xl font-bold">
            Forgot Password?
          </h1>

          <p className="mb-6 text-sm text-gray-600">
            Enter your registered email address to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
            />

            <button
              type="submit"
              className="mt-5 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
