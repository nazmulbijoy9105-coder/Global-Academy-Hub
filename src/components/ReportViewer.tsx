import React, { useState } from "react";
import { motion } from "motion/react";
import { Download, Printer, CheckCircle, FileText, Globe, GraduationCap, DollarSign, Calendar, Award, Info, X } from "lucide-react";
import { StudentProfile } from "../types";
import Logo from "./Logo";
import { jsPDF } from "jspdf";

interface ReportViewerProps {
  profile: StudentProfile;
  onClose: () => void;
}

export default function ReportViewer({ profile, onClose }: ReportViewerProps) {
  const { 
    fullName = "Nazmul Bijoy",
    previousDegree = "B.Sc. in Computer Science",
    previousInstitution = "Not Provided",
    targetCountry = "Germany", 
    preferredCountries = ["Germany"], 
    targetDegree = "Master's", 
    targetSubject = "Computer Science", 
    desiredFields = ["Computer Science"], 
    gpa = "3.65", 
    budget = "medium", 
    budgetAmount = "৳10L - ৳15L / year",
    ielts = "6.5",
    cvFileName = "",
    cvParsed = false,
    cvSkills = []
  } = profile;

  const [isDownloading, setIsDownloading] = useState(false);

  // Mock-intelligent report generation based on student profile countries
  const getSuitabilityScore = (country: string) => {
    const norm = country.toLowerCase();
    if (norm.includes("germany")) return { grade: "A+", label: "Excellent Suitability", desc: "No tuition fees at public universities, excellent post-study work options, high visa ratio. Blocked account required." };
    if (norm.includes("sweden")) return { grade: "A", label: "Very High Suitability", desc: "Premium English-taught programs, great post-study residence permits, robust academic standard." };
    if (norm.includes("finland")) return { grade: "A-", label: "Highly Recommended", desc: "World-class education, happiest country index, generous tuition fee waiver scholarships for competent GPAs." };
    if (norm.includes("poland")) return { grade: "B+", label: "Highly Cost-Effective", desc: "Low tuition fees and extremely affordable living costs. Ideal match for flexible budgets." };
    return { grade: "A-", label: "Suitable Path", desc: "Good balance of academic standards, affordable costs, and post-study opportunities." };
  };

  const primaryCountry = preferredCountries[0] || targetCountry || "Germany";
  const suitability = getSuitabilityScore(primaryCountry);

  const getUniversities = (countries: string[], fields: string[]) => {
    const list: Array<{ name: string; course: string; country: string; fee: string; requirement: string; chances: string }> = [];
    const mainField = fields[0] || targetSubject || "Computer Science";
    const countriesToUse = countries.length > 0 ? countries : [targetCountry || "Germany"];

    countriesToUse.forEach(ctry => {
      const normCtry = ctry.toLowerCase();
      if (normCtry.includes("germany")) {
        list.push(
          { name: "Technical University of Munich (TUM)", course: `M.Sc. in ${mainField}`, country: "Germany", fee: "€0 (Public)", requirement: `GPA ${gpa >= "3.5" ? gpa : "3.5"}+ & IELTS 6.5`, chances: parseFloat(gpa) >= 3.5 ? "High" : "Moderate" },
          { name: "RWTH Aachen University", course: `M.Sc. in Advanced ${mainField}`, country: "Germany", fee: "€0 (Public)", requirement: `GPA ${gpa >= "3.3" ? gpa : "3.3"}+ & IELTS 6.5`, chances: "High" },
          { name: "TU Berlin", course: `M.Sc. in ${mainField} Engineering`, country: "Germany", fee: "€0 (Public)", requirement: `GPA ${gpa >= "3.0" ? gpa : "3.0"}+ & IELTS 6.0`, chances: "Very High" }
        );
      } else if (normCtry.includes("sweden")) {
        list.push(
          { name: "KTH Royal Institute of Technology", course: `M.Sc. in Systems ${mainField}`, country: "Sweden", fee: "SEK 155,000/yr", requirement: "GPA 3.2+ & IELTS 6.5", chances: "Moderate" },
          { name: "Chalmers University of Technology", course: `M.Sc. in Applied ${mainField}`, country: "Sweden", fee: "SEK 140,000/yr", requirement: "GPA 3.0+ & IELTS 6.5", chances: "High" }
        );
      } else if (normCtry.includes("finland")) {
        list.push(
          { name: "Aalto University", course: `M.Sc. in ${mainField} & Tech`, country: "Finland", fee: "€15,000/yr (Up to 100% waiver)", requirement: "GPA 3.4+ & IELTS 6.5", chances: parseFloat(gpa) >= 3.4 ? "High" : "Moderate" },
          { name: "University of Helsinki", course: `M.Sc. in ${mainField} Science`, country: "Finland", fee: "€13,000/yr", requirement: "GPA 3.2+ & IELTS 6.5", chances: "High" }
        );
      } else {
        list.push(
          { name: `University of Warsaw`, course: `B.Sc./M.Sc. in ${mainField}`, country: ctry, fee: "€3,000/yr", requirement: "GPA 2.5+ & IELTS 6.0", chances: "Excellent" },
          { name: `Wrocław University of Science`, course: `${mainField} Program`, country: ctry, fee: "€2,500/yr", requirement: "GPA 2.5+ & IELTS 5.5", chances: "Excellent" }
        );
      }
    });

    return list.slice(0, 5); // Limit to top 5 recommendations
  };

  const universities = getUniversities(preferredCountries, desiredFields);

  const handlePrint = () => {
    window.print();
  };

  // High-Quality PDF Downloader using jsPDF to avoid any printed clipping/broken styles
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Page dimensions: 210 x 297 mm
      // Margin: 15 mm
      let y = 15;

      // Draw Top Deep-Violet Corporate Header Bar
      doc.setFillColor(109, 40, 217); // Violet-700
      doc.rect(0, 0, 210, 42, "F");

      // Draw subtle accent lines
      doc.setFillColor(245, 243, 255);
      doc.rect(0, 42, 210, 2, "F");

      // Title & Branding inside Header Block
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("GLOBAL ACADEMY HUB", 15, 18);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text("SCHENGEN UNIVERSITY PATHWAY & STUDENT VISA SUITABILITY REPORT", 15, 25);
      doc.text(`REPORT ID: GAH-2026-${Math.floor(10000 + Math.random() * 90000)}  |  DATE: ${new Date().toLocaleDateString('en-GB')}`, 15, 31);
      doc.text("CONFIDENTIAL ACADEMIC EVALUATION DOCUMENT", 15, 36);

      // Main Text Colors
      doc.setTextColor(30, 41, 59); // Slate-800
      y = 56;

      // --- Section 1: Candidate Profile ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("1. CANDIDATE ACADEMIC & PROFILE SUMMARY", 15, y);
      
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.4);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 10;

      // Draw Profile Grid Box
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.rect(15, y, 180, 36, "F");
      doc.rect(15, y, 180, 36, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Candidate Name:", 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(fullName, 55, y + 8);

      doc.setFont("helvetica", "bold");
      doc.text("Target Degree Goal:", 115, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(targetDegree, 155, y + 8);

      y += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Prior Background:", 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(previousDegree, 55, y + 8);

      doc.setFont("helvetica", "bold");
      doc.text("Prior Institution:", 115, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(previousInstitution || "Not Specified", 155, y + 8);

      y += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Academic GPA:", 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(`${gpa} / 4.00`, 55, y + 8);

      doc.setFont("helvetica", "bold");
      doc.text("Language Score:", 115, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(`IELTS ${ielts}`, 155, y + 8);

      y += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Budget Capacity:", 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(`${budget.toUpperCase()} (${budgetAmount})`, 55, y + 8);

      doc.setFont("helvetica", "bold");
      doc.text("CV Scan Attachment:", 115, y + 8);
      doc.setFont("helvetica", "normal");
      doc.text(cvFileName ? `Attached (${cvFileName})` : "Manual Entry (No CV uploaded)", 155, y + 8);

      y += 20;

      // --- Section 2: Schengen Compliance ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("2. SCHENGEN VISA COMPLIANCE & ELIGIBILITY REPORT", 15, y);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 10;

      // Draw primary country box
      doc.setFillColor(245, 243, 255); // Violet-50
      doc.rect(15, y, 180, 26, "F");
      doc.setDrawColor(196, 181, 253); // Violet-300
      doc.rect(15, y, 180, 26, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(109, 40, 217); // Violet-700
      doc.text(`Primary Focus Destination: ${primaryCountry}`, 20, y + 6);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text(`Pathway Suitability: ${suitability.label}  (Grade: ${suitability.grade})`, 20, y + 12);
      
      // Multi-line description wrapping safely
      const descLines = doc.splitTextToSize(suitability.desc, 170);
      doc.text(descLines, 20, y + 18);

      doc.setTextColor(30, 41, 59);
      y += 35;

      // --- Section 3: Recommended Universities List ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("3. TAILORED SHENGEN UNIVERSITY SHORTLIST", 15, y);
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 10;

      // Draw table header
      doc.setFillColor(241, 245, 249); // Slate-100
      doc.rect(15, y, 180, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("University Name", 18, y + 5.5);
      doc.text("Country", 85, y + 5.5);
      doc.text("Program/Degree Offered", 108, y + 5.5);
      doc.text("Admission Chances", 162, y + 5.5);

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      
      universities.forEach((uni) => {
        doc.line(15, y + 7, 195, y + 7); // Row divider line
        doc.text(uni.name.length > 38 ? uni.name.slice(0, 38) + "..." : uni.name, 18, y + 4.5);
        doc.text(uni.country, 85, y + 4.5);
        doc.text(uni.course.length > 32 ? uni.course.slice(0, 32) + "..." : uni.course, 108, y + 4.5);
        doc.text(uni.chances, 162, y + 4.5);
        y += 7;
      });

      y += 18;

      // Check if we need a new page for finances
      if (y > 230) {
        doc.addPage();
        y = 20;
        
        // Minor Header on Page 2
        doc.setFillColor(109, 40, 217);
        doc.rect(0, 0, 210, 16, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text("GLOBAL ACADEMY HUB  |  STUDENT COMPLIANCE REPORT CONTINUED", 15, 10);
        y = 28;
      }

      // --- Section 4: Finances & Milestones ---
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("4. EXPENSE BREAKDOWN & DEADLINE MAP", 15, y);
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 10;

      // Draw two column grid box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 86, 42, "F");
      doc.rect(15, y, 86, 42, "S");

      doc.rect(109, y, 86, 42, "F");
      doc.rect(109, y, 86, 42, "S");

      // Column 1 Content
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Cost Itemization (Schengen Area)", 18, y + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("- Visa application fees (Dhaka): ~9,800 BDT", 18, y + 14);
      doc.text("- Schengen-compliant Travel Ins: ~18,000 BDT", 18, y + 20);
      doc.text("- Sperrkonto Blocked Account: €11,904/year", 18, y + 26);
      doc.text("- Est. monthly cost of living: €650 - €950/mo", 18, y + 32);

      // Column 2 Content
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Schengen Intake Milestones", 112, y + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("1. Complete SOP Drafting: Winter (Oct-Jan) / Summer (Apr-Jul)", 112, y + 14);
      doc.text("2. Secure University Admit & pay enrollment fees if any", 112, y + 20);
      doc.text("3. Book German/Swedish Embassy interview in Dhaka", 112, y + 26);
      doc.text("4. Complete mock visa trials in AI Command Center", 112, y + 32);

      y += 54;

      // --- Seal & Disclaimer ---
      doc.setFillColor(245, 243, 255);
      doc.setDrawColor(139, 92, 246); // Violet-500
      doc.rect(15, y, 180, 24, "F");
      doc.rect(15, y, 180, 24, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(109, 40, 217);
      doc.text("OFFICIAL SEAL OF VERIFICATION", 20, y + 7);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`This pathway report is verified as custom-compiled for ${fullName}.`, 20, y + 13);
      doc.text("Global Academy Hub, Panthapath HQ Office, Dhaka, Bangladesh. License #GAH-SCH-8841.", 20, y + 18);

      // Save PDF document with beautiful file name
      const safeName = fullName.replace(/\s+/g, "_");
      doc.save(`Global_Academy_Hub_Report_${safeName}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-start p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 print:my-0 print:border-none print:shadow-none"
      >
        {/* Header toolbar - hidden on print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-violet-50 text-violet-600 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-[13px] text-slate-800 tracking-tight block">Study Abroad Evaluation Report</span>
              <p className="text-[10px] text-slate-400 font-medium">Candidate: {fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors disabled:bg-violet-400"
            >
              <Download className="h-3.5 w-3.5" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all ml-1"
            >
              <X className="h-4.5 w-4.5" />
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
                  <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase font-semibold text-violet-700 bg-violet-50 rounded-full">
                    Confidential Candidate Evaluation
                  </span>
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  Global Academy Hub Pathway Report
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  Customized academic and visa feasibility mapping for Schengen Zone higher studies.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right text-[10px] font-mono text-slate-400 shrink-0">
              <div>REPORT ID: GAH-2026-{Math.floor(10000 + Math.random() * 90000)}</div>
              <div>DATE GENERATED: {new Date().toLocaleDateString('en-GB')}</div>
              <div className="text-violet-600 font-semibold">GLOBAL ACADEMY HUB LTD</div>
            </div>
          </div>

          {/* Target Profile Summary Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Candidate Name</span>
              <div className="font-bold text-slate-800 text-[13px] truncate">{fullName}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Desired Field</span>
              <div className="font-bold text-slate-800 text-[13px] truncate">{desiredFields.join(", ")}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Academic Merit</span>
              <div className="font-bold text-slate-800 text-[13px]">GPA {gpa} / IELTS {ielts}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Estimated Budget</span>
              <div className="font-bold text-slate-800 text-[13px] capitalize">{budgetAmount}</div>
            </div>
          </div>

          {/* Suitability Assessment & Dynamic Grade Panel */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-violet-600" />
                <h3 className="font-display font-semibold text-slate-950 text-md">Destination Focus: {preferredCountries.join(", ")}</h3>
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Based on your profile (GPA: {gpa}, IELTS: {ielts}), <strong className="text-slate-900">{primaryCountry}</strong> is an exceptional gateway. 
                Schengen student status grants full mobility across 29 European countries, up to 20 hours/week of legal part-time 
                work rights, and post-graduation residence search permits ranging from 9 to 18 months.
              </p>
              <div className="flex items-start gap-2.5 p-4 bg-violet-50/50 rounded-2xl border border-violet-100 text-[11px] text-violet-950">
                <Info className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Bilingual Advice:</strong> This region is highly receptive to international students. Many public and 
                  private options offer 100% English medium syllabus instructions. স্থানীয় ভাষা (যেমন জার্মান বা সুইডিশ) এর বেসিক জানা থাকলে খণ্ডকালীন চাকরি পেতে অতিরিক্ত সুবিধা পাওয়া যায়।
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-violet-300 uppercase tracking-widest font-semibold">Suitability Grade</span>
                <h4 className="text-[11px] text-slate-400 font-medium">{suitability.label}</h4>
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
              <h3 className="font-display font-semibold text-slate-950 text-md">Tailored University Shortlist</h3>
            </div>
            <div className="overflow-x-auto border border-slate-150 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-semibold">
                    <th className="p-3.5">University Name</th>
                    <th className="p-3.5">Country</th>
                    <th className="p-3.5">Program Offered</th>
                    <th className="p-3.5 text-right">Approx Tuition Fee</th>
                    <th className="p-3.5">Entry Criteria</th>
                    <th className="p-3.5 text-center">Admission Chances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {universities.map((uni, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{uni.name}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{uni.country}</td>
                      <td className="p-3.5 text-slate-600 italic font-medium">{uni.course}</td>
                      <td className="p-3.5 text-right text-slate-900 font-mono font-bold">{uni.fee}</td>
                      <td className="p-3.5 text-slate-500 font-mono font-medium">{uni.requirement}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          uni.chances.includes("Very") || uni.chances.includes("Excellent") || uni.chances === "High"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border border-amber-100"
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
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm bg-slate-50/30">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-violet-600" />
                <h4 className="font-display font-semibold text-slate-900 text-sm">Estimated Expense Breakdown</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 font-medium">
                <li className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span>Visa Application Fee (Embassy in Dhaka)</span>
                  <span className="font-bold text-slate-900 font-mono">৳9,800 (~€75)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span>Schengen Travel Health Insurance</span>
                  <span className="font-bold text-slate-900 font-mono">৳15,000 - ৳25,000</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span>Blocked Account / Financial Proof (Annual)</span>
                  <span className="font-bold text-slate-900 font-mono">€11,904 (~৳15,48,000)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span>Monthly Average Living Expenses</span>
                  <span className="font-bold text-slate-900 font-mono">€650 - €950 / month</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm bg-slate-50/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-600" />
                <h4 className="font-display font-semibold text-slate-900 text-sm">Visa Milestones & Deadlines</h4>
              </div>
              <div className="space-y-3.5 text-xs font-medium">
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                  <div>
                    <h5 className="font-bold text-slate-900">SOP & Application Window</h5>
                    <p className="text-slate-500 font-medium text-[11px]">October - January (Winter Intake) / April - July (Summer Intake)</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                  <div>
                    <h5 className="font-bold text-slate-900">Dhaka Embassy Interview Slot Request</h5>
                    <p className="text-slate-500 font-medium text-[11px]">Book immediately upon university offer letter receipt to avoid slots backlog.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                  <div>
                    <h5 className="font-bold text-slate-900">Visa Processing Wait time</h5>
                    <p className="text-slate-500 font-medium text-[11px]">Typically takes 4 to 8 weeks after submitting passports in Dhaka.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification Seal & Legal Note */}
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Verified by Global Academy Hub
                </p>
                <p className="text-slate-400 font-semibold">Consultancy Reg #8841, Panthapath HQ Office, Dhaka</p>
              </div>
            </div>
            <div className="text-center md:text-right text-[10px] text-slate-400 leading-relaxed max-w-xs font-medium">
              This suitability report is generated based on self-disclosed metrics. For absolute validation, we recommend booking a human-consultant verification review.
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
