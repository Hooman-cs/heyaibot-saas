import { NextResponse } from "next/server";
import { getAllSubscriptions } from "@/lib/subscription-db"; // <--- Changed from getAllPayments
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.isSuperAdmin !== true) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const payments = await getAllSubscriptions();
  return NextResponse.json(payments);
}





// import { NextResponse } from "next/server";
// import { getAllPayments } from "@/lib/subscription-db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

//   const payments = await getAllPayments();
//   return NextResponse.json(payments);
// }