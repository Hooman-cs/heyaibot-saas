"use client";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, []);

  const handleCheckout = async (plan) => {
    if (!session) return signIn();
    setLoading(true);

    try {
      // 1. Create Order (Send plan.id, NOT planId)
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }), 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount, // Amount comes from backend
        currency: "INR",
        name: "HeyAiBot",
        description: `${plan.name} Subscription`,
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id // Save the Plan ID to the user record
            })
          });
          
          alert("Payment Successful! Your plan is active for 30 days.");
          router.push("/dashboard");
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: { color: "#2563eb" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-24 bg-slate-50 flex-grow">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="p-8 bg-white border rounded-2xl shadow-sm flex flex-col">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="text-4xl font-bold mt-4">₹{plan.price}</div>
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features?.map((f, i) => (
                    <li key={i} className="flex gap-2">✓ {f}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan)}
                  className="mt-8 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {loading ? "Processing..." : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



// // Have to update the Razorpay integration to fetch dynamic plans from DB
// "use client";
// import Script from "next/script";
// import { useState, useEffect } from "react";
// import { useSession, signIn } from "next-auth/react";

// export default function Pricing() {
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [plans, setPlans] = useState([]);

//   useEffect(() => {
//     // Fetch dynamic plans from DB
//     fetch("/api/admin/plans")
//       .then((res) => res.json())
//       .then((data) => setPlans(data));
//   }, []);

//   const handleCheckout = async (plan) => {
//     if (!session) return signIn();
//     setLoading(true);
    
//     // ... (Keep existing Razorpay Logic, but pass plan.price and plan.id) ...
//     // NOTE: Update create-order API to accept raw amount or look up DB plan
    
//     try {
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ planId }),
//       });
      
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.amount,
//         currency: "INR",
//         name: "HeyAiBot",
//         description: `${planId.toUpperCase()} Plan Subscription`,
//         order_id: data.orderId,
//         handler: async function (response) {
//           // Verify and Update Plan
//           await fetch("/api/payment/verify", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               plan: planId
//             })
//           });
          
//           alert("Payment Successful! Your plan is active for 30 days.");
//           router.push("/dashboard");
//         },
//         prefill: {
//           name: session.user.name,
//           email: session.user.email,
//         },
//         theme: { color: "#2563eb" },
//       };

//       const rzp1 = new window.Razorpay(options);
//       rzp1.open();

//     } catch (error) {
//       alert("Payment failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }

//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="py-24 bg-slate-50 flex-grow">
//         <Script src="https://checkout.razorpay.com/v1/checkout.js" />
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {plans.map((plan) => (
//               <div key={plan.id} className="p-8 bg-white border rounded-2xl shadow-sm flex flex-col">
//                 <h3 className="text-lg font-bold">{plan.name}</h3>
//                 <div className="text-4xl font-bold mt-4">₹{plan.price}</div>
//                 <ul className="mt-8 space-y-3 flex-1">
//                   {plan.features?.map((f, i) => (
//                     <li key={i} className="flex gap-2">✓ {f}</li>
//                   ))}
//                 </ul>
//                 <button
//                   onClick={() => handleCheckout(plan)}
//                   className="mt-8 w-full py-3 bg-blue-600 text-white rounded-md"
//                 >
//                   {loading ? "Processing..." : "Subscribe"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }