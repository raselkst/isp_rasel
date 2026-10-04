"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, Activity, Wifi, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

const mockData = [
  { id: "C-101", package: "Premium 50Mbps", upload: "12.5 GB", download: "85.2 GB", total: "97.7 GB", avg: "4.2 Mbps" },
  { id: "C-102", package: "Standard 20Mbps", upload: "5.1 GB", download: "32.4 GB", total: "37.5 GB", avg: "2.1 Mbps" },
  { id: "C-103", package: "Basic 10Mbps", upload: "1.2 GB", download: "8.5 GB", total: "9.7 GB", avg: "0.8 Mbps" },
];

export default function HighTrafficUsagesPage() {
  const [data] = useState(mockData);

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <DashboardSidebar />

      <div className="flex-1 min-w-0 relative z-10">
        <DashboardTopbar />

        <div className="p-6 md:p-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Real-time Traffic Flow
                </h1>
                <p className="text-slate-400 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Data Syncing
                </p>
              </div>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all text-white">
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pop In-Charge</label>
                  <select className="w-full bg-[#131A2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                    <option>Choose Pop In-Charge</option>
                    <option>Pop 1</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date From</label>
                  <input type="date" defaultValue="2026-09-17" className="w-full bg-[#131A2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date To</label>
                  <input type="date" defaultValue="2026-09-24" className="w-full bg-[#131A2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" /> Search Data
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <AnimatePresence>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    >
                      <div className="flex items-center gap-4 w-full md:w-1/4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Wifi className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{item.id}</h3>
                          <p className="text-xs text-slate-400">{item.package}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-3/4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-emerald-400"/> Upload</p>
                          <p className="font-semibold text-emerald-400">{item.upload}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-blue-400"/> Download</p>
                          <p className="font-semibold text-blue-400">{item.download}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Total Usage</p>
                          <p className="font-semibold text-white">{item.total}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Avg Speed</p>
                          <p className="font-semibold text-amber-400">{item.avg}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300">No Traffic Data Found</h3>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or date range.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}