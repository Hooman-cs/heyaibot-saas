"use client";
import { useState, useEffect } from "react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => setPayments(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Subscription History</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((p) => (
              // FIX: Use 'payment_id' (snake_case)
              <tr key={p.payment_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* FIX: Use 'start_date' */}
                  {new Date(p.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                   {/* FIX: Use 'user_id' */}
                   {p.user_id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {/* FIX: Use 'plan_id' */}
                  {p.plan_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{p.amount}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";

// export default function AdminPayments() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     fetch("/api/admin/payments")
//       .then((res) => res.json())
//       .then((data) => setPayments(data));
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {payments.map((p) => (
//               <tr key={p.paymentId}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(p.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.userId}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{p.planId}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{p.paymentId}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }