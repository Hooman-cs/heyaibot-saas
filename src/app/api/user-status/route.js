import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/user-db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.CHATBOT_ADMIN_KEY) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json({ plan: "none", exists: false });
  }

  // Check Expiration
  const now = new Date();
  const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
  
  if (user.plan !== "none" && expiresAt && expiresAt < now) {
    // Plan Expired! Tell chatbot they are on "none"
    return NextResponse.json({ 
      plan: "none", 
      credits: 0, 
      expired: true,
      exists: true 
    });
  }

  return NextResponse.json({ 
    plan: user.plan, 
    credits: user.credits, 
    exists: true 
  });
}





// import { NextResponse } from "next/server";
// import { getUserByEmail } from "@/lib/user-db";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const email = searchParams.get("email");
//   // Security: Check a secret key (add CHATBOT_ADMIN_KEY to .env.local later)
//   const apiKey = request.headers.get("x-api-key");
  
//   // Optional security check
//   // if (apiKey !== process.env.CHATBOT_ADMIN_KEY) return NextResponse.json({error:"Unauthorized"}, {status:401});

//   // if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
// // Simple security check (Add this key to .env.local)
//   if (apiKey !== process.env.CHATBOT_ADMIN_KEY) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   if (!email) {
//     return NextResponse.json({ error: "Email required" }, { status: 400 });
//   }
//   const user = await getUserByEmail(email);

//   if (!user) {
//     return NextResponse.json({ plan: "free", exists: false });
//   }

//   return NextResponse.json({ 
//     plan: user.plan, 
//     credits: user.credits, 
//     exists: true 
//   });
// }