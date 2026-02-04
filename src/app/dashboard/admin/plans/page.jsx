"use client";
import { useState, useEffect } from "react";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ id: "", name: "", price: "", features: "" });

  const loadPlans = () => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const featuresArray = newPlan.features.split(",").map(f => f.trim());
    
    await fetch("/api/admin/plans", {
      method: "POST",
      body: JSON.stringify({ ...newPlan, price: Number(newPlan.price), features: featuresArray }),
    });
    
    setNewPlan({ id: "", name: "", price: "", features: "" });
    loadPlans();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await fetch("/api/admin/plans", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    loadPlans();
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Plans</h1>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-4">Create New Plan</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <input 
            placeholder="ID (e.g. pro_monthly)" 
            value={newPlan.id} 
            onChange={e => setNewPlan({...newPlan, id: e.target.value})}
            className="border p-2 rounded" required
          />
          <input 
            placeholder="Name (e.g. Pro Plan)" 
            value={newPlan.name} 
            onChange={e => setNewPlan({...newPlan, name: e.target.value})}
            className="border p-2 rounded" required
          />
          <input 
            placeholder="Price (e.g. 2999)" 
            type="number"
            value={newPlan.price} 
            onChange={e => setNewPlan({...newPlan, price: e.target.value})}
            className="border p-2 rounded" required
          />
          <input 
            placeholder="Features (comma separated)" 
            value={newPlan.features} 
            onChange={e => setNewPlan({...newPlan, features: e.target.value})}
            className="border p-2 rounded"
          />
          <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">Create Plan</button>
        </form>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-bold">{plan.name} <span className="text-gray-400 text-sm">({plan.id})</span></div>
              <div className="text-green-600 font-bold">₹{plan.price}</div>
              <div className="text-sm text-gray-500">{plan.features?.join(", ")}</div>
            </div>
            <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-800">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}