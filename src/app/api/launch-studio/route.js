import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/lib/user-db"; // We need to check DB for expiration
import crypto from "crypto";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 1. Fetch fresh user data (to check expiration)
  const user = await getUserByEmail(session.user.email);
  const userPlan = user?.plan || "none";
  const expiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const now = new Date();

  // 2. CHECK: Is plan 'none' or 'expired'?
  if (userPlan === "none" || (expiresAt && expiresAt < now)) {
    // Redirect to Pricing Page
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  // 3. Create Signed Token
  const secret = process.env.NEXTAUTH_SECRET; 
  const timestamp = Date.now();
  
  const payload = JSON.stringify({
    userId: user.userId,
    email: user.email,
    plan: userPlan,
    ts: timestamp
  });
  
  const token = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac("sha256", secret).update(token).digest("hex");

  const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL || "http://localhost:5000"; 
  const redirectUrl = `${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`;
  
  return NextResponse.redirect(redirectUrl);
}


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import crypto from "crypto";

// export async function GET(req) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // 1. Get User Data
//   const userEmail = session.user.email;
//   const userPlan = session.user.plan || "starter";
  
//   // 2. Create a "Signature" (HMAC)
//   // This proves that YOU created this link, not a hacker.
//   // We use the NEXTAUTH_SECRET because both apps should know a shared secret, 
//   // or you can add a CHATBOT_SECRET to .env.local
//   const secret = process.env.NEXTAUTH_SECRET; 
//   const timestamp = Date.now();
  
//   // Data to send
//   const payload = JSON.stringify({
//     email: userEmail,
//     plan: userPlan,
//     ts: timestamp
//   });
  
//   // Generate encoded token (Base64)
//   const token = Buffer.from(payload).toString('base64');
  
//   // Generate Signature
//   const signature = crypto
//     .createHmac("sha256", secret)
//     .update(token)
//     .digest("hex");

//   // 3. Redirect to the Chatbot Dashboard
//   // The Chatbot will read ?token=...&sig=...
//   const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL || "http://localhost:5000"; // Or your real URL
  
//   const redirectUrl = `${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`;
  
//   return NextResponse.redirect(redirectUrl);
// }