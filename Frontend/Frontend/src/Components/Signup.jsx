import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const create = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess("✅ Registration successful! Redirecting...");
      reset(); 
      setTimeout(() => {
        navigate("/login", { state: { message: "Registration successful! Please log in." } });
      }, 2000);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl p-8 bg-gray-900 shadow-lg rounded-xl border border-gray-700">
        <h2 className="text-center text-2xl font-semibold text-white">Create a New Account</h2>
        <p className="text-center text-gray-400 mt-1 mb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>

        {error && <p className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit(create)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register("FullName", { required: true })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email must be valid",
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
