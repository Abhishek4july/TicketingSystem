import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()

const login = async (data) => {
  setError("");
  setLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
      data,
      { withCredentials: true }
    );

    console.log("Login Response:", response);

    const user = response.data?.data?.user;

    if (!user) {
      setError("User data not found in response");
      return;
    }
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("auth", "true");


    dispatch(loginUser({
      user,
      isAdmin: user.role === "admin"
    }));

    if (user.role === "admin") {
      navigate("/admin/tickets");
    } else {
      navigate("/user/dashboard");
    }
    
  } catch (err) {
    console.error("Login Error:", err.response);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-700 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-white mb-4">Sign in to your account</h2>
        <p className="text-center text-gray-400 mb-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-medium">
            Sign Up
          </Link>
        </p>

        {error && <p className="bg-red-100 text-red-700 p-3 mb-6 rounded-xl text-center text-sm font-medium">{error}</p>}

        <form onSubmit={handleSubmit(login)} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 md:text-black sm:bg-black sm:text-white text-white py-3 rounded-xl hover:bg-blue-700 transition ease-in-out duration-200"
            >
              {loading ? (
                <span>Signing in...</span> 
              ) : (
                <span>Sign in</span> 
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
