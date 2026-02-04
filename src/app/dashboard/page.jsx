"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
        {isAdmin && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-bold">ADMIN MODE</span>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 1. Plan Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-2">Your Plan</h2>
          <div className="text-3xl font-bold text-blue-600 capitalize">{session?.user?.plan || "None"}</div>
        </div>

        {/* 2. Studio Launch (Dynamic based on Role) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-2">🤖</div>
          <h2 className="text-lg font-semibold">Chatbot Studio</h2>
          <a 
            href="/api/launch-studio" 
            target="_blank"
            className={`mt-4 w-full py-2 px-4 rounded text-white font-medium ${isAdmin ? 'bg-purple-700 hover:bg-purple-600' : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            {isAdmin ? "Launch Admin Studio" : "Launch Studio"}
          </a>
        </div>

        {/* 3. ADMIN ONLY: Manage Plans */}
        {isAdmin && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900">Admin Controls</h2>
            <div className="mt-4 space-y-2">
              <Link href="/dashboard/admin/plans" className="block w-full text-left p-2 hover:bg-white rounded transition">
                📝 Manage Plans
              </Link>
              <Link href="/dashboard/admin/payments" className="block w-full text-left p-2 hover:bg-white rounded transition">
                💰 View Payment History
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// "use client";
// import { useSession, signOut } from "next-auth/react";

// export default function Dashboard() {
//   const { data: session } = useSession();

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {session?.user?.name}</h1>
//       <p className="text-gray-600 mb-8">Manage your subscription and access your chatbot studio.</p> */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}</h1>
//           <p className="text-gray-600">Manage your subscription and access your chatbot studio.</p>
//         </div>
//         <button 
//           onClick={() => signOut({ callbackUrl: '/' })}
//           className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50"
//         >
//           Sign Out
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Card 1: Current Plan */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Plan</h2>
//           <div className="text-3xl font-bold text-blue-600 capitalize mb-4">
//             {session?.user?.plan || "starter"}
//           </div>
//           <p className="text-gray-500 mb-6">
//             You are currently on the {session?.user?.plan || "starter"} tier.
//           </p>
//           <a href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
//             Upgrade Plan &rarr;
//           </a>
//         </div>

//         {/* Card 2: Launch Studio */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
//           <div className="bg-blue-50 p-4 rounded-full mb-4">
//             <span className="text-4xl">🤖</span>
//           </div>
//           <h2 className="text-lg font-semibold text-gray-900">Chatbot Studio</h2>
//           <p className="text-gray-500 mb-6 text-sm">
//             Configure your bots, upload knowledge, and view chat logs.
//           </p>
//           {/* Replace this URL with your actual Chatbot App URL */}
//           {/* <a 
//             href="https://dashboard.heyaibot.com" 
//             target="_blank" 
//             className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all"
//           >
//             Launch Studio &rarr;
//           </a> */}
//           <a 
//             href="/api/launch-studio" 
//             target="_blank" 
//             className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all"
//           >
//             Launch Studio &rarr;
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }