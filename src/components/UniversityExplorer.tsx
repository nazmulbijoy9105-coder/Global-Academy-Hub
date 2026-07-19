import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, Filter, DollarSign, Award, GraduationCap, MapPin, CheckCircle2 } from "lucide-react";
import { UNIVERSITY_DATA } from "../data/university_data";
import { University } from "../types";

const UniversityExplorer: React.FC<{ language: "en" | "bn" }> = ({ language }) => {
  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [costFilter, setCostFilter] = useState<string>("All");

  const regions = ["All", "Asia", "Middle East", "Europe", "USA", "New Zealand"];
  const costs = ["All", "Low", "Medium", "High"];

  const filteredUniversities = UNIVERSITY_DATA.filter((uni) => {
    const matchesRegion = activeRegion === "All" || uni.region === activeRegion;
    const matchesCost = costFilter === "All" || uni.costLevel === costFilter;
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          uni.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          uni.subjects.common.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesCost && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-violet-600" />
          <span>{language === "bn" ? "গ্লোবাল ইউনিভার্সিটি এক্সপ্লোরার" : "Global University Explorer"}</span>
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-2xl">
          {language === "bn" 
            ? "আপনার বাজেট এবং পছন্দের বিষয়ের ভিত্তিতে বিশ্বের সেরা এবং সাশ্রয়ী বিশ্ববিদ্যালয়গুলি খুঁজে নিন।" 
            : "Discover top-tier and cost-effective universities across the globe based on your budget and preferred field of study."}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={language === "bn" ? "বিশ্ববিদ্যালয় বা দেশ খুঁজুন..." : "Search universities or countries..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRegion === region
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
           {costs.map((cost) => (
            <button
              key={cost}
              onClick={() => setCostFilter(cost)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                costFilter === cost
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cost === "All" ? (language === "bn" ? "সব বাজেট" : "All Budgets") : cost}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUniversities.map((uni) => (
            <motion.div
              layout
              key={uni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-violet-200 transition-all group flex flex-col"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-violet-600 uppercase tracking-widest">
                      <MapPin className="w-3 h-3" />
                      {uni.country} • {uni.region}
                    </div>
                    <h3 className="font-display text-lg font-black text-slate-900 group-hover:text-violet-700 transition-colors leading-tight">
                      {uni.name}
                    </h3>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    uni.costLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    uni.costLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {uni.costLevel} Cost
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Tuition</div>
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      {uni.tuitionRange}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Global Rank</div>
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      {uni.rankRange}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Common Subjects
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.subjects.common.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Filter className="w-3 h-3" />
                      Uncommon / Specialized
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.subjects.uncommon.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-md text-[10px] font-bold border border-violet-100/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="space-y-2">
                  {uni.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredUniversities.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900">No universities found</p>
              <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
            <button 
              onClick={() => { setActiveRegion("All"); setCostFilter("All"); setSearchQuery(""); }}
              className="text-violet-600 font-bold text-sm hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityExplorer;
