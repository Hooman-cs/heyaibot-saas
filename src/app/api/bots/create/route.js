import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { createTenantBot } from "@/lib/bot-service";
import { getUserBots } from "@/lib/bot-db"; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    const userId = session.user.id; // This is now USER#email...

    // 1. Check Limits
    const currentBots = await getUserBots(userId);
    const userPlan = session.user.plan || 'starter'; 
    const limits = PLAN_LIMITS[userPlan];

    if (currentBots.length >= limits.maxBots) {
      return NextResponse.json({ error: "Plan limit reached" }, { status: 403 });
    }

    // 2. Call Chatbot Backend (It will save the bot with userId)
    const bridgeResult = await createTenantBot(userId, name, limits.allowedRoles);
    
    if (!bridgeResult.success) {
      return NextResponse.json({ error: bridgeResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, bot: bridgeResult });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { PLAN_LIMITS } from "@/lib/plan-limits";
// import { createTenantBot } from "@/lib/bot-service";
// import { createBotRecord, getUserBots } from "@/lib/bot-db"; // Import new helper

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { name } = await req.json();
//     const userId = session.user.id;

//     // 1. Check Limits (Using DynamoDB count)
//     const currentBots = await getUserBots(userId);
//     // TODO: Fetch user plan from DB if not in session. Defaulting to starter.
//     const userPlan = 'starter'; 
//     const limits = PLAN_LIMITS[userPlan];

//     if (currentBots.length >= limits.maxBots) {
//       return NextResponse.json({ error: "Plan limit reached" }, { status: 403 });
//     }

//     // 2. Call Chatbot Backend
//     const bridgeResult = await createTenantBot(userId, name, limits.allowedRoles);
//     if (!bridgeResult.success) {
//       return NextResponse.json({ error: bridgeResult.error }, { status: 500 });
//     }

//     // 3. Save to DynamoDB
//     const newBot = await createBotRecord(
//       userId, 
//       name, 
//       bridgeResult.remoteBotId, 
//       bridgeResult.apiKey, 
//       userPlan
//     );

//     return NextResponse.json({ success: true, bot: newBot });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/db";
// import User from "@/models/User";
// import Bot from "@/models/Bot";
// import { PLAN_LIMITS } from "@/lib/plan-limits";
// import { createTenantBot } from "@/lib/bot-service";

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { name } = await req.json();
//     await connectDB();

//     // 1. Get User & Plan
//     const user = await User.findById(session.user.id);
//     const userPlan = user.plan || 'starter'; // Default to starter if not set
//     const limits = PLAN_LIMITS[userPlan];

//     // 2. Check Limits
//     const currentCount = await Bot.countDocuments({ userId: user._id });
//     if (currentCount >= limits.maxBots) {
//       return NextResponse.json(
//         { error: `Limit reached! Your ${userPlan} plan only allows ${limits.maxBots} bot(s). Please upgrade.` },
//         { status: 403 }
//       );
//     }

//     // 3. Call Remote Chatbot Backend
//     const bridgeResult = await createTenantBot(user._id, name, limits.allowedRoles);
    
//     if (!bridgeResult.success) {
//       return NextResponse.json({ error: bridgeResult.error }, { status: 500 });
//     }

//     // 4. Save to SaaS DB
//     const newBot = await Bot.create({
//       name,
//       userId: user._id,
//       remoteBotId: bridgeResult.remoteBotId,
//       apiKey: bridgeResult.apiKey,
//       planType: userPlan
//     });

//     return NextResponse.json({ success: true, bot: newBot });

//   } catch (error) {
//     console.error("Create Bot Error:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }