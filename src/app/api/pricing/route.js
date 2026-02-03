import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    starter: process.env.PRICE_STARTER || 999,
    growth: process.env.PRICE_GROWTH || 2499,
    agency: process.env.PRICE_AGENCY || 6999,
  });
}