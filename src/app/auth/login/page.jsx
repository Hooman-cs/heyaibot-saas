"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // NextAuth handles the logic here
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // We handle redirect manually to check for errors first
    });

    if (res.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard"); // Redirect to the main app area
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Welcome Back</h2>
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            required
            className="w-full border p-3 rounded-md"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-3 rounded-md"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <div className="text-center text-sm">
          Don't have an account? <Link href="/auth/register" className="text-blue-600">Sign up</Link>
        </div>
      </div>
    </div>
  );
}