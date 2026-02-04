import { NextResponse } from "next/server";
import { getAllPlans, createPlan, deletePlan } from "@/lib/plan-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Middleware check for Admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET() {
  // Publicly accessible for Pricing Page
  const plans = await getAllPlans();
  return NextResponse.json(plans);
}

export async function POST(req) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  
  const body = await req.json();
  await createPlan(body);
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  
  const { id } = await req.json();
  await deletePlan(id);
  return NextResponse.json({ success: true });
}