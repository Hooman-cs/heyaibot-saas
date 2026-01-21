"use client";
import Link from "next/link";

export default function DashboardHome() {
  // Mock data for now (We will fetch real bots from DB later)
  const bots = []; 

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
          <div className="mt-6">
            <Link 
              href="/dashboard/create-bot"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Create one now &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* We will map bots here later */}
        </div>
      )}
    </div>
  );
}