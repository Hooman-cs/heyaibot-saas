"use client";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State for dynamic prices
  const [prices, setPrices] = useState({ starter: 999, growth: 2499, agency: 6999 });

  // 1. Fetch Prices on Load
  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => setPrices(data))
      .catch((err) => console.error("Failed to load prices", err));
  }, []);

  const handleCheckout = async (planId) => {
    if (!session) {
      signIn(); 
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "HeyAiBot",
        description: `${planId.toUpperCase()} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response) {
          // Verify and Update Plan
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-600">Choose the plan that fits your business needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard title="Starter" price={`₹${prices.starter}`} features={["1 Website", "Basic AI responses", "Lead capture"]} btnText="Subscribe" onClick={() => handleCheckout("starter")} loading={loading} />
            <PricingCard title="Growth" price={`₹${prices.growth}`} highlighted={true} features={["3 Websites", "Smart action triggers", "Analytics"]} btnText="Subscribe" onClick={() => handleCheckout("growth")} loading={loading} />
            <PricingCard title="Agency" price={`₹${prices.agency}`} features={["Unlimited websites", "White-label option", "Priority support"]} btnText="Subscribe" onClick={() => handleCheckout("agency")} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features, highlighted, btnText, onClick, loading }) {
  return (
    <div className={`p-8 rounded-2xl bg-white border ${highlighted ? 'border-blue-600 shadow-xl ring-1 ring-blue-600' : 'border-slate-200 shadow-sm'} flex flex-col`}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold tracking-tight text-slate-900">{price}</span>
        <span className="text-slate-500 ml-1">/month</span>
      </div>
      <ul className="mt-8 space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-slate-600"><span className="text-blue-600">✓</span> {feature}</li>
        ))}
      </ul>
      <button onClick={onClick} disabled={loading} className={`mt-8 w-full py-3 px-4 rounded-md font-semibold shadow-sm transition-all ${highlighted ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
        {loading ? 'Processing...' : btnText}
      </button>
    </div>
  );
}






// "use client";
// import Script from "next/script";
// import { useState } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function Pricing() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async (planId) => {
//     if (!session) {
//       signIn(); // Force login if not signed in
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Create Order on Backend
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ planId }),
//       });
      
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       // 2. Open Razorpay Modal
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.amount,
//         currency: "INR",
//         name: "HeyAiBot",
//         description: `${planId.toUpperCase()} Plan Subscription`,
//         order_id: data.orderId,
//         handler: function (response) {
//           // Success! In a real app, verify signature at /api/payment/verify
//           alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
//           router.push("/dashboard");
//         },
//         prefill: {
//           name: session.user.name,
//           email: session.user.email,
//         },
//         theme: {
//           color: "#2563eb",
//         },
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
//     <div className="py-24 bg-slate-50">
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//             Simple, Transparent Pricing
//           </h2>
//           <p className="mt-4 text-lg text-slate-600">
//             Choose the plan that fits your business needs.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {/* STARTER */}
//           <PricingCard
//             title="Starter"
//             price="₹999"
//             features={[
//               "1 Website",
//               "Basic AI responses",
//               "Categories & services",
//               "Lead capture",
//               "Email support"
//             ]}
//             btnText="Start Free Trial"
//             onClick={() => handleCheckout("starter")}
//             loading={loading}
//           />

//           {/* GROWTH */}
//           <PricingCard
//             title="Growth"
//             price="₹2,499"
//             highlighted={true}
//             features={[
//               "3 Websites",
//               "Smart action triggers",
//               "API integrations",
//               "Analytics",
//               "Priority support"
//             ]}
//             btnText="Start Free Trial"
//             onClick={() => handleCheckout("growth")}
//             loading={loading}
//           />

//           {/* AGENCY */}
//           <PricingCard
//             title="Agency"
//             price="₹6,999"
//             features={[
//               "Unlimited websites",
//               "White-label option",
//               "Client management",
//               "Advanced analytics",
//               "Dedicated support"
//             ]}
//             btnText="Start Free Trial"
//             onClick={() => handleCheckout("agency")}
//             loading={loading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function PricingCard({ title, price, features, highlighted, btnText, onClick, loading }) {
//   return (
//     <div className={`p-8 rounded-2xl bg-white border ${highlighted ? 'border-blue-600 shadow-xl ring-1 ring-blue-600' : 'border-slate-200 shadow-sm'} flex flex-col`}>
//       <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
//       <div className="mt-4 flex items-baseline">
//         <span className="text-4xl font-bold tracking-tight text-slate-900">{price}</span>
//         <span className="text-slate-500 ml-1">/month</span>
//       </div>
//       <ul className="mt-8 space-y-3 flex-1">
//         {features.map((feature) => (
//           <li key={feature} className="flex gap-3 text-slate-600">
//             <span className="text-blue-600">✓</span> {feature}
//           </li>
//         ))}
//       </ul>
//       <button
//         onClick={onClick}
//         disabled={loading}
//         className={`mt-8 w-full py-3 px-4 rounded-md font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all
//           ${highlighted 
//             ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600' 
//             : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
//       >
//         {loading ? 'Processing...' : btnText}
//       </button>
//     </div>
//   );
// }