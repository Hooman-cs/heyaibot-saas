import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateUserPlan } from "@/lib/user-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { recordPayment } from "@/lib/payment-db";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update Plan + Expiration (Handled inside user-db.js)
    await updateUserPlan(session.user.email, plan);

    // NEW: Record History
  await recordPayment({
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    userId: session.user.email,
    planId: plan,
    amount: "PAID", // You should pass the actual amount from frontend if possible
    status: "success"
  });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { updateUserPlan } from "@/lib/user-db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req) {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();
//     const session = await getServerSession(authOptions);

//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // 1. Verify Signature (Security Check)
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     // 2. Update User Plan in DB
//     await updateUserPlan(session.user.email, plan);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Payment Verify Error:", error);
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }