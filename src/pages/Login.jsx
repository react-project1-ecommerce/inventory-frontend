
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

import { FiEye, FiEyeOff } from "react-icons/fi";
import "../css/Login.css";
import { toast } from "react-toastify";

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      //This prevents an unverified user from staying signed in after login.

      if (!userCredential.user.emailVerified) {
          await auth.signOut();

          toast.error("Please verify your email before logging in.");
          return;
      }

      //true forces Firebase to refresh the ID token after the email verification check.
      
      await userCredential.user.getIdToken(true);
      navigate("/dashboard");

    } 
    catch (err) {
      console.error("Firebase login error:", err);
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>
            
            <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />

             <button
             type="button"
             onClick={() => setShowPassword((prev) => !prev)}
             className="eye-btn"
             aria-label={showPassword ? "Hide password" : "Show password"}
             >
            {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
           </div>
            
            <div className="mt-2 text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-blue-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
