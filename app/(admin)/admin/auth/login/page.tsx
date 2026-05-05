"use client";

import { useState } from "react";
import { Button } from "@/app/components/Form/Button";
import { FiShield } from "react-icons/fi";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for admin login
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <FiShield className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Admin Access
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">
            Authorized personnel only
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                placeholder="admin@shelf.ng"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full py-4 text-base font-bold bg-emerald-600 hover:bg-emerald-500 rounded-xl">
              Authenticate
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
