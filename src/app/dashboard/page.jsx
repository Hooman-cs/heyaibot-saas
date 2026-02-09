"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  
  // Check role
  const isAdmin = session?.user?.isSuperAdmin === true;

  // Determine where the button takes them
  // 1. Admins go to their special dashboard URL (Add this to .env.local)
  // 2. Users go to the SSO Launch API
  const launchUrl = isAdmin 
    ? (process.env.NEXT_PUBLIC_CHATBOT_ADMIN_URL || "https://dashboard.heyaibot.com/admin") // Fallback
    : "/api/launch-studio";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header with Sign Out */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-gray-600">
            {isAdmin ? "Admin Dashboard" : "Manage your subscription and access your chatbot studio."}
          </p>
          {isAdmin && (
            <span className="inline-block mt-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold uppercase">
              Admin Access
            </span>
          )}
        </div>
        
        {/* RE-ADDED: Sign Out Button */}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
        >
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Plan Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Plan</h2>
          <div className="text-3xl font-bold text-blue-600 capitalize mb-4">
            {session?.user?.planName || "None"}
          </div>
          <p className="text-gray-500 mb-6 text-sm">
            {session?.user?.plan === 'none' 
              ? "You do not have an active subscription." 
              : "Your plan is currently active."}
          </p>
          
          {/* RE-ADDED: Upgrade Link */}
          <Link href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
            {session?.user?.plan === 'none' ? "Subscribe Now" : "Upgrade Plan"} &rarr;
          </Link>
        </div>

        {/* Card 2: Studio Launch (Different for Admin vs User) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${isAdmin ? 'bg-purple-50' : 'bg-blue-50'}`}>
            <span className="text-4xl">{isAdmin ? "⚙️" : "🤖"}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isAdmin ? "Chatbot Admin Panel" : "Chatbot Studio"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {isAdmin 
              ? "Access the master control panel." 
              : "Configure your bots, upload knowledge, and view chat logs."}
          </p>
          
          <a 
            href={launchUrl} 
            target={isAdmin ? "_self" : "_blank"} // Admins might want same tab, users new tab
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-white ${
              isAdmin 
                ? 'bg-purple-700 hover:bg-purple-800' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isAdmin ? "Launch Admin Dashboard" : "Launch Studio"} &rarr;
          </a>
        </div>

        {/* Card 3: Admin Controls (Only visible to Admin) */}
        {isAdmin && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">SaaS Management</h2>
            <div className="space-y-3">
              <Link href="/dashboard/admin/plans" className="block w-full text-left bg-white p-3 rounded shadow-sm hover:shadow transition text-gray-700 font-medium">
                📝 Manage Plans
              </Link>
              <Link href="/dashboard/admin/payments" className="block w-full text-left bg-white p-3 rounded shadow-sm hover:shadow transition text-gray-700 font-medium">
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