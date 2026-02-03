import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserBots } from "@/lib/bot-db";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const bots = session ? await getUserBots(session.user.id) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Chatbots</h2>
        <Link 
          href="/dashboard/create-bot" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          + Create New Bot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">No chatbots yet</h3>
          <p className="mt-1 text-gray-500">Create your first AI assistant to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900">{bot.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${bot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {bot.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>Plan: <span className="font-medium capitalize">{bot.planType}</span></p>
                <p>Created: {new Date(bot.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all mb-4">
                 &lt;script src="..." data-api-key="{bot.apiKey}"&gt;&lt;/script&gt;
              </div>

              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm">
                Copy Embed Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




// "use client";
// import Link from "next/link";

// export default function DashboardHome() {
//   // Mock data for now (We will fetch real bots from DB later)
//   const bots = []; 

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-800">My Chatbots</h2>
//         <Link 
//           href="/dashboard/create-bot" 
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
//         >
//           + Create New Bot
//         </Link>
//       </div>

//       {bots.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
//           <h3 className="text-lg font-medium text-gray-900">No chatbots yet</h3>
//           <p className="mt-1 text-gray-500">Create your first AI assistant to get started.</p>
//           <div className="mt-6">
//             <Link 
//               href="/dashboard/create-bot"
//               className="text-blue-600 hover:text-blue-500 font-medium"
//             >
//               Create one now &rarr;
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* We will map bots here later */}
//         </div>
//       )}
//     </div>
//   );
// }