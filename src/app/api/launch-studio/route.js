import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 1. Get User Data
  const userEmail = session.user.email;
  const userPlan = session.user.plan || "starter";
  
  // 2. Create a "Signature" (HMAC)
  // This proves that YOU created this link, not a hacker.
  // We use the NEXTAUTH_SECRET because both apps should know a shared secret, 
  // or you can add a CHATBOT_SECRET to .env.local
  const secret = process.env.NEXTAUTH_SECRET; 
  const timestamp = Date.now();
  
  // Data to send
  const payload = JSON.stringify({
    email: userEmail,
    plan: userPlan,
    ts: timestamp
  });
  
  // Generate encoded token (Base64)
  const token = Buffer.from(payload).toString('base64');
  
  // Generate Signature
  const signature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");

  // 3. Redirect to the Chatbot Dashboard
  // The Chatbot will read ?token=...&sig=...
  const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL || "http://localhost:5000"; // Or your real URL
  
  const redirectUrl = `${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`;
  
  return NextResponse.redirect(redirectUrl);
}