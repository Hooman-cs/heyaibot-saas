import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getUserSubscription } from "@/lib/subscription-db";
import crypto from "crypto";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));

  // 1. Get Subscription (Checks expiration internally)
  const sub = await getUserSubscription(session.user.id);

  // 2. Check Validity
  if (!sub || sub.status !== 'active') {
    // Redirect to pricing if no active sub
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  // 3. Create Payload
  const payload = JSON.stringify({
    userId: session.user.id,
    userEmail: session.user.email,
    isSuperAdmin: session.user.isSuperAdmin,
    planId: sub.plan_id,
    subscriptionId: sub.payment_id, // Chatbot uses this to fetch snapshot limits
    ts: Date.now()
  });
  
  // 4. Sign & Redirect
  const secret = process.env.NEXTAUTH_SECRET;
  const token = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac("sha256", secret).update(token).digest("hex");

  // const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://dashboard.heyaibot.com";
  //return NextResponse.redirect(`${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`);

  //const chatbotUrl = "https://webhook.site/b7b99614-253f-44f7-bf13-51d1b35f9f97";

  // Temporarily hardcode this to ensure it stays local
const chatbotUrl = "http://localhost:3000"; 
return NextResponse.redirect(`${chatbotUrl}/api/debug?token=${token}&sig=${signature}`);
}



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getUserByEmail } from "@/lib/user-db";
// import crypto from "crypto";

// export async function GET(req) {
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.redirect(new URL("/auth/login", req.url));

//   // 1. Get Full User Record
//   const user = await getUserByEmail(session.user.email);
  
//   // 2. Expiration Check
//   const now = new Date();
//   const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
//   const planId = user.plan || "none";

//   if (planId === "none" || (expiresAt && expiresAt < now)) {
//     return NextResponse.redirect(new URL("/pricing", req.url));
//   }

//   // 3. Create Payload with IDs
//   const payload = JSON.stringify({
//     userId: user.userId, // Stable UUID
//     planId: planId,      // Plan ID from DB (e.g. "growth" or "p_123")
//     email: user.email,
//     ts: Date.now()
//   });
  
//   // 4. Sign & Redirect
//   const secret = process.env.NEXTAUTH_SECRET;
//   const token = Buffer.from(payload).toString('base64');
//   const signature = crypto.createHmac("sha256", secret).update(token).digest("hex");

//   const chatbotUrl = process.env.CHATBOT_DASHBOARD_URL; 
//   return NextResponse.redirect(`${chatbotUrl}/auth/sso?token=${token}&sig=${signature}`);
// }