"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. Protect the route: Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // 2. The Dashboard UI Structure
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl text-blue-600">HeyAiBot</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium">
            🤖 My Chatbots
          </Link>
          <Link href="/dashboard/leads" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium">
            📥 Leads Captured
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium">
            ⚙️ Account
          </Link>
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <div className="mb-2 text-sm text-gray-600 font-semibold">
            {session?.user?.name}
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left text-sm text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}