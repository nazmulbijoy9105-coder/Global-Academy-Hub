import React from "react";
import { motion } from "motion/react";
import { Download, Printer, CheckCircle, FileText, Globe, GraduationCap, DollarSign, Calendar, Award, Info, X } from "lucide-react";
import { StudentProfile } from "../types";
import Logo from "./Logo";

interface ReportViewerProps {
  profile: StudentProfile;
  onClose: () => void;
}

export default function ReportViewer({ profile, onClose }: ReportViewerProps) {
  const { targetCountry, targetDegree, targetSubject, gpa, budget, ielts } = profile;

  // Mock-intelligent report generation based on student profile
  const getSuitabilityScore = (country: string) => {
    const norm = country.toLowerCase();
    if (norm.includes("germany")) return { grade: "A+", label: "Excellent Suitability", desc: "No tuition fees, excellent work options, high visa ratio. Blocked account required." };
    if (norm.includes("sweden")) return { grade: "A", label: "Very High Suitability", desc: "English-taught programs, great post-study work visa, premium academics." };
    if (norm.includes("finland")) return { grade: "A-", label: "Highly Recommended", desc: "Excellent happiness index, generous tuition fee waiver scholarships for high GPAs." };
    if (norm.includes("poland")) return { grade: "B+", label: "Highly Cost-Effective", desc: "Low tuition fees and affordable living costs. Perfect for low/medium budgets." };
    return { grade: "A-", label: "Suitable Path", desc: "Good mix of standard requirements and post-study opportunities." };
  };

  const suitability = getSuitabilityScore(targetCountry);

  const getUniversities = (country: string, subject: string) => {
    const list: Array<{ name: string; course: string; fee: string; requirement: string; chances: string }> = [];
    const subj = subject || "Computer Science";
    const ctry = country || "Germany";

    if (ctry.toLowerCase().includes("germany")) {
      list.push(
        { name: "Technical University of Munich (TUM)", course: `M.Sc. in ${subj}`, fee: "€0 (Public)", requirement: "GPA 3.5+ & IELTS 6.5", chances: "Moderate" },
        { name: "RWTH Aachen University", course: `B.Sc./M.Sc. in ${subj}`, fee: "€0 (Public)", requirement: "GPA 3.4+ & IELTS 6.5", chances: "High" },
        { name: "TU Berlin", course: `M.Sc. in ${subj} (English)`, fee: "€0 (Public)", requirement: "GPA 3.2+ & IELTS 6.0", chances: "Very High" },
        { name: "University of Freiburg", course: `Applied ${subj}`, fee: "€1,500/semester", requirement: "GPA 3.0+ & IELTS 6.5", chances: "High" }
      );
    } else if (ctry.toLowerCase().includes("sweden")) {
      list.push(
        { name: "KTH Royal Institute of Technology", course: `M.Sc. in Systems ${subj}`, fee: "SEK 155,000/yr", requirement: "GPA 3.2+ & IELTS 6.5", chances: "Moderate" },
        { name: "Chalmers University of Technology", course: `${subj} Eng`, fee: "SEK 140,000/yr", requirement: "GPA 3.0+ & IELTS 6.5", chances: "High" },
        { name: "Linköping University", course: `M.Sc. ${subj}`, fee: "SEK 120,000/yr", requirement: "GPA 2.8+ & IELTS 6.5", chances: "Very High" }
      );
    } else if (ctry.toLowerCase().includes("finland")) {
      list.push(
        { name: "Aalto University", course: `M.Sc. ${subj}`, fee: "€15,000/yr (Up to 100% waiver)", requirement: "GPA 3.5+ & IELTS 6.5", chances: "Moderate" },
        { name: "University of Helsinki", course: `M.Sc. in ${subj} Science`, fee: "€13,000/yr", requirement: "GPA 3.2+ & IELTS 6.5", chances: "High" },
        { name: "Tampere University", course: `${subj} Program`, fee: "€10,000/yr", requirement: "GPA 3.0+ & IELTS 6.0", chances: "Very High" }
      );
    } else {
      // General Europe default
      list.push(
        { name: `University of Warsaw (${ctry})`, course: `B.Sc./M.Sc. in ${subj}`, fee: "€3,000/yr", requirement: "GPA 2.5+ & IELTS 6.0", chances: "Very High" },
        { name: `Wrocław University of Science and Technology`, course: `${subj} Program`, fee: "€2,500/yr", requirement: "GPA 2.5+ & IELTS 6.0", chances: "Very High" },
        { name: `Vistula University`, course: `${subj} & Engineering`, fee: "€2,000/yr", requirement: "GPA 2.0+ & IELTS 5.5", chances: "Excellent" }
      );
    }
    return list;
  };

  const universities = getUniversities(targetCountry, targetSubject);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-start p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 print:my-0 print:border-none print:shadow-none"
      >
        {/* Header toolbar - hidden on print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            <span className="font-display font-semibold text-slate-800">Study Abroad Suitability Report</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Report
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Report Content Container */}
        <div id="printable-report" className="p-8 md:p-12 text-slate-800 space-y-8 bg-white print:p-0">
          
          {/* Cover Header */}
          <div className="border-b-4 border-violet-600 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div className="flex items-start gap-4">
              <Logo size={52} className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0 hidden sm:inline-flex" />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase font-semibold text-violet-700 bg-violet-50 rounded-full">
                    Confidential Candidate Evaluation
                  </span>
                </div>
                <h1 className="font-display text-2.5xl font-bold tracking-tight text-slate-900">
                  Global Academy Hub Pathway Report
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Customized academic and visa feasibility mapping for Schengen Zone higher studies.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right text-xs font-mono text-slate-400 shrink-0">
              <div>REPORT ID: GAH-2026-{Math.floor(1000 + Math.random() * 9000)}</div>
              <div>DATE GENERATED: {new Date().toLocaleDateString('en-GB')}</div>
              <div className="text-violet-600 font-semibold">GLOBAL ACADEMY HUB LTD</div>
            </div>
          </div>

          {/* Target Profile Summary Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Candidate Target</span>
              <div className="font-semibold text-slate-800 text-sm">{targetDegree || "Master's"}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Selected Subject</span>
              <div className="font-semibold text-slate-800 text-sm truncate">{targetSubject || "Computer Science"}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Academic Merit</span>
              <div className="font-semibold text-slate-800 text-sm">GPA {gpa || "3.50"} / IELTS {ielts || "6.5"}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Estimated Budget</span>
              <div className="font-semibold text-slate-800 text-sm capitalize">{budget || "Medium"}</div>
            </div>
          </div>

          {/* Suitability Assessment & Dynamic Grade Panel */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-violet-600" />
                <h3 className="font-display font-semibold text-slate-950 text-lg">Destination: {targetCountry}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Based on your profile (GPA: {gpa || "3.5"}, IELTS: {ielts || "6.5"}), {targetCountry} is an exceptional gateway. 
                Schengen student status grants full mobility across 29 European countries, up to 20 hours/week of legal part-time 
                work rights, and post-graduation residence search permits ranging from 9 to 18 months.
              </p>
              <div className="flex items-start gap-2.5 p-3.5 bg-violet-50/50 rounded-lg border border-violet-100 text-xs text-violet-950">
                <Info className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Bilingual Advice:</strong> This region is highly receptive to international students. Many public and 
                  private options offer 100% English medium syllabus instructions. স্থানীয় ভাষা (যেমন জার্মান বা সুইডিশ) এর বেসিক জানা থাকলে খণ্ডকালীন চাকরি পেতে অতিরিক্ত সুবিধা পাওয়া যায়।
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between border border-slate-850">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-violet-300 uppercase tracking-widest font-semibold">Suitability Grade</span>
                <h4 className="text-xs text-slate-400">{suitability.label}</h4>
              </div>
              <div className="my-3 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold tracking-tight text-violet-400">{suitability.grade}</span>
                <span className="text-xs text-slate-400">/ Schengen Scale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                {suitability.desc}
              </p>
            </div>
          </div>

          {/* Dynamic University Shortlist Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-violet-600" />
              <h3 className="font-display font-semibold text-slate-950 text-lg">Tailored University Shortlist</h3>
            </div>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                    <th className="p-3">University Name</th>
                    <th className="p-3">Program Offered</th>
                    <th className="p-3 text-right">Approx Tuition Fee</th>
                    <th className="p-3">Entry Criteria</th>
                    <th className="p-3 text-center">Admission Chances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {universities.map((uni, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-medium text-slate-900">{uni.name}</td>
                      <td className="p-3 text-slate-600 italic">{uni.course}</td>
                      <td className="p-3 text-right text-slate-900 font-mono font-medium">{uni.fee}</td>
                      <td className="p-3 text-slate-500 font-mono">{uni.requirement}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          uni.chances.includes("Very") || uni.chances.includes("Excellent")
                            ? "bg-emerald-50 text-emerald-700" 
                            : uni.chances === "High"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {uni.chances}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Planning / Costs Panel */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-violet-600" />
                <h4 className="font-display font-semibold text-slate-900">Estimated Expense Breakdown</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                  <span>Visa Application Fee (Embassy in Dhaka)</span>
                  <span className="font-medium text-slate-900 font-mono">৳9,800 (~€75)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                  <span>Schengen Travel Health Insurance</span>
                  <span className="font-medium text-slate-900 font-mono">৳15,000 - ৳25,000</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                  <span>Blocked Account / Financial Proof (Annual)</span>
                  <span className="font-medium text-slate-900 font-mono">€11,900 (~৳15,47,000)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                  <span>Monthly Average Living Expenses</span>
                  <span className="font-medium text-slate-900 font-mono">€600 - €900 / month</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-600" />
                <h4 className="font-display font-semibold text-slate-900">Visa Milestones & Deadlines</h4>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">SOP & Application Window</h5>
                    <p className="text-slate-500">October - January (Winter Intake) / April - July (Summer Intake)</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Dhaka Embassy Interview Slot Request</h5>
                    <p className="text-slate-500">Book immediately upon university offer letter receipt to avoid slots backlog.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Visa Processing Wait time</h5>
                    <p className="text-slate-500">Typically takes 4 to 8 weeks after submitting passports in Dhaka.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification Seal & Legal Note */}
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Verified by Global Academy Hub
                </p>
                <p className="text-slate-400">Consultancy Reg #8841, Panthapath HQ Office, Dhaka</p>
              </div>
            </div>
            <div className="text-center md:text-right text-[10px] text-slate-400 leading-relaxed max-w-xs">
              This suitability report is generated based on self-disclosed metrics. For absolute validation, we recommend booking a human-consultant verification review.
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
