import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/lib/user-db";
import crypto from "crypto";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));

  // 1. Get Full User Record
  const user = await getUserByEmail(session.user.email);
  
  // 2. Expiration Check
  const now = new Date();
  const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const planId = user.plan || "none";

  if (planId === "none" || (expiresAt && expiresAt < now)) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  // 3. Create Payload with IDs
  const payload = JSON.stringify({
    userId: user.userId, // Stable UUID
    planId: planId,      // Plan ID from DB (e.g. "growth" or "p_123")
    email: user.email,
    ts: Date.now()
  });
  
  // 4. Sign & Redirect
  const secret = process.env.NEXTAUTH_SECRET;
  const token = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac("sha256", secret).update(token).digest("hex");

  const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL; 
  return NextResponse.redirect(`${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`);
}


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getUserByEmail } from "@/lib/user-db"; // We need to check DB for expiration
// import crypto from "crypto";

// export async function GET(req) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // 1. Fetch fresh user data (to check expiration)
//   const user = await getUserByEmail(session.user.email);
//   const userPlan = user?.plan || "none";
//   const expiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;
//   const now = new Date();

//   // 2. CHECK: Is plan 'none' or 'expired'?
//   if (userPlan === "none" || (expiresAt && expiresAt < now)) {
//     // Redirect to Pricing Page
//     return NextResponse.redirect(new URL("/pricing", req.url));
//   }

//   // 3. Create Signed Token
//   const secret = process.env.NEXTAUTH_SECRET; 
//   const timestamp = Date.now();
  
//   const payload = JSON.stringify({
//     userId: user.userId,
//     email: user.email,
//     plan: userPlan,
//     ts: timestamp
//   });
  
//   const token = Buffer.from(payload).toString('base64');
//   const signature = crypto.createHmac("sha256", secret).update(token).digest("hex");

//   const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL || "http://localhost:5000"; 
//   const redirectUrl = `${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`;
  
//   return NextResponse.redirect(redirectUrl);
// }