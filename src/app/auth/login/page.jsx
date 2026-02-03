"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react"; // Added Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Separate component for search params
function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error"); // Get error from URL if redirected

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // We handle the redirect manually to capture errors
    });

    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
      
      {/* Show Error Messages */}
      {(error || urlError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {error || "Authentication failed. Please try again."}
        </div>
      )}

      {/* Social Login Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="flex items-center justify-center gap-2 border p-2 rounded hover:bg-gray-50">
           <span className="font-semibold">Google</span>
        </button>
        <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="flex items-center justify-center gap-2 bg-gray-900 text-white p-2 rounded hover:bg-gray-800">
           <span className="font-semibold">GitHub</span>
        </button>
        <button onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })} className="flex items-center justify-center gap-2 border p-2 rounded hover:bg-gray-50">
           <span className="font-semibold">Microsoft</span>
        </button>
        <button onClick={() => signIn("apple", { callbackUrl: "/dashboard" })} className="flex items-center justify-center gap-2 bg-black text-white p-2 rounded hover:bg-gray-800">
           <span className="font-semibold">Apple</span>
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with email</span></div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          required
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-medium">
          Sign In
        </button>
      </form>

      <div className="text-center text-sm mt-4">
        Don't have an account? <Link href="/auth/register" className="text-blue-600 font-semibold">Sign up</Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

// "use client";
// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import Link from "next/link";

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
//         <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
        
//         {/* Social Buttons */}
//         <div className="flex flex-col gap-3 mb-6">
//           <button 
//             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="flex items-center justify-center gap-2 w-full border border-gray-300 p-3 rounded-md hover:bg-gray-50 transition-colors"
//           >
//             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
//             Continue with Google
//           </button>
//           <button 
//             onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
//             className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white p-3 rounded-md hover:bg-gray-800 transition-colors"
//           >
//             <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 invert" alt="GitHub" />
//             Continue with GitHub
//           </button>
//         </div>

//         <div className="relative mb-6">
//           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
//           <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with email</span></div>
//         </div>

//         {/* Existing Form Logic... */}
//         {/* (Keep your existing form inputs here) */}
//          <button onClick={() => signIn("credentials", { ...formData, callbackUrl: "/dashboard" })} className="w-full bg-blue-600 text-white p-3 rounded-md">
//             Sign In with Email
//          </button>

//          <div className="text-center text-sm mt-4">
//           Don't have an account? <Link href="/auth/register" className="text-blue-600">Sign up</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // NextAuth handles the logic here
//     const res = await signIn("credentials", {
//       email: formData.email,
//       password: formData.password,
//       redirect: false, // We handle redirect manually to check for errors first
//     });

//     if (res.error) {
//       setError("Invalid credentials");
//     } else {
//       router.push("/dashboard"); // Redirect to the main app area
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-lg">
//         <h2 className="text-center text-3xl font-bold text-gray-900">Welcome Back</h2>
//         {error && <div className="text-red-500 text-center text-sm">{error}</div>}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email address"
//             required
//             className="w-full border p-3 rounded-md"
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             required
//             className="w-full border p-3 rounded-md"
//             onChange={(e) => setFormData({...formData, password: e.target.value})}
//           />
//           <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
//             Sign In
//           </button>
//         </form>
//         <div className="text-center text-sm">
//           Don't have an account? <Link href="/auth/register" className="text-blue-600">Sign up</Link>
//         </div>
//       </div>
//     </div>
//   );
// }