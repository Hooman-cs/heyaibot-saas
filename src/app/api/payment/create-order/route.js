import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getPlanById } from "@/lib/plan-db"; // Import the helper

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { planId } = await request.json();

    // 1. Fetch Plan from Database
    const plan = await getPlanById(planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    // 2. Create Order using dynamic price
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // Convert Rupees to Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}


// import Razorpay from "razorpay";
// import { NextResponse } from "next/server";

// const razorpay = new Razorpay({
//   key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export async function POST(request) {
//   try {
//     const { planId } = await request.json();

//     // Define pricing logic securely on backend
//     const plans = {
//       starter: { amount: 999 * 100 }, // Amount in paise (999 INR)
//       growth: { amount: 2499 * 100 },
//       agency: { amount: 6999 * 100 },
//     };

//     const selectedPlan = plans[planId];

//     if (!selectedPlan) {
//       return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
//     }

//     const order = await razorpay.orders.create({
//       amount: selectedPlan.amount,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     return NextResponse.json({ orderId: order.id, amount: selectedPlan.amount });
//   } catch (error) {
//     console.error("Razorpay Error:", error);
//     return NextResponse.json({ error: "Error creating order" }, { status: 500 });
//   }
// }