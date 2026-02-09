"use client";
import { useState, useEffect } from "react";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [features, setFeatures] = useState([]); 
  
  const [newPlan, setNewPlan] = useState({ name: "", amount: "", duration: "30" });
  const [newFeature, setNewFeature] = useState({ name: "", value: "" });

  // 1. Define Functions
  const loadPlans = () => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  };

  const loadFeatures = (planId) => {
    fetch(`/api/admin/features?planId=${planId}`)
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  };

  // 2. Effects
  useEffect(() => { loadPlans(); }, []);

  useEffect(() => {
    if (selectedPlan) {
      // FIX: Removed setFeatures([]) from here to prevent the error
      loadFeatures(selectedPlan.plan_id);
    }
  }, [selectedPlan]);

  // 3. Actions
  const handlePlanClick = (plan) => {
    setFeatures([]); // FIX: Clear features HERE immediately
    setSelectedPlan(plan);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/plans", {
      method: "POST",
      body: JSON.stringify(newPlan),
    });
    setNewPlan({ name: "", amount: "", duration: "30" });
    loadPlans();
  };

  const togglePlanStatus = async (plan) => {
    const newStatus = plan.status === 'active' ? 'disabled' : 'active';
    await fetch("/api/admin/plans", {
      method: "PUT",
      body: JSON.stringify({ planId: plan.plan_id, status: newStatus }),
    });
    loadPlans();
  };

  const handleAddFeature = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    await fetch("/api/admin/features", {
      method: "POST",
      body: JSON.stringify({
        planId: selectedPlan.plan_id,
        name: newFeature.name,
        value: newFeature.value
      }),
    });
    setNewFeature({ name: "", value: "" });
    loadFeatures(selectedPlan.plan_id);
  };

  const toggleFeatureStatus = async (feature) => {
    const newStatus = feature.status === 'enable' ? 'disable' : 'enable';
    await fetch("/api/admin/features", {
      method: "PUT",
      body: JSON.stringify({ 
        planId: selectedPlan.plan_id, 
        featureId: feature.feature_id, 
        status: newStatus 
      }),
    });
    loadFeatures(selectedPlan.plan_id);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Plan Manager</h1>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT: Plan Creation & List (4 Cols) */}
        <div className="col-span-12 md:col-span-5 space-y-6">
          {/* Create Plan Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Create New Plan</h2>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              <input 
                placeholder="Plan Name (e.g. Starter)" 
                value={newPlan.name} 
                onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  placeholder="Price (₹)" 
                  type="number"
                  value={newPlan.amount} 
                  onChange={e => setNewPlan({...newPlan, amount: e.target.value})}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
                />
                <input 
                  placeholder="Days" 
                  type="number"
                  value={newPlan.duration} 
                  onChange={e => setNewPlan({...newPlan, duration: e.target.value})}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white p-2 rounded-lg text-sm hover:bg-gray-800 transition">
                Create Plan
              </button>
            </form>
          </div>

          {/* List of Plans */}
          <div className="space-y-3">
            {plans.map(plan => (
              <div 
                key={plan.plan_id} 
                // FIX: Use the new handlePlanClick wrapper
                onClick={() => handlePlanClick(plan)} 
                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedPlan?.plan_id === plan.plan_id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-800">{plan.plan_name}</div>
                    <div className="text-sm text-gray-500">₹{plan.amount} / {plan.duration} days</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePlanStatus(plan); }}
                    className={`text-xs px-2 py-1 rounded font-bold uppercase ${plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {plan.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Feature Manager (8 Cols) */}
        <div className="col-span-12 md:col-span-7">
          {selectedPlan ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Features</h2>
                  <p className="text-sm text-gray-500">Managing: <span className="font-semibold text-blue-600">{selectedPlan.plan_name}</span></p>
                </div>
              </div>

              {/* Add Feature Bar */}
              <form onSubmit={handleAddFeature} className="flex gap-3 mb-6 bg-gray-50 p-3 rounded-lg">
                <input 
                  placeholder="Name (e.g. max_bots)" 
                  value={newFeature.name} 
                  onChange={e => setNewFeature({...newFeature, name: e.target.value})}
                  className="flex-grow border border-gray-300 p-2 rounded-md text-sm" required
                />
                <input 
                  placeholder="Value (e.g. 5)" 
                  value={newFeature.value} 
                  onChange={e => setNewFeature({...newFeature, value: e.target.value})}
                  className="w-24 border border-gray-300 p-2 rounded-md text-sm" required
                />
                <button type="submit" className="bg-green-600 text-white px-4 rounded-md text-sm hover:bg-green-700">Add</button>
              </form>

              {/* Feature List */}
              <div className="space-y-2">
                {features.length === 0 && <div className="text-center py-10 text-gray-400">No features found. Add one above!</div>}
                
                {features.map(feat => (
                  <div key={feat.feature_id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                    <div className={`flex items-center gap-3 ${feat.status === 'disable' ? "opacity-40" : ""}`}>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{feat.feature_name}</span>
                      <span className="text-gray-600 text-sm">=</span>
                      <span className="font-bold text-gray-900">{feat.feature_value}</span>
                    </div>
                    <button 
                      onClick={() => toggleFeatureStatus(feat)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition ${feat.status === 'enable' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {feat.status === 'enable' ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-10">
              <span className="text-4xl mb-2">👈</span>
              <p>Select a plan from the left to manage features</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";

// export default function AdminPlans() {
//   const [plans, setPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState(null); 
//   const [features, setFeatures] = useState([]); 
  
//   const [newPlan, setNewPlan] = useState({ name: "", amount: "", duration: "30" });
//   const [newFeature, setNewFeature] = useState({ name: "", value: "" });

//   // 1. Define Functions
//   const loadPlans = () => {
//     fetch("/api/admin/plans")
//       .then((res) => res.json())
//       .then((data) => setPlans(data));
//   };

//   const loadFeatures = (planId) => {
//     fetch(`/api/admin/features?planId=${planId}`)
//       .then((res) => res.json())
//       .then((data) => setFeatures(data));
//   };

//   // 2. Effects
//   useEffect(() => { loadPlans(); }, []);

//   useEffect(() => {
//     if (selectedPlan) {
//       setFeatures([]); 
//       loadFeatures(selectedPlan.plan_id);
//     }
//   }, [selectedPlan]);

//   // 3. Actions
//   const handleCreatePlan = async (e) => {
//     e.preventDefault();
//     await fetch("/api/admin/plans", {
//       method: "POST",
//       body: JSON.stringify(newPlan),
//     });
//     setNewPlan({ name: "", amount: "", duration: "30" });
//     loadPlans();
//   };

//   const togglePlanStatus = async (plan) => {
//     const newStatus = plan.status === 'active' ? 'disabled' : 'active';
//     await fetch("/api/admin/plans", {
//       method: "PUT",
//       body: JSON.stringify({ planId: plan.plan_id, status: newStatus }),
//     });
//     loadPlans();
//   };

//   const handleAddFeature = async (e) => {
//     e.preventDefault();
//     if (!selectedPlan) return;
//     await fetch("/api/admin/features", {
//       method: "POST",
//       body: JSON.stringify({
//         planId: selectedPlan.plan_id,
//         name: newFeature.name,
//         value: newFeature.value
//       }),
//     });
//     setNewFeature({ name: "", value: "" });
//     loadFeatures(selectedPlan.plan_id);
//   };

//   const toggleFeatureStatus = async (feature) => {
//     const newStatus = feature.status === 'enable' ? 'disable' : 'enable';
//     await fetch("/api/admin/features", {
//       method: "PUT",
//       body: JSON.stringify({ 
//         planId: selectedPlan.plan_id, 
//         featureId: feature.feature_id, 
//         status: newStatus 
//       }),
//     });
//     loadFeatures(selectedPlan.plan_id);
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Plan Manager</h1>

//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT: Plan Creation & List (4 Cols) */}
//         <div className="col-span-12 md:col-span-5 space-y-6">
//           {/* Create Plan Card */}
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//             <h2 className="font-semibold text-gray-800 mb-4">Create New Plan</h2>
//             <form onSubmit={handleCreatePlan} className="space-y-3">
//               <input 
//                 placeholder="Plan Name (e.g. Starter)" 
//                 value={newPlan.name} 
//                 onChange={e => setNewPlan({...newPlan, name: e.target.value})}
//                 className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
//               />
//               <div className="grid grid-cols-2 gap-3">
//                 <input 
//                   placeholder="Price (₹)" 
//                   type="number"
//                   value={newPlan.amount} 
//                   onChange={e => setNewPlan({...newPlan, amount: e.target.value})}
//                   className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
//                 />
//                 <input 
//                   placeholder="Days" 
//                   type="number"
//                   value={newPlan.duration} 
//                   onChange={e => setNewPlan({...newPlan, duration: e.target.value})}
//                   className="w-full border border-gray-300 p-2 rounded-lg text-sm" required
//                 />
//               </div>
//               <button type="submit" className="w-full bg-gray-900 text-white p-2 rounded-lg text-sm hover:bg-gray-800 transition">
//                 Create Plan
//               </button>
//             </form>
//           </div>

//           {/* List of Plans */}
//           <div className="space-y-3">
//             {plans.map(plan => (
//               <div 
//                 key={plan.plan_id} 
//                 onClick={() => setSelectedPlan(plan)}
//                 className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedPlan?.plan_id === plan.plan_id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <div className="font-bold text-gray-800">{plan.plan_name}</div>
//                     <div className="text-sm text-gray-500">₹{plan.amount} / {plan.duration} days</div>
//                   </div>
//                   <button 
//                     onClick={(e) => { e.stopPropagation(); togglePlanStatus(plan); }}
//                     className={`text-xs px-2 py-1 rounded font-bold uppercase ${plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
//                   >
//                     {plan.status}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: Feature Manager (8 Cols) */}
//         <div className="col-span-12 md:col-span-7">
//           {selectedPlan ? (
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">Features</h2>
//                   <p className="text-sm text-gray-500">Managing: <span className="font-semibold text-blue-600">{selectedPlan.plan_name}</span></p>
//                 </div>
//               </div>

//               {/* Add Feature Bar */}
//               <form onSubmit={handleAddFeature} className="flex gap-3 mb-6 bg-gray-50 p-3 rounded-lg">
//                 <input 
//                   placeholder="Name (e.g. max_bots)" 
//                   value={newFeature.name} 
//                   onChange={e => setNewFeature({...newFeature, name: e.target.value})}
//                   className="flex-grow border border-gray-300 p-2 rounded-md text-sm" required
//                 />
//                 <input 
//                   placeholder="Value (e.g. 5)" 
//                   value={newFeature.value} 
//                   onChange={e => setNewFeature({...newFeature, value: e.target.value})}
//                   className="w-24 border border-gray-300 p-2 rounded-md text-sm" required
//                 />
//                 <button type="submit" className="bg-green-600 text-white px-4 rounded-md text-sm hover:bg-green-700">Add</button>
//               </form>

//               {/* Feature List */}
//               <div className="space-y-2">
//                 {features.length === 0 && <div className="text-center py-10 text-gray-400">No features found. Add one above!</div>}
                
//                 {features.map(feat => (
//                   <div key={feat.feature_id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
//                     <div className={`flex items-center gap-3 ${feat.status === 'disable' ? "opacity-40" : ""}`}>
//                       <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{feat.feature_name}</span>
//                       <span className="text-gray-600 text-sm">=</span>
//                       <span className="font-bold text-gray-900">{feat.feature_value}</span>
//                     </div>
//                     <button 
//                       onClick={() => toggleFeatureStatus(feat)}
//                       className={`text-xs px-3 py-1 rounded-full font-medium transition ${feat.status === 'enable' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                     >
//                       {feat.status === 'enable' ? 'Active' : 'Disabled'}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-10">
//               <span className="text-4xl mb-2">👈</span>
//               <p>Select a plan from the left to manage features</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }