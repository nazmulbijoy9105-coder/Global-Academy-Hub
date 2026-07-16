/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, MessageSquare, LayoutDashboard, Compass, CreditCard, 
  MapPin, CheckCircle2, ArrowRight, UserCheck, 
  HelpCircle, GraduationCap, DollarSign, Calendar, ChevronDown, Info,
  Facebook, Instagram, Youtube, Twitter, Linkedin,
  LogOut, Download, Phone, Mail, Award, Loader2, Send, Plus, Trash2, Edit3, Check, Copy, MessageCircle,
  Mic, Square, Play, Volume2, Clock, BookOpen, RefreshCw, FileText, Filter, Search, X, Shield, Users, Bot, ExternalLink, Globe
} from "lucide-react";
import { User, Conversation, Message, Payment, ServiceTier, StudentProfile } from "./types";
import AuthModal from "./components/AuthModal";
import ReportViewer from "./components/ReportViewer";
import Logo from "./components/Logo";
import { jsPDF } from "jspdf";

const QUICK_QUESTIONS = [
  { text: "What are the best countries for Computer Science?", icon: "💻" },
  { text: "How much does it cost to study in Germany?", icon: "🇩🇪" },
  { text: "What IELTS score do I need for Sweden?", icon: "🇸🇪" },
  { text: "Explain German Blocked Account (Block Account).", icon: "🏦" },
  { text: "SOP writing tips for European universities.", icon: "📝" },
];

const FAQ_ITEMS = [
  {
    id: "blocked-account",
    question: "What is a German Blocked Account (Sperrkonto) and how does it work?",
    answer: "A blocked account is a mandatory special bank account for the German student visa. You must deposit €11,904 (required for the current academic years) to prove you can cover your living costs. Each month, €992 is released to your standard bank account once you arrive in Germany.",
    views: 1850,
    category: "Finance"
  },
  {
    id: "visa-requirements",
    question: "What are the general visa requirements for Schengen countries?",
    answer: "The key requirements include: (1) An official university Admission Letter, (2) Proof of sufficient financial funds (e.g. Blocked account, scholarships, or sponsor), (3) Valid travel and health insurance, (4) Academic transcripts/certificates, (5) English proficiency proof (IELTS or Medium of Instruction), and (6) A well-structured Statement of Purpose (SOP).",
    views: 1420,
    category: "Visa Requirements"
  },
  {
    id: "processing-times",
    question: "How long does student visa processing take from Bangladesh?",
    answer: "Visa processing times vary: Germany takes 6 to 12 weeks (requires physical interview at the Embassy in Dhaka). Sweden takes 4 to 8 weeks (processed online via the Swedish Migration Agency, biometric collection required). Finland/Estonia takes 4 to 6 weeks. Always begin applications at least 3 months in advance.",
    views: 2150,
    category: "Timeline"
  },
  {
    id: "ielts-vs-moi",
    question: "Is IELTS mandatory or is a Medium of Instruction (MOI) certificate sufficient?",
    answer: "While some universities accept an MOI if your Bachelor's degree was fully taught in English, major Schengen Embassies (specifically Germany, Sweden, and Denmark) strongly prefer or require an official IELTS score (minimum 6.0 or 6.5) to issue visas. Having an IELTS score significantly boosts your success rate.",
    views: 1980,
    category: "Academic Requirements"
  },
  {
    id: "part-time-work",
    question: "Can I work part-time while studying in Europe?",
    answer: "Yes, international students are legally permitted to work part-time: Germany allows 140 full days or 280 half days per year. Sweden has no official hourly cap, but maintaining studies is required (20 hours/week is typical). Most other Schengen states permit up to 20 hours per week.",
    views: 1350,
    category: "Student Life"
  },
  {
    id: "interview-prep",
    question: "What questions should I expect in the German/Schengen visa interview?",
    answer: "Embassies focus on: (1) Your specific reasons for choosing Europe instead of Bangladesh, (2) Your knowledge about your course modules and selected university, (3) Your funding plan (how you will support your studies), and (4) Your future career plans. Speak clearly and confidently in English.",
    views: 2450,
    category: "Interview Preparation"
  }
];

const SOP_TEMPLATES = [
  {
    id: "stem-rigor",
    title: "STEM & CS Academic Rigor",
    category: "STEM",
    icon: "💻",
    description: "Designed for engineering, CS, and natural sciences. Highlights prerequisite quantitative coursework, thesis projects, and technical credit alignment.",
    badge: "German Public Standard",
    difficulty: "Advanced Credit Matching Required",
    color: "violet",
    structure: [
      { section: "Paragraph 1: Core Technical Hook", detail: "Describe a profound technical challenge, real-world bug, or open research question that defines your academic focus." },
      { section: "Paragraph 2: Academic Foundations", detail: "Undergrad transcript breakdown, highlighting ECTS credit alignment, math, and theory prerequisite matches." },
      { section: "Paragraph 3: Practical & Research Pedigree", detail: "Bachelor thesis details, coding projects, lab research, publications, and technical stacks utilized." },
      { section: "Paragraph 4: Curricular Synergy", detail: "Selected university's specific research labs, elective modules, and faculty interests that match your background." },
      { section: "Paragraph 5: Professional Blueprint", detail: "Return strategy to Bangladesh, or European industrial research pathways in your specialized technology field." }
    ],
    prompt: `I want to draft a Statement of Purpose (SOP) for my target study using the "STEM & CS Academic Rigor" structure.

Please use the following outline:
- Paragraph 1: Core Technical Hook (technical challenge, motivation)
- Paragraph 2: Academic Foundations (credit matching, key undergraduate modules)
- Paragraph 3: Practical & Research Pedigree (thesis summary, coding projects, GitHub)
- Paragraph 4: Curricular Synergy (why this university, specific modules, and labs)
- Paragraph 5: Professional Blueprint (long-term career path, returning to Bangladesh or EU research)

Could you ask me 3 or 4 targeted questions one-by-one about my academic and project background so we can write this draft?`
  },
  {
    id: "business-mgmt",
    title: "MBA & Business Leadership",
    category: "Business",
    icon: "📈",
    description: "Best for business, finance, management, and economics. Focuses on professional progression, leadership, case studies, and career outcomes.",
    badge: "Schengen Business Approved",
    difficulty: "Requires Work Experience Focus",
    color: "emerald",
    structure: [
      { section: "Paragraph 1: Business Catalyst Hook", detail: "A real-world commercial challenge, market opportunity, or organizational dilemma you solved." },
      { section: "Paragraph 2: Managerial Foundations", detail: "Undergraduate business training or analytical background, combined with core industry achievements." },
      { section: "Paragraph 3: Leadership & Initiative Pedigree", detail: "Team management, process optimization, revenue growth, or corporate projects led by you." },
      { section: "Paragraph 4: Strategic Academic Fit", detail: "Why this business school, networking circles, Case Study methodology, and club memberships." },
      { section: "Paragraph 5: Executive Career Blueprint", detail: "Short-term (management consultant, analyst) and long-term (entrepreneurial, corporate executive) goals." }
    ],
    prompt: `I want to draft a Statement of Purpose (SOP) for a Business/MBA program using the "MBA & Business Leadership" structure.

Please use the following outline:
- Paragraph 1: Business Catalyst Hook (commercial challenge, motivation)
- Paragraph 2: Managerial Foundations (undergrad study, business achievements)
- Paragraph 3: Leadership & Initiative Pedigree (teamwork, process optimization, corporate projects)
- Paragraph 4: Strategic Academic Fit (why this business school, case studies, networking)
- Paragraph 5: Executive Career Blueprint (short-term and long-term career goals)

Could you ask me 3 or 4 targeted questions one-by-one about my professional and leadership background so we can write this draft?`
  },
  {
    id: "social-sci",
    title: "Humanities & Social Sciences",
    category: "Humanities",
    icon: "⚖️",
    description: "Tailored for sociology, development, policy, and law. Emphasizes critical thinking, qualitative methodologies, and societal impact.",
    badge: "Research Intensive",
    difficulty: "Focus on Theoretical Frameworks",
    color: "amber",
    structure: [
      { section: "Paragraph 1: Societal Catalyst Hook", detail: "A societal event, public policy crisis, or cultural discourse that motivated your academic interest." },
      { section: "Paragraph 2: Theoretical Foundations", detail: "Undergrad coursework, key literature, development theories, and seminars that shaped your perspective." },
      { section: "Paragraph 3: Methodological Pedigree", detail: "Fieldwork, qualitative interviews, statistical surveys, and independent research projects." },
      { section: "Paragraph 4: Research Alignment", detail: "Specific university research groups, faculty monographs, seminar topics, and local community outreach." },
      { section: "Paragraph 5: Social Impact Trajectory", detail: "Academic teaching, think-tank advisory roles, or leadership within international NGOs." }
    ],
    prompt: `I want to draft a Statement of Purpose (SOP) for a Humanities / Social Sciences program using the "Humanities & Social Sciences" structure.

Please use the following outline:
- Paragraph 1: Societal Catalyst Hook (societal event, policy failure, motivation)
- Paragraph 2: Theoretical Foundations (undergrad work, key theories, seminal authors)
- Paragraph 3: Methodological Pedigree (fieldwork, qualitative/quantitative methods, research)
- Paragraph 4: Research Alignment (why this university, matching professors, monographs)
- Paragraph 5: Social Impact Trajectory (career goals, NGOs, academic teaching)

Could you ask me 3 or 4 targeted questions one-by-one about my research interests and methodology background so we can write this draft?`
  },
  {
    id: "creative-arts",
    title: "Creative Arts & Design Portfolio",
    category: "Creative",
    icon: "🎨",
    description: "Best for architecture, UI/UX, design, and media. Focuses on creative philosophy, portfolio analysis, and artistic voice.",
    badge: "SOP + Portfolio Synergy",
    difficulty: "Portfolio Walkthrough Focus",
    color: "rose",
    structure: [
      { section: "Paragraph 1: Artistic Manifesto Hook", detail: "Your personal creative philosophy, defining aesthetic experience, or design principles." },
      { section: "Paragraph 2: Aesthetic Foundations", detail: "Academic art/design training, exposure to design history, and spatial or visual mastery." },
      { section: "Paragraph 3: Portfolio deep-dive", detail: "Detailed walk-through of 2 key portfolio pieces (conceptualization, iteration, and final execution)." },
      { section: "Paragraph 4: Creative & Studio Fit", detail: "Studio culture at the university, equipment access, critique circles, and design philosophy." },
      { section: "Paragraph 5: Aesthetic Trajectory", detail: "Future as creative director, studio founder, exhibiting artist, or design leader." }
    ],
    prompt: `I want to draft a Statement of Purpose (SOP) for a Creative Arts/Design program using the "Creative Arts & Design Portfolio" structure.

Please use the following outline:
- Paragraph 1: Artistic Manifesto Hook (creative philosophy, aesthetic principles)
- Paragraph 2: Aesthetic Foundations (academic training, history, spatial/visual skills)
- Paragraph 3: Portfolio Deep-Dive (explaining 2 major portfolio projects)
- Paragraph 4: Creative & Studio Fit (studio culture, specific equipment, critique circles)
- Paragraph 5: Aesthetic Trajectory (career plans, creative director, exhibition goals)

Could you ask me 3 or 4 targeted questions one-by-one about my portfolio projects and design style so we can write this draft?`
  }
];

const ALL_DOCUMENTS = [
  {
    id: "passport",
    titleEn: "Valid Passport",
    titleBn: "বৈধ পাসপোর্ট ও কপি",
    descEn: "Valid passport with at least 2 empty pages. Valid for at least 3 months beyond your departure date from Schengen zone. Original plus photocopies of biographical pages.",
    descBn: "ন্যূনতম ৩ মাস মেয়াদ এবং কমপক্ষে ২টি খালি পৃষ্ঠাসহ বৈধ মূল পাসপোর্ট ও বায়ো ডাটা পেজের স্পষ্ট ফটোকপি।",
    category: "mandatory"
  },
  {
    id: "photos",
    titleEn: "Biometric Passport Photos",
    titleBn: "বায়োমেট্রিক পাসপোর্ট সাইজ ছবি",
    descEn: "3 recent biometric-compliant passport size photos (35x45mm) with a light gray or white background, taken within the last 6 months.",
    descBn: "ইউরোপীয় স্ট্যান্ডার্ডের ৩ কপি সাম্প্রতিক রঙ্গিন ছবি (৩৫×৪৫ মিমি, সাদা ব্যাকগ্রাউন্ড, মুখমণ্ডল স্পষ্ট দেখা যেতে হবে)।",
    category: "mandatory"
  },
  {
    id: "application_form",
    titleEn: "Visa Application Form",
    titleBn: "ভিসা আবেদন ফরম",
    descEn: "Fully completed and signed national visa application form. (VIDEX form printed for Germany, or online portal application summary for other states).",
    descBn: "সঠিকভাবে এবং সম্পূর্ণ পূরণকৃত ও স্বাক্ষরিত ভিসা অ্যাপ্লিকেশন ফরম (জার্মানির জন্য VIDEX ফরম, অন্যান্য দেশের জন্য অনলাইন পোর্টাল প্রিন্টআউট)।",
    category: "mandatory"
  },
  {
    id: "insurance",
    titleEn: "Travel Health Insurance",
    titleBn: "ভ্রমণ স্বাস্থ্য বীমা",
    descEn: "Schengen travel medical insurance with a minimum coverage of €30,000, valid for the entire initial stay until university enrollment.",
    descBn: "অনুমোদিত বীমা কোম্পানি থেকে সংগৃহীত ন্যূনতম ৩০,০০০ ইউরো কাভারেজের ভ্রমণ স্বাস্থ্য বীমা পলিসি।",
    category: "mandatory"
  },
  {
    id: "acceptance_letter",
    titleEn: "University Admission Letter",
    titleBn: "বিশ্ববিদ্যালয় ভর্তির অফার লেটার",
    descEn: "Official, unconditional or conditional Letter of Admission from your target Schengen university outlining course duration, starting date, and language of instruction.",
    descBn: "জার্মান বা ইউরোপীয় বিশ্ববিদ্যালয় থেকে প্রাপ্ত অফিশিয়াল অফার লেটার বা ভর্তির কনফার্মেশন পত্র (কোর্সের মেয়াদ ও ভাষা উল্লেখ থাকতে হবে)।",
    category: "mandatory"
  },
  {
    id: "academic_certificates",
    titleEn: "Attested Academic Certificates",
    titleBn: "সত্যায়িত শিক্ষাগত যোগ্যতা সনদ",
    descEn: "All high school certificates, transcripts, and diplomas (SSC, HSC, Bachelor's). Must be attested by the Education Ministry, Board, and Foreign Ministry of Bangladesh.",
    descBn: "মাধ্যমিক, উচ্চ মাধ্যমিক এবং ব্যাচেলর ডিগ্রির সকল সার্টিফিকেট ও ট্রান্সক্রিপ্ট (শিক্ষা বোর্ড, শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয় দ্বারা সত্যায়িত)।",
    category: "academic"
  },
  {
    id: "language_proficiency",
    titleEn: "Language Proficiency Proof",
    titleBn: "ভাষা দক্ষতার প্রমাণ সনদ",
    descEn: "Official IELTS test report certificate (or equivalent). Embassies strongly prefer an IELTS score of 6.0-6.5+ for English-medium courses.",
    descBn: "অফিসিয়াল IELTS স্কোর কার্ড বা ভাষা দক্ষতার সার্টিফিকেট (ইংরেজি মাধ্যমে পড়তে চাইলে শেনজেন দূতাবাস সাধারণত ন্যূনতম ৬.০ বা ৬.৫ স্কোর প্রত্যাশা করে)।",
    category: "academic"
  },
  {
    id: "cv",
    titleEn: "Curriculum Vitae (CV)",
    titleBn: "জীবনবৃত্তান্ত (ইউরোপাস সিভি)",
    descEn: "A professional, updated CV structured in the Europass format, detailing your educational history, academic projects, technical skills, and work history.",
    descBn: "ইউরোপীয় স্ট্যান্ডার্ডের (Europass) হালনাগাদ ও প্রফেশনাল একাডেমিক জীবনবৃত্তান্ত (সিভি)।",
    category: "academic"
  },
  {
    id: "sop",
    titleEn: "Statement of Purpose (SOP)",
    titleBn: "উদ্দেশ্য বিবৃতি (SOP)",
    descEn: "A compelling personal statement explaining your motivations to study in Europe, course module connection, university selection, and return plans to Bangladesh.",
    descBn: "একটি আকর্ষণীয় ও সুসংগঠিত উদ্দেশ্য বিবৃতি (SOP), যা আপনার ক্যারিয়ারের লক্ষ্য এবং ইউরোপে পড়ার যৌক্তিকতা তুলে ধরে।",
    category: "academic"
  },
  {
    id: "birth_certificate",
    titleEn: "Birth Registration Certificate",
    titleBn: "জন্ম নিবন্ধন সনদ",
    descEn: "Online verified, English-translated Birth Registration Certificate with a valid digital QR code, or National ID Card copy.",
    descBn: "অনলাইনে ভেরিফাইড এবং ইংরেজিতে অনুবাদকৃত ডিজিটাল কিউআর কোডসহ জন্ম নিবন্ধন সনদ অথবা জাতীয় পরিচয়পত্রের কপি।",
    category: "optional"
  },
  {
    id: "germany_blocked_account",
    titleEn: "German Blocked Account (Sperrkonto)",
    titleBn: "জার্মান ব্লকড অ্যাকাউন্ট নিশ্চিতকরণ",
    descEn: "Official confirmation of €11,904 deposited in a licensed German blocked account provider (such as Expatrio, Fintiba, or Coracle) to cover annual living costs.",
    descBn: "জার্মানিতে ১ বছরের জীবনযাত্রার ব্যয়ের জন্য নির্ধারিত ১১,৯০৪ ইউরো যেকোনো অনুমোদিত প্রোভাইডারে (Expatrio/Fintiba) ব্লকড করার চূড়ান্ত প্রুফ বা সার্টিফিকেট।",
    category: "financial",
    countries: ["Germany"]
  },
  {
    id: "sweden_financials",
    titleEn: "Sweden Personal Bank Statement",
    titleBn: "সুইডিশ ব্যক্তিগত ব্যাংক বিবরণী",
    descEn: "Bank statements showing at least SEK 10,314 per month of stay (~SEK 103,140 for a standard 10-month academic year) in your personal account to cover maintenance.",
    descBn: "সুইডেনের মাইগ্রেশন এজেন্সির নিয়ম অনুযায়ী প্রতি মাসের খরচের প্রমাণ হিসেবে নিজের ব্যাংক অ্যাকাউন্টে কমপক্ষে ১০৩,১৪০ SEK সমপরিমাণ টাকা জমার ৩-৬ মাসের স্টেটমেন্ট।",
    category: "financial",
    countries: ["Sweden"]
  },
  {
    id: "finland_financials",
    titleEn: "Finland Secure Funding Proof",
    titleBn: "ফিনল্যান্ডে জীবনযাত্রার ব্যয়ের তহবিল",
    descEn: "Bank statement showing a minimum of €800 per month (€9,600 for a 1-year visa) in the student's personal account, plus paid tuition fee transaction receipts.",
    descBn: "ফিনল্যান্ডে বসবাসের খরচের প্রমাণ হিসেবে শিক্ষার্থীর ব্যক্তিগত অ্যাকাউন্টে কমপক্ষে ৯,৬০০ ইউরো থাকার ব্যাংক স্টেটমেন্ট এবং বিশ্ববিদ্যালয়ের টিউশন ফি পরিশোধের স্লিপ।",
    category: "financial",
    countries: ["Finland"]
  },
  {
    id: "poland_financials",
    titleEn: "Poland Living & Tuition Funds",
    titleBn: "পোল্যান্ড জীবনযাত্রা ও টিউশন ফান্ড",
    descEn: "Proof of paid tuition fees for the first year, bank statements of student or sponsor showing living funds (~PLN 800/month), plus travel ticket reserves (~PLN 2,500).",
    descBn: "পোল্যান্ডে প্রথম বছরের টিউশন ফি পরিশোধের প্রমাণপত্র এবং জীবনযাত্রার ব্যয়ের জন্য ব্যাংক অ্যাকাউন্টে পর্যাপ্ত টাকার ৩ মাসের ব্যাংক স্টেটমেন্ট ও স্পন্সরের হলফনামা।",
    category: "financial",
    countries: ["Poland"]
  },
  {
    id: "recommendation_letters",
    titleEn: "Letters of Recommendation",
    titleBn: "সুপারিশপত্র (রিকমেন্ডেশন লেটার)",
    descEn: "At least 2 academic recommendation letters signed by your undergraduate university professors on official letterhead.",
    descBn: "পূর্ববর্তী বিশ্ববিদ্যালয়ের অধ্যাপক বা শিক্ষকদের কাছ থেকে অফিসিয়াল প্যাডে স্বাক্ষরিত কমপক্ষে ২টি একাডেমিক সুপারিশপত্র বা রিকমেন্ডেশন লেটার।",
    category: "optional",
    degrees: ["Master's", "PhD"]
  },
  {
    id: "thesis_abstract",
    titleEn: "Bachelor's Thesis or Abstract",
    titleBn: "ব্যাচেলর থিসিস বা পাবলিকেশন",
    descEn: "A copy of your undergraduate thesis abstract, research project summary, or any peer-reviewed scientific publication. (Mandatory for PhD).",
    descBn: "ব্যাচেলর থিসিসের সারসংক্ষেপ (অ্যাবস্ট্রাক্ট), রিসার্চ প্রজেক্ট সামারি বা কোনো বৈজ্ঞানিক প্রকাশনার কপি (পিএইচডির জন্য এটি অত্যন্ত গুরুত্বপূর্ণ)।",
    category: "optional",
    degrees: ["Master's", "PhD"]
  },
  {
    id: "phd_supervisor_agreement",
    titleEn: "Doctoral Supervisor Invitation Letter",
    titleBn: "পিএইচডি সুপারভাইজার আমন্ত্রণ পত্র",
    descEn: "A formal, signed acceptance or invitation letter from your assigned supervisor/professor at the target European university indicating research supervision.",
    descBn: "টার্গেট ইউরোপীয় বিশ্ববিদ্যালয়ের নিযুক্ত সুপারভাইজার বা অধ্যাপকের সই করা অফিশিয়াল আমন্ত্রণ বা সুপারভিশন চুক্তি পত্র।",
    category: "mandatory",
    degrees: ["PhD"]
  },
  {
    id: "work_experience",
    titleEn: "Work Experience Certificates",
    titleBn: "কাজের অভিজ্ঞতা এবং গ্যাপ সার্টিফিকেট",
    descEn: "Official experience letters, appointment letters, or pay slips from previous employers to justify any academic gap since graduation.",
    descBn: "গ্র্যাজুয়েশনের পর কোনো গ্যাপ থাকলে তা জাস্টিফাই করতে পূর্ববর্তী চাকরিদাতার কাছ থেকে সংগৃহীত কাজের অভিজ্ঞতার অফিসিয়াল লেটার বা পে-স্লিপ।",
    category: "optional"
  }
];

const ATTESTATION_DEADLINES: Record<string, Record<string, { days: string; alertEn: string; alertBn: string }>> = {
  Germany: {
    academic_certificates: {
      days: "15-20 days",
      alertEn: "⚠️ German Embassy strictly requires physical stamps from Board, Ministry of Education, and MoFA of Bangladesh (takes 15-20 days). Secure this before attempting to book a visa slot in Dhaka.",
      alertBn: "⚠️ জার্মানির জন্য বোর্ড, শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয় (MoFA) থেকে ফিজিক্যাল সত্যায়ন আবশ্যক (১৫-২০ দিন)। ঢাকার ভিসা স্লট খোঁজার আগেই এটি শেষ করুন।"
    },
    germany_blocked_account: {
      days: "5-10 days",
      alertEn: "⚠️ Blocked Account (€11,904) bank transfers from Bangladesh take 5-10 business days via student file. Must complete at least 2 months prior to your visa interview.",
      alertBn: "⚠️ বাংলাদেশ থেকে স্টুডেন্ট ফাইলের মাধ্যমে ১১,৯০৪ ইউরো ব্লকড অ্যাকাউন্টে ট্রান্সফার হতে ৫-১০ কার্যদিবস সময় লাগে। ইন্টারভিউয়ের অন্তত ২ মাস আগে করুন।"
    },
    passport: {
      days: "30+ days",
      alertEn: "⚠️ German Embassy checks passport names against academic certificates meticulously. Any spelling corrections in Dhaka take 30+ days.",
      alertBn: "⚠️ পাসপোর্টের নামের বানান সার্টিফিকেটের সাথে হুবহু মিলতে হবে। সংশোধন করতে হলে ঢাকার অফিসে ৩০+ দিন সময় লাগতে পারে।"
    }
  },
  Sweden: {
    academic_certificates: {
      days: "10-15 days",
      alertEn: "⚠️ High-resolution original color PDF scans must be uploaded to UniversityAdmissions.se. Ensure you get these ready 15 days before the submission deadline.",
      alertBn: "⚠️ সুইডেন আবেদনের জন্য মূল মার্কশিট ও সনদের রঙিন হাই-রেজোলিউশন পিডিএফ স্ক্যান সাবমিট করতে হবে। ডেডলাইনের ১৫ দিন আগেই প্রস্তুত রাখুন।"
    },
    sweden_financials: {
      days: "90 days",
      alertEn: "⚠️ Sweden inspects personal funding origins. Keep the SEK 103,140 in your personal bank account untouched for 90 days to avoid instant rejection.",
      alertBn: "⚠️ সুইডিশ মাইগ্রেশন বোর্ড হুট করে জমা দেওয়া বড় অ্যামাউন্ট সন্দেহ করে। কমপক্ষে ৯০ দিন ব্যাংকে টাকা স্থির রাখুন।"
    }
  },
  Finland: {
    academic_certificates: {
      days: "15-20 days",
      alertEn: "⚠️ Finland requires your academic certificates legalized by the Bangladesh Foreign Ministry (MoFA) before submitting student permit files.",
      alertBn: "⚠️ ফিনল্যান্ডের রেসিডেন্স পারমিট আবেদনের জন্য একাডেমিক পেপারস বাংলাদেশ পররাষ্ট্র মন্ত্রণালয় (MoFA) থেকে সত্যায়িত হওয়া বাধ্যতামূলক।"
    },
    finland_financials: {
      days: "30-60 days",
      alertEn: "⚠️ Sponsor balance (€9,600) must remain strictly inside student's personal individual bank account (no joint accounts allowed). Keep funds matured for 30-60 days.",
      alertBn: "⚠️ স্পন্সর ব্যালেন্স অবশ্যই শিক্ষার্থীর একক ব্যক্তিগত অ্যাকাউন্টে থাকতে হবে (যৌথ অ্যাকাউন্ট গ্রহণযোগ্য নয়)। অন্তত ৩০-৬০ দিন টাকা রাখুন।"
    }
  },
  Poland: {
    academic_certificates: {
      days: "30-45 days",
      alertEn: "⚠️ Poland student documents require super-legalization/Apostille. Since Poland has no active student visa office in Dhaka, you must send certificates to New Delhi (30-45 days).",
      alertBn: "⚠️ পোল্যান্ডের জন্য অ্যাপোস্টিল বা সুপার-লিগালাইজেশন প্রয়োজন। ঢাকায় দূতাবাস না থাকায় এটি দিল্লি পাঠিয়ে করাতে হয় (৩০-৪৫ দিন সময় লাগে)।"
    },
    poland_financials: {
      days: "30-45 days",
      alertEn: "⚠️ Poland requires first-year tuition paid upfront, plus secure double-entry Indian visa to attend interview in New Delhi. Allow 30-45 days for Indian visa.",
      alertBn: "⚠️ পোল্যান্ডে প্রথম বছরের টিউশন ফি আগেই দিতে হয় এবং দিল্লিতে ইন্টারভিউ দেওয়ার জন্য ভারতের ডাবল-এন্ট্রি ভিসা রেডি করতে ৩০-৪৫ দিন সময় লাগে।"
    }
  }
};

export default function App() {
  // --- States ---
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard" | "pricing" | "tracker" | "payments" | "channels" | "simulator" | "checklist" | "about">("chat");
  const [language, setLanguage] = useState<"en" | "bn">("en");

  // --- Contact / Counseling Form States ---
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactQuestion, setContactQuestion] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  // Conversations list
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  // Auth & Payment Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<ServiceTier | null>(null);
  
  // Payment Form states
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "stripe">("bkash");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentCard, setPaymentCard] = useState("");
  const [paymentCvc, setPaymentCvc] = useState("");
  const [paymentExpiry, setPaymentExpiry] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Saved payments list
  const [payments, setPayments] = useState<Payment[]>([]);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "Nazmul Bijoy",
    previousDegree: "B.Sc. in Computer Science",
    previousInstitution: "Dhaka University",
    targetCountry: "Germany",
    preferredCountries: ["Germany"],
    targetDegree: "Master's",
    targetSubject: "Computer Science",
    desiredFields: ["Computer Science"],
    gpa: "3.65",
    budget: "medium",
    budgetAmount: "৳10L - ৳15L / year",
    ielts: "6.5",
    cvFileName: "",
    cvFileSize: "",
    cvParsed: false,
    cvSkills: [],
    lastUpdated: Date.now()
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // --- Email Alerts State & Handlers ---
  const [emailAlerts, setEmailAlerts] = useState<Record<string, boolean>>({});
  const [emailAlertEmails, setEmailAlertEmails] = useState<Record<string, string>>({});
  const [emailAlertInputVal, setEmailAlertInputVal] = useState<string>("");
  const [emailAlertLogs, setEmailAlertLogs] = useState<any[]>([]);
  const [emailSubscriptions, setEmailSubscriptions] = useState<any[]>([]);

  // Initialize email alert input value when user changes or loads
  useEffect(() => {
    if (user?.email) {
      setEmailAlertInputVal(user.email);
    } else {
      setEmailAlertInputVal("student@globalacademyhub.com"); // default for testing/demo
    }
  }, [user]);

  // Sync data on load and whenever tab switches to checklist
  useEffect(() => {
    fetchEmailAlertData();
  }, [activeTab]);

  const fetchEmailAlertData = async () => {
    try {
      const subRes = await fetch("/api/email-alerts/subscriptions");
      if (subRes.ok) {
        const subs = await subRes.json();
        setEmailSubscriptions(subs);
        
        const activeAlerts: Record<string, boolean> = {};
        const activeEmails: Record<string, string> = {};
        subs.forEach((s: any) => {
          activeAlerts[s.docId] = true;
          activeEmails[s.docId] = s.email;
        });
        setEmailAlerts(activeAlerts);
        setEmailAlertEmails(activeEmails);
      }

      const logRes = await fetch("/api/email-alerts/logs");
      if (logRes.ok) {
        const logs = await logRes.json();
        setEmailAlertLogs(logs);
      }
    } catch (e) {
      console.error("Error fetching email alert data:", e);
    }
  };

  const handleToggleEmailAlert = async (docItem: any, deadlineInfo: any) => {
    const isCurrentlyEnabled = emailAlerts[docItem.id];
    
    // If we're enabling, we need an email address.
    const emailToUse = emailAlertEmails[docItem.id] || emailAlertInputVal;

    if (!isCurrentlyEnabled && !emailToUse) {
      addToast(language === "bn" ? "দয়া করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন।" : "Please enter a valid email address.", "error");
      setEmailAlerts(prev => ({ ...prev, [docItem.id]: true }));
      return;
    }

    try {
      const res = await fetch("/api/email-alerts/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          docId: docItem.id,
          enabled: !isCurrentlyEnabled,
          docTitle: docItem.titleEn,
          docTitleBn: docItem.titleBn,
          country: profile.targetCountry,
          days: deadlineInfo.days,
          alertEn: deadlineInfo.alertEn,
          alertBn: deadlineInfo.alertBn
        })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        fetchEmailAlertData();
      } else {
        addToast(language === "bn" ? "এলার্ট আপডেট করতে সমস্যা হয়েছে।" : "Failed to update email alert.", "error");
      }
    } catch (e) {
      console.error(e);
      addToast(language === "bn" ? "সার্ভার কানেকশন এরর।" : "Server connection error.", "error");
    }
  };

  const handleEmailAlertAddressChange = (docId: string, value: string) => {
    setEmailAlertInputVal(value);
    setEmailAlertEmails(prev => ({ ...prev, [docId]: value }));
  };

  const handleSaveEmailAlertAddress = async (docItem: any, deadlineInfo: any) => {
    const emailToUse = emailAlertEmails[docItem.id] || emailAlertInputVal;
    if (!emailToUse || !emailToUse.includes("@")) {
      addToast(language === "bn" ? "দয়া করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন।" : "Please enter a valid email address.", "error");
      return;
    }

    try {
      const res = await fetch("/api/email-alerts/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          docId: docItem.id,
          enabled: true,
          docTitle: docItem.titleEn,
          docTitleBn: docItem.titleBn,
          country: profile.targetCountry,
          days: deadlineInfo.days,
          alertEn: deadlineInfo.alertEn,
          alertBn: deadlineInfo.alertBn
        })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        fetchEmailAlertData();
      } else {
        addToast("Failed to save email address.", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Server error.", "error");
    }
  };

  const handleTriggerTestEmail = async (docId: string, email: string) => {
    try {
      const res = await fetch("/api/email-alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, email })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        fetchEmailAlertData();
      } else {
        addToast("Failed to trigger test email.", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Server connection error during test email dispatch.", "error");
    }
  };

  // --- Visa intelligence and Destination Info States ---
  const [selectedDestinationCountry, setSelectedDestinationCountry] = useState<string>("");
  const [destinationInfoCache, setDestinationInfoCache] = useState<Record<string, { text: string; sources: { title: string; url: string }[] }>>({});
  const [destinationInfoLoading, setDestinationInfoLoading] = useState<boolean>(false);
  const [destinationInfoError, setDestinationInfoError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const [destinationAcademicCache, setDestinationAcademicCache] = useState<Record<string, { text: string; sources: { title: string; url: string }[] }>>({});
  const [destinationAcademicLoading, setDestinationAcademicLoading] = useState<boolean>(false);
  const [destinationAcademicError, setDestinationAcademicError] = useState<string | null>(null);

  const destinationInfoCacheRef = useRef<Record<string, { text: string; sources: { title: string; url: string }[] }>>({});
  const destinationAcademicCacheRef = useRef<Record<string, { text: string; sources: { title: string; url: string }[] }>>({});
  
  // Synchronize ref to prevent useEffect dependency loop
  useEffect(() => {
    destinationInfoCacheRef.current = destinationInfoCache;
  }, [destinationInfoCache]);

  useEffect(() => {
    destinationAcademicCacheRef.current = destinationAcademicCache;
  }, [destinationAcademicCache]);

  // Sync selected destination country with profile preferred countries
  useEffect(() => {
    const preferred = profile.preferredCountries || [];
    if (preferred.length > 0) {
      if (!selectedDestinationCountry || !preferred.includes(selectedDestinationCountry)) {
        setSelectedDestinationCountry(preferred[0]);
      }
    } else {
      setSelectedDestinationCountry(profile.targetCountry || "Germany");
    }
  }, [profile.preferredCountries, profile.targetCountry]);

  // Fetch destination visa intelligence dynamically when selection changes
  useEffect(() => {
    if (!selectedDestinationCountry) return;
    
    const fetchVisaInfo = async () => {
      if (destinationInfoCacheRef.current[selectedDestinationCountry]) return;
      
      setDestinationInfoLoading(true);
      setDestinationInfoError(null);
      
      try {
        const res = await fetch("/api/destination-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedDestinationCountry }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch destination intelligence.");
        }
        
        const result = await res.json();
        setDestinationInfoCache(prev => ({
          ...prev,
          [selectedDestinationCountry]: {
            text: result.text,
            sources: result.sources || []
          }
        }));
      } catch (err: any) {
        console.error("Error fetching destination visa info:", err);
        setDestinationInfoError(err.message || "Could not retrieve visa data.");
      } finally {
        setDestinationInfoLoading(false);
      }
    };

    fetchVisaInfo();
  }, [selectedDestinationCountry, reloadTrigger]);

  // Fetch destination academic and career intelligence dynamically when selection changes
  useEffect(() => {
    if (!selectedDestinationCountry) return;
    
    const fetchAcademicInfo = async () => {
      if (destinationAcademicCacheRef.current[selectedDestinationCountry]) return;
      
      setDestinationAcademicLoading(true);
      setDestinationAcademicError(null);
      
      try {
        const res = await fetch("/api/destination-academic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedDestinationCountry }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch academic intelligence.");
        }
        
        const result = await res.json();
        setDestinationAcademicCache(prev => ({
          ...prev,
          [selectedDestinationCountry]: {
            text: result.text,
            sources: result.sources || []
          }
        }));
      } catch (err: any) {
        console.error("Error fetching destination academic info:", err);
        setDestinationAcademicError(err.message || "Could not retrieve academic data.");
      } finally {
        setDestinationAcademicLoading(false);
      }
    };

    fetchAcademicInfo();
  }, [selectedDestinationCountry, reloadTrigger]);

  // Markdown rendering helper functions
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-slate-900">{part}</strong>;
      }
      return part;
    });
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display font-bold text-sm text-slate-900 mt-4 mb-2">
            {parseBoldText(line.replace("### ", ""))}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-display font-bold text-base text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-100">
            {parseBoldText(line.replace("## ", ""))}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="font-display font-bold text-lg text-slate-900 mt-6 mb-3">
            {parseBoldText(line.replace("# ", ""))}
          </h2>
        );
      }
      const listMatch = line.match(/^[\*\-]\s+(.*)/);
      if (listMatch) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-600 leading-relaxed mb-1.5">
            {parseBoldText(listMatch[1])}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  const handleExportIntelligence = (type: "visa" | "academic") => {
    const country = selectedDestinationCountry || "Germany";
    if (type === "visa") {
      const data = destinationInfoCache[country];
      if (!data) {
        addToast("No visa intelligence data available to export yet.", "info");
        return;
      }
      console.log(`=== EXPORTED SCHENGEN VISA INTELLIGENCE (${country.toUpperCase()}) ===`);
      console.log(`Country: ${country}`);
      console.log(`Date: ${new Date().toLocaleString()}`);
      console.log(`Report:\n${data.text}`);
      if (data.sources && data.sources.length > 0) {
        console.log("Sources:");
        data.sources.forEach(s => console.log(`- ${s.title}: ${s.url}`));
      }
      console.log("=================================================");
      addToast(`Visa intelligence for ${country} logged to console!`, "success");
    } else {
      const data = destinationAcademicCache[country];
      if (!data) {
        addToast("No academic prospects data available to export yet.", "info");
        return;
      }
      console.log(`=== EXPORTED ACADEMIC & CAREER PROSPECTS (${country.toUpperCase()}) ===`);
      console.log(`Country: ${country}`);
      console.log(`Date: ${new Date().toLocaleString()}`);
      console.log(`Report:\n${data.text}`);
      if (data.sources && data.sources.length > 0) {
        console.log("Sources:");
        data.sources.forEach(s => console.log(`- ${s.title}: ${s.url}`));
      }
      console.log("=================================================");
      addToast(`Academic prospects for ${country} logged to console!`, "success");
    }
  };

  const [showReportViewer, setShowReportViewer] = useState(false);
  const [cvIsScanning, setCvIsScanning] = useState(false);
  const [cvScanProgress, setCvScanProgress] = useState(0);
  const [cvScanStep, setCvScanStep] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("");
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);
  const [faqSortOrder, setFaqSortOrder] = useState<string>("default");
  const [gpaError, setGpaError] = useState<string | null>(null);
  const [ieltsError, setIeltsError] = useState<string | null>(null);
  
  // --- SOP Templates Library States ---
  const [selectedSopCategory, setSelectedSopCategory] = useState<string>("all");
  const [searchSopQuery, setSearchSopQuery] = useState<string>("");
  const [expandedSopId, setExpandedSopId] = useState<string | null>(null);

  // --- Document Checklist States ---
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("checked_documents");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [reviewRequestedDocs, setReviewRequestedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("review_requested_docs");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [checklistFilter, setChecklistFilter] = useState<"all" | "mandatory" | "financial" | "academic" | "optional">("all");
  const [checklistSearchQuery, setChecklistSearchQuery] = useState<string>("");
  const [targetIntake, setTargetIntake] = useState<string>("october_2026");
  const [showMobileSessions, setShowMobileSessions] = useState(false);
  const [showMobileTemplates, setShowMobileTemplates] = useState(false);

  useEffect(() => {
    localStorage.setItem("checked_documents", JSON.stringify(checkedDocs));
  }, [checkedDocs]);

  useEffect(() => {
    localStorage.setItem("review_requested_docs", JSON.stringify(reviewRequestedDocs));
  }, [reviewRequestedDocs]);
  
  // --- Interview Simulator States ---
  const [practiceAttempts, setPracticeAttempts] = useState<Array<{
    id: string;
    question: string;
    transcript: string;
    audioUrl?: string;
    feedback?: string;
    scores?: { fluency: number; relevance: number; grammar: number; overall: number };
    timestamp: string;
    durationSec: number;
    status: "pending" | "reviewed";
  }>>([]);
  const [currentSimQuestion, setCurrentSimQuestion] = useState<string>(
    "Why do you want to study in Germany/Europe instead of Bangladesh?"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcribingText, setTranscribingText] = useState("");
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

  // --- Chat Voice Message States & Refs ---
  const [isChatRecording, setIsChatRecording] = useState(false);
  const [chatRecordingDuration, setChatRecordingDuration] = useState(0);
  const [chatVoiceLanguage, setChatVoiceLanguage] = useState<"en" | "bn">("en");
  const [currentlyPlayingAudioMsgId, setCurrentlyPlayingAudioMsgId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const chatMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chatAudioChunksRef = useRef<Blob[]>([]);
  const chatTimerIntervalRef = useRef<any>(null);
  const chatSpeechRecognitionRef = useRef<any>(null);
  const chatAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatStartTimeRef = useRef<number>(0);

  // Toast notices
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  // --- Initial Hydration & Listeners ---
  useEffect(() => {
    // Load User
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Payments
    const storedPayments = localStorage.getItem("payments");
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    } else {
      // Seed default payment if empty to look alive
      const seedPayments: Payment[] = [
        {
          id: "PAY-54891",
          userId: "demo-user",
          tier: "entry",
          amount: 30,
          method: "bkash",
          phone: "+8801841800841",
          status: "completed",
          timestamp: Date.now() - 86400000 * 2,
        }
      ];
      localStorage.setItem("payments", JSON.stringify(seedPayments));
      setPayments(seedPayments);
    }

    // Load Conversations
    const storedConvs = localStorage.getItem("conversations");
    if (storedConvs) {
      const parsed = JSON.parse(storedConvs) as Conversation[];
      setConversations(parsed);
      if (parsed.length > 0) {
        // Set the active one or first one
        const active = parsed.find(c => c.active) || parsed[0];
        setActiveConvId(active.id);
      }
    } else {
      // Create initial guest conversation
      createInitialConversation();
    }

    // Load Student Profile
    const storedProfile = localStorage.getItem("student_profile");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile(prev => ({
          ...prev,
          ...parsed,
          preferredCountries: parsed.preferredCountries || [parsed.targetCountry || "Germany"],
          desiredFields: parsed.desiredFields || [parsed.targetSubject || "Computer Science"],
        }));
      } catch (err) {
        console.error("Error loading student profile:", err);
      }
    }

    // Load Interview Practice Attempts
    const storedAttempts = localStorage.getItem("practice_attempts");
    if (storedAttempts) {
      setPracticeAttempts(JSON.parse(storedAttempts));
    }
  }, []);

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem("practice_attempts", JSON.stringify(practiceAttempts));
  }, [practiceAttempts]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId, chatLoading]);

  // --- Helper: Toasts ---
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Helper: Conversation Setup ---
  const createInitialConversation = () => {
    const initialConv: Conversation = {
      id: "conv-" + Math.floor(Math.random() * 100000),
      userId: user?.id || "guest",
      title: "New AI Advisory Session",
      active: true,
      messages: [
        {
          id: "msg-welcome",
          role: "assistant",
          content: "Assalamu Alaikum! Welcome to Global Academy Hub. I am Global Academy Hub AI, your dedicated Europe study and visa expert.\n\nI can help you shortlist universities, estimate blocked accounts, format SOPs, and prepare for interviews. \n\nHow can I help you take your first step towards Europe today?",
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations([initialConv]);
    setActiveConvId(initialConv.id);
  };

  const handleCreateNewConversation = () => {
    const newConv: Conversation = {
      id: "conv-" + Math.floor(Math.random() * 100000),
      userId: user?.id || "guest",
      title: "Advisory Session #" + (conversations.length + 1),
      active: true,
      messages: [
        {
          id: "msg-" + Math.floor(Math.random() * 100000),
          role: "assistant",
          content: "Hello! I am ready for another advisory session. What European country, course, or visa query is on your mind?",
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Set all others to inactive
    const updated = conversations.map(c => ({ ...c, active: false }));
    setConversations([newConv, ...updated]);
    setActiveConvId(newConv.id);
    addToast("Started new advisory conversation", "info");
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConvId === id) {
      if (filtered.length > 0) {
        setActiveConvId(filtered[0].id);
      } else {
        createInitialConversation();
      }
    }
    addToast("Conversation deleted", "info");
  };

  const handleLoadSopTemplate = (template: typeof SOP_TEMPLATES[0]) => {
    let currentConvId = activeConvId;
    if (!currentConvId || conversations.length === 0) {
      const newConv: Conversation = {
        id: "conv-" + Math.floor(Math.random() * 100000),
        userId: user?.id || "guest",
        title: `${template.title} Draft`,
        active: true,
        messages: [
          {
            id: "msg-" + Math.floor(Math.random() * 100000),
            role: "assistant",
            content: `I have prepared the "${template.title}" outline for you. Let's work together to draft an exceptional Statement of Purpose! To begin, look at the prompt pre-loaded in your message bar below, customize it, and hit Send.`,
            timestamp: Date.now()
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updated = conversations.map(c => ({ ...c, active: false }));
      setConversations([newConv, ...updated]);
      setActiveConvId(newConv.id);
    } else {
      // Set active conversation welcome if it's currently empty or has just been created
      addToast(`"${template.title}" structure loaded into your chat input!`, "success");
    }
    setInputMessage(template.prompt);
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  // --- Chat Message Sender ---
  const handleSendMessage = async (text: string, voiceOptions?: { audioUrl?: string; durationSec?: number }) => {
    if ((!text.trim() && !voiceOptions?.audioUrl) || chatLoading) return;

    const userMsg: Message = {
      id: "msg-" + Math.floor(Math.random() * 100000),
      role: "user",
      content: text || "🎙️ Audio Message",
      timestamp: Date.now(),
      audioUrl: voiceOptions?.audioUrl,
      durationSec: voiceOptions?.durationSec,
      isVoiceMessage: !!voiceOptions?.audioUrl
    };

    // Update conversation state instantly
    let updatedConvs = conversations.map(c => {
      if (c.id === activeConvId) {
        const displayTitle = text ? (text.slice(0, 30) + (text.length > 30 ? "..." : "")) : "Audio Message";
        const currentTitle = c.title === "New AI Advisory Session" ? displayTitle : c.title;
        return {
          ...c,
          title: currentTitle,
          messages: [...c.messages, userMsg],
          updatedAt: Date.now()
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputMessage("");
    setChatLoading(true);

    try {
      const activeMessages = updatedConvs.find(c => c.id === activeConvId)?.messages || [];
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: activeMessages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          system: `You are the Global Academy Hub AI, an expert academic and visa consultant for Schengen and European higher education.
Be concise, professional, warm, and practical. Help students with university recommendations, visa suitability, and preparation.
You are based in Dhaka, Bangladesh.

The current student you are talking to has the following profile:
- Name: ${profile.fullName || "Not provided"}
- Prior Background Academic Degree: ${profile.previousDegree || "Not provided"}
- Prior Institution: ${profile.previousInstitution || "Not provided"}
- CGPA: ${profile.gpa || "Not provided"}
- Language Score (IELTS): ${profile.ielts || "Not provided (0 if not taken yet)"}
- Preferred Target Countries: ${profile.preferredCountries && profile.preferredCountries.length > 0 ? profile.preferredCountries.join(", ") : (profile.targetCountry || "Germany")}
- Desired Fields of Study: ${profile.desiredFields && profile.desiredFields.length > 0 ? profile.desiredFields.join(", ") : (profile.targetSubject || "Computer Science")}
- Goal Degree: ${profile.targetDegree || "Master's"}
- Target Financial Budget Range: ${profile.budgetAmount || (profile.budget === 'low' ? '৳5L - ৳8L' : profile.budget === 'medium' ? '৳10L - ৳15L' : '৳18L+')}
${profile.cvParsed && profile.cvFileName ? `- Parsed CV Skills: ${profile.cvSkills && profile.cvSkills.length > 0 ? profile.cvSkills.join(", ") : "Extracted from " + profile.cvFileName}` : ""}

Use this student's profile context to deeply personalize all suggestions, advice, and recommendations. When appropriate, refer to the student by their name (${profile.fullName}). Speak naturally in English, but if they write in Bengali, feel free to respond in a natural mix of English and Bengali (Banglish/Bengali accents). Provide highly specific public/private university options matching their exact CGPA, desired subjects, and budget limits.`
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with error: " + response.statusText);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/event-stream")) {
        const botMsgId = "msg-" + Math.floor(Math.random() * 100000);
        const botMsg: Message = {
          id: botMsgId,
          role: "assistant",
          content: "",
          timestamp: Date.now()
        };

        setConversations(prev => prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, botMsg],
              updatedAt: Date.now()
            };
          }
          return c;
        }));

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload) continue;
              if (payload === "[DONE]") continue;

              try {
                const parsed = JSON.parse(payload);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  accumulatedContent += content;
                  setConversations(prev => prev.map(c => {
                    if (c.id === activeConvId) {
                      return {
                        ...c,
                        messages: c.messages.map(m => m.id === botMsgId ? { ...m, content: accumulatedContent } : m)
                      };
                    }
                    return c;
                  }));
                }
              } catch (e) {
                console.warn("Could not parse stream token:", payload, e);
              }
            }
          }
        }
      } else {
        const data = await response.json();
        const botMsg: Message = {
          id: "msg-" + Math.floor(Math.random() * 100000),
          role: "assistant",
          content: data.reply || "",
          timestamp: Date.now()
        };

        setConversations(prev => prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, botMsg],
              updatedAt: Date.now()
            };
          }
          return c;
        }));
      }

    } catch (err: any) {
      console.error(err);
      const errBotMsg: Message = {
        id: "msg-err-" + Math.floor(Math.random() * 100000),
        role: "assistant",
        content: `I am currently having trouble reaching the main servers. 

But I can tell you that for ${profile.targetCountry} higher study:
- IELTS requirement is typically ${profile.ielts || "6.5"} minimum.
- Tuition Fees: €0 in public German universities, or average €8,000-€15,000/year across other European countries.
- Visa: You'll require a Blocked Account or financial affidavit from Bangladeshi sponsors.`,
        timestamp: Date.now()
      };
      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, errBotMsg],
            updatedAt: Date.now()
          };
        }
        return c;
      }));
    } finally {
      setChatLoading(false);
    }
  };

  const handleDownloadChat = () => {
    if (!activeConv || activeConv.messages.length === 0) {
      addToast("No message history to export.", "info");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      let y = margin;

      const drawHeader = () => {
        doc.setFillColor(124, 58, 237);
        doc.rect(0, 0, pageWidth, 15, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("GLOBAL ACADEMY HUB • ADVISORY SERVICE RECORD", margin, 9.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const todayStr = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
        doc.text(todayStr, pageWidth - margin, 9.5, { align: "right" });
      };

      drawHeader();
      y += 10;

      doc.setTextColor(124, 58, 237);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      y += 8;
      doc.text("Advisory Session History", margin, y);

      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      y += 6;
      doc.text(`Topic: ${activeConv.title}`, margin, y);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      y += 4;
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      activeConv.messages.forEach((msg) => {
        const isUser = msg.role === "user";
        const senderName = isUser ? "You (Student)" : "GAH AI Specialist";
        const senderColor = isUser ? [79, 70, 229] : [124, 58, 237];

        if (y > pageHeight - 30) {
          doc.addPage();
          drawHeader();
          y = margin + 15;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(senderColor[0], senderColor[1], senderColor[2]);
        doc.text(senderName, margin, y);

        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(timeStr, pageWidth - margin, y, { align: "right" });
        
        y += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);

        const lines = doc.splitTextToSize(msg.content, contentWidth);
        const lineHeight = 5;
        const textBlockHeight = lines.length * lineHeight;

        if (y + textBlockHeight > pageHeight - 20) {
          doc.addPage();
          drawHeader();
          y = margin + 15;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(senderColor[0], senderColor[1], senderColor[2]);
          doc.text(`${senderName} (continued)`, margin, y);
          y += 4.5;
        }

        lines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += lineHeight;
        });

        y += 5;
      });

      if (y > pageHeight - 40) {
        doc.addPage();
        drawHeader();
        y = margin + 15;
      }

      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Global Academy Hub Advisory Channel. This is an official digital advisory record summary.", margin, y);
      y += 4;
      doc.text("Headquarters: Panthapath, Dhaka, Bangladesh | Helpline: +880 01841800841", margin, y);

      doc.save(`Global_Academy_Hub_Chat_${activeConvId}.pdf`);
      addToast("Chat history exported to PDF successfully!", "success");
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      addToast("Failed to generate PDF.", "error");
    }
  };

  const handleCopyFaq = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFaqId(id);
      addToast("Answer copied to clipboard!", "success");
      setTimeout(() => {
        setCopiedFaqId(null);
      }, 2000);
    }).catch(() => {
      addToast("Failed to copy answer.", "error");
    });
  };

  // --- Interview Simulator Logic ---
  const handleSelectRandomQuestion = () => {
    const list = [
      "Why do you want to study in Germany/Europe instead of Bangladesh?",
      "Why did you choose this specific university over other European options?",
      "Can you describe your study course curriculum and some of its key modules?",
      "What is your detailed funding plan to cover your tuition fees and monthly living expenses?",
      "What is your plan after graduating from this program in Europe?",
      "Where will you stay during your studies, and how did you arrange it?",
      "Do you have any relatives or friends in the Schengen zone?",
      "How does this study program align with your previous academic and professional background?",
      "What is a German Blocked Account (Sperrkonto) and how does it work?"
    ];
    const filtered = list.filter(q => q !== currentSimQuestion);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentSimQuestion(random);
    setTranscribingText("");
    setAudioBlobUrl(null);
    setRecordingDuration(0);
    addToast("New visa interview question loaded!", "success");
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setAudioBlobUrl(null);
    audioChunksRef.current = [];

    timerIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      addToast("Recording started. Speak into your microphone!", "success");
    } catch (err) {
      console.warn("Microphone access failed/not allowed inside iframe, running in practice text mode.", err);
      addToast("Mic blocked/unavailable. Running in text practice mode.", "info");
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscribingText(prev => prev + " " + event.results[i][0].transcript);
            }
          }
        };
        rec.start();
        speechRecognitionRef.current = rec;
      }
    } catch (e) {
      console.warn("Speech recognition not supported in this browser:", e);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    addToast("Recording completed!", "success");
  };

  const handleSuggestSampleAnswer = () => {
    let sample = "";
    if (currentSimQuestion.includes("instead of Bangladesh")) {
      sample = "I chose to study in Germany because of its world-renowned tuition-free higher education, focus on research, and state-of-the-art laboratory infrastructure. German universities offer industry-integrated curricula which aren't widely available in Bangladesh. This will equip me with the practical expertise required to contribute to technological solutions in my home country upon graduation.";
    } else if (currentSimQuestion.includes("specific university")) {
      sample = "I selected this university because of its outstanding curriculum, faculty members who are leading active research in my domain, and high graduate employability rate. Additionally, the university offers comprehensive student support services and practical labs that perfectly match my research interests and career goals.";
    } else if (currentSimQuestion.includes("course curriculum")) {
      sample = "This course covers advanced modules such as Software Architecture, Distributed Systems, and Advanced Machine Learning. I am particularly excited about the 3rd-semester lab project which allows us to collaborate directly with industrial partners. The combination of foundational theories and practical team projects makes this curriculum highly appealing.";
    } else if (currentSimQuestion.includes("funding plan")) {
      sample = "My education and living expenses are fully funded. I have deposited 11,904 Euros in my German Blocked Account, which releases 992 Euros monthly for my living costs. My tuition fees will be sponsored by my father, who is a senior manager at a reputable firm in Bangladesh and has an annual income of over 15 Lakh BDT, backed by solid bank statements.";
    } else if (currentSimQuestion.includes("after graduating")) {
      sample = "After completing my Master's degree, my goal is to gain 1-2 years of international work experience in Europe to understand global best practices. Ultimately, I plan to return to Bangladesh to establish an engineering consultancy and introduce advanced sustainable methodologies, utilizing the expertise gained in Europe.";
    } else if (currentSimQuestion.includes("Blocked Account")) {
      sample = "A German Blocked Account, or Sperrkonto, is a mandatory bank account to prove financial capability for a student visa. I deposit the required sum of €11,904 in a licensed provider like Expatrio or Fintiba. Once in Germany, I will receive a monthly payout of €992 to cover my accommodation, food, insurance, and study materials.";
    } else {
      sample = "I have carefully planned my studies in Europe. My academic background has prepared me thoroughly for this high-caliber program. My financials are backed by a secure blocked account and family sponsors. I intend to maintain excellent grades, complete my research projects successfully, and build a strong global network.";
    }

    setTranscribingText(sample);
    addToast("Sample professional answer populated!", "success");
  };

  const handleSavePracticeAttempt = () => {
    if (!transcribingText.trim()) {
      addToast("Please record or write an answer before saving.", "error");
      return;
    }

    const newAttempt = {
      id: "ATT-" + Math.floor(10000 + Math.random() * 90000),
      question: currentSimQuestion,
      transcript: transcribingText,
      audioUrl: audioBlobUrl || undefined,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      durationSec: recordingDuration || 15,
      status: "pending" as const
    };

    setPracticeAttempts(prev => [newAttempt, ...prev]);
    setTranscribingText("");
    setAudioBlobUrl(null);
    setRecordingDuration(0);

    addToast("Practice answer saved! Submit for evaluation below.", "success");
  };

  const handleDeletePracticeAttempt = (id: string) => {
    setPracticeAttempts(prev => prev.filter(att => att.id !== id));
    addToast("Practice attempt deleted.", "info");
  };

  const handleRequestExpertReview = (id: string) => {
    setPracticeAttempts(prev => prev.map(att => {
      if (att.id === id) {
        const length = att.transcript.length;
        const fluencyScore = length > 200 ? 9 : length > 100 ? 8 : 6;
        const relevanceScore = att.transcript.toLowerCase().includes("germany") || att.transcript.toLowerCase().includes("blocked") || att.transcript.toLowerCase().includes("study") ? 9 : 7;
        const grammarScore = length > 150 ? 8 : 7;
        const overallScore = Math.round((fluencyScore + relevanceScore + grammarScore) / 3);

        let feedbackText = "";
        if (att.question.includes("funding")) {
          feedbackText = "Good explanation of your financial setup. Ensure you explicitly name Expatrio/Fintiba if asked where your blocked account is. Make sure you don't sound nervous when stating your father's business income. Be confident about the numbers.";
        } else if (att.question.includes("instead of Bangladesh")) {
          feedbackText = "Excellent justification. The contrast you drew between the research facilities is very solid. Try to list 1-2 specific labs or equipment present at your target German university to show deep research.";
        } else if (att.question.includes("specific university")) {
          feedbackText = "Good, but a little generic. I recommend referencing the exact name of the professor whose research you like, or highlighting a specific module in the 2nd semester. This will show the visa officer that you didn't just pick a random school.";
        } else {
          feedbackText = "Solid practice response! Your pacing is excellent. Work on avoiding filler words like 'um' and 'ah'. The key points are covered well, and your English fluency is up to European visa interview standards.";
        }

        return {
          ...att,
          status: "reviewed" as const,
          scores: {
            fluency: fluencyScore,
            relevance: relevanceScore,
            grammar: grammarScore,
            overall: overallScore
          },
          feedback: feedbackText
        };
      }
      return att;
    }));

    addToast("Consultant feedback generated & synchronized successfully!", "success");
  };

  // --- Chat Voice message recording & TTS logic ---
  const handleStartChatRecording = async () => {
    setIsChatRecording(true);
    setChatRecordingDuration(0);
    chatAudioChunksRef.current = [];
    chatStartTimeRef.current = Date.now();

    chatTimerIntervalRef.current = setInterval(() => {
      setChatRecordingDuration(prev => prev + 1);
    }, 1000);

    const activeLanguage = chatVoiceLanguage;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chatMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chatAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chatStartTimeRef.current === 0) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const audioBlob = new Blob(chatAudioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        const duration = Math.round((Date.now() - chatStartTimeRef.current) / 1000) || 1;
        chatStartTimeRef.current = 0;
        
        let transcription = inputMessage.trim();
        if (!transcription) {
          if (activeLanguage === "bn") {
            transcription = "আমি জার্মানিতে উচ্চশিক্ষার জন্য ব্লক অ্যাকাউন্ট এবং ভিসা প্রসেস সম্পর্কে জানতে চাই।";
          } else {
            transcription = "I am looking for Schengen visa guidelines, blocked account creation, and SOP review.";
          }
        }

        handleSendMessage(transcription, { audioUrl: url, durationSec: duration });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      addToast(`Chat voice recording started. Speak now!`, "success");
    } catch (err) {
      console.warn("Microphone access failed/not allowed in iframe.", err);
      addToast("Mic blocked/unavailable. Using simulated voice option.", "info");
      
      setTimeout(() => {
        if (chatStartTimeRef.current === 0) return;
        const duration = 8;
        const url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        let transcription = "";
        if (activeLanguage === "bn") {
          transcription = "আমি ইউরোপে স্কলারশিপ এবং ভিসা ইন্টারভিউ প্রিপারেশন সম্পর্কে কিছু প্রশ্ন করতে চাই।";
        } else {
          transcription = "Can you help me prepare a flawless study plan and list free tuition options?";
        }
        chatStartTimeRef.current = 0;
        setIsChatRecording(false);
        if (chatTimerIntervalRef.current) {
          clearInterval(chatTimerIntervalRef.current);
          chatTimerIntervalRef.current = null;
        }
        handleSendMessage(transcription, { audioUrl: url, durationSec: duration });
      }, 3000);
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = activeLanguage === "en" ? "en-US" : "bn-BD";

        rec.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setInputMessage(prev => (prev + " " + event.results[i][0].transcript).trim());
            }
          }
        };
        rec.start();
        chatSpeechRecognitionRef.current = rec;
      }
    } catch (e) {
      console.warn("Speech recognition not supported:", e);
    }
  };

  const handleStopChatRecording = () => {
    setIsChatRecording(false);
    if (chatTimerIntervalRef.current) {
      clearInterval(chatTimerIntervalRef.current);
      chatTimerIntervalRef.current = null;
    }
    if (chatMediaRecorderRef.current && chatMediaRecorderRef.current.state !== "inactive") {
      chatMediaRecorderRef.current.stop();
    } else {
      addToast("Recording finalized successfully!", "success");
    }
    if (chatSpeechRecognitionRef.current) {
      chatSpeechRecognitionRef.current.stop();
      chatSpeechRecognitionRef.current = null;
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    try {
      if (!('speechSynthesis' in window)) {
        addToast("Text-to-speech is not supported on this browser.", "error");
        return;
      }

      if (currentlyPlayingAudioMsgId === msgId) {
        window.speechSynthesis.cancel();
        setCurrentlyPlayingAudioMsgId(null);
        addToast("Speech playback paused.", "info");
        return;
      }

      window.speechSynthesis.cancel();
      setCurrentlyPlayingAudioMsgId(msgId);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;

      const containsBengali = /[\u0980-\u09FF]/.test(text);
      const voices = window.speechSynthesis.getVoices();
      
      if (containsBengali) {
        const bnVoice = voices.find(v => v.lang.startsWith("bn")) || voices.find(v => v.lang.includes("BD") || v.lang.includes("IN"));
        if (bnVoice) utterance.voice = bnVoice;
        utterance.lang = "bn-BD";
      } else {
        const enVoice = voices.find(v => v.lang.startsWith("en-US")) || voices.find(v => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = "en-US";
      }

      utterance.onend = () => {
        setCurrentlyPlayingAudioMsgId(null);
      };

      utterance.onerror = () => {
        setCurrentlyPlayingAudioMsgId(null);
      };

      window.speechSynthesis.speak(utterance);
      addToast(`Playing voice response in ${containsBengali ? "Bengali" : "English"}...`, "info");
    } catch (err) {
      console.error(err);
      setCurrentlyPlayingAudioMsgId(null);
    }
  };

  const handleToggleAudioMessage = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      if (chatAudioRef.current) {
        chatAudioRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (chatAudioRef.current) {
        chatAudioRef.current.pause();
      }
      const audio = new Audio(url);
      chatAudioRef.current = audio;
      setPlayingAudioId(msgId);
      audio.play().catch(e => console.warn("Audio play failed:", e));
      audio.onended = () => {
        setPlayingAudioId(null);
      };
    }
  };

  // --- Payment Processor ---
  const handleTriggerPayment = (tier: ServiceTier) => {
    setSelectedTierForPayment(tier);
    setShowPaymentModal(true);
    setPaymentPhone(user?.phone || "+8801841800841");
    setPaymentCard("4242 4242 4242 4242");
    setPaymentExpiry("12/28");
    setPaymentCvc("123");
  };

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierForPayment) return;

    setIsProcessingPayment(true);
    
    setTimeout(() => {
      const costs: Record<ServiceTier, number> = {
        free: 0,
        entry: 30,
        structured: 100,
        premium: 5500,
        elite: 45000
      };

      const amount = costs[selectedTierForPayment] || 100;
      const newPayment: Payment = {
        id: "PAY-" + Math.floor(10000 + Math.random() * 90000),
        userId: user?.id || "guest",
        tier: selectedTierForPayment as Exclude<ServiceTier, "free">,
        amount: amount,
        method: paymentMethod,
        phone: paymentMethod === "stripe" ? "Visa **** 4242" : paymentPhone,
        status: "completed",
        timestamp: Date.now()
      };

      const updatedPayments = [newPayment, ...payments];
      setPayments(updatedPayments);
      localStorage.setItem("payments", JSON.stringify(updatedPayments));

      if (user) {
        const upgradedUser: User = {
          ...user,
          tier: selectedTierForPayment
        };
        setUser(upgradedUser);
        localStorage.setItem("user", JSON.stringify(upgradedUser));
      } else {
        addToast("Payment successful! Sign in to preserve your tier.", "info");
      }

      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      addToast(`Successfully upgraded to ${selectedTierForPayment.toUpperCase()} Tier!`, "success");
      
      if (selectedTierForPayment === "entry") {
        setShowReportViewer(true);
      }
    }, 1500);
  };

  // --- Profile Manager ---
  const handleGpaChange = (val: string) => {
    setProfile(prev => ({ ...prev, gpa: val }));
    const num = parseFloat(val);
    if (val.trim() === "") {
      setGpaError("CGPA cannot be empty");
    } else if (isNaN(num)) {
      setGpaError("CGPA must be a valid number");
    } else if (num < 1.0 || num > 4.0) {
      setGpaError("CGPA must be between 1.00 and 4.00");
    } else {
      setGpaError(null);
    }
  };

  const handleIeltsChange = (val: string) => {
    setProfile(prev => ({ ...prev, ielts: val }));
    const num = parseFloat(val);
    if (val.trim() === "") {
      setIeltsError("IELTS cannot be empty");
    } else if (isNaN(num)) {
      setIeltsError("IELTS must be a valid number");
    } else if (num < 0.0 || num > 9.0) {
      setIeltsError("IELTS must be between 0.0 and 9.0 (0 if not taken yet)");
    } else {
      setIeltsError(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const gpaNum = parseFloat(profile.gpa);
    const ieltsNum = parseFloat(profile.ielts);
    
    let hasErr = false;
    if (profile.gpa.trim() === "" || isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 4.0) {
      setGpaError("CGPA must be between 1.00 and 4.00");
      hasErr = true;
    }
    if (profile.ielts.trim() === "" || isNaN(ieltsNum) || ieltsNum < 0.0 || ieltsNum > 9.0) {
      setIeltsError("IELTS must be between 0.0 and 9.0 (0 if not taken yet)");
      hasErr = true;
    }

    if (hasErr) {
      addToast("Please correct errors before saving", "error");
      return;
    }

    localStorage.setItem("student_profile", JSON.stringify(profile));
    setIsEditingProfile(false);
    addToast("Consultancy Profile Updated Successfully!", "success");
  };

  // --- Smart CV Upload & Analysis Flow ---
  const handleCvUpload = (file: File) => {
    if (!file) return;

    // Validate size and type
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isDoc = file.name.endsWith(".docx") || file.name.endsWith(".doc") || file.name.endsWith(".txt");
    
    if (!isPdf && !isDoc) {
      addToast("Please upload a PDF, Word, or Text resume file.", "error");
      return;
    }

    setCvIsScanning(true);
    setCvScanProgress(10);
    setCvScanStep("Unpacking resume document & parsing text fonts...");

    // Feedback
    addToast(`Uploading and scanning "${file.name}"...`, "info");

    const timer = setInterval(() => {
      setCvScanProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(timer);
          
          // Compute parsed values intelligently based on file metadata
          const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          
          // Extract a potential name
          let parsedName = "Nazmul Bijoy";
          if (fileNameNoExt.toLowerCase().includes("resume") || fileNameNoExt.toLowerCase().includes("cv")) {
            const cleaned = fileNameNoExt.replace(/resume/gi, "").replace(/cv/gi, "").trim();
            if (cleaned.length > 3) {
              parsedName = cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            }
          } else {
            parsedName = fileNameNoExt.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          }

          // Extract academic background and targets
          let parsedDegree = "B.Sc. in Computer Science";
          let parsedSubject = "Computer Science";
          let parsedInstitution = "Dhaka University";
          let parsedGpa = "3.65";
          let parsedIelts = "6.5";
          let parsedSkills = ["React", "TypeScript", "Node.js", "Python", "SQL"];

          const lowerName = file.name.toLowerCase();
          if (lowerName.includes("business") || lowerName.includes("bba") || lowerName.includes("mba") || lowerName.includes("finance")) {
            parsedDegree = "Bachelor of Business Administration (BBA)";
            parsedSubject = "Business Administration";
            parsedInstitution = "North South University (NSU)";
            parsedGpa = "3.40";
            parsedIelts = "7.0";
            parsedSkills = ["Financial Analysis", "Excel", "Marketing", "Strategic Management"];
          } else if (lowerName.includes("eee") || lowerName.includes("electrical") || lowerName.includes("engineering")) {
            parsedDegree = "B.Sc. in Electrical Engineering";
            parsedSubject = "Electrical Engineering";
            parsedInstitution = "BUET";
            parsedGpa = "3.55";
            parsedIelts = "6.5";
            parsedSkills = ["MATLAB", "Circuit Design", "C++", "Signal Processing"];
          } else if (lowerName.includes("hsc") || lowerName.includes("ssc") || lowerName.includes("college")) {
            parsedDegree = "Higher Secondary Certificate (HSC)";
            parsedSubject = "Science Stream";
            parsedInstitution = "Notre Dame College, Dhaka";
            parsedGpa = "4.00";
            parsedIelts = "6.0";
            parsedSkills = ["Physics", "Mathematics", "Analytical Problem Solving"];
          }

          // Update student profile state
          setProfile(curr => {
            const updated = {
              ...curr,
              fullName: parsedName,
              previousDegree: parsedDegree,
              previousInstitution: parsedInstitution,
              targetSubject: parsedSubject,
              desiredFields: [parsedSubject],
              gpa: parsedGpa,
              ielts: parsedIelts,
              cvFileName: file.name,
              cvFileSize: (file.size / 1024).toFixed(1) + " KB",
              cvParsed: true,
              cvSkills: parsedSkills,
              lastUpdated: Date.now()
            };
            
            // Persist to local storage automatically
            localStorage.setItem("student_profile", JSON.stringify(updated));
            return updated;
          });

          setCvIsScanning(false);
          addToast("AI Smart CV Scan completed! Profile populated successfully.", "success");
          return 100;
        }

        // Progression of scanning step text
        if (next >= 85) {
          setCvScanStep("Syncing CGPA credentials and Lang scores...");
        } else if (next >= 60) {
          setCvScanStep("Detecting previous academic degree fields...");
        } else if (next >= 35) {
          setCvScanStep("Analyzing structural skills & project tags...");
        }

        return next;
      });
    }, 450);
  };

  // --- Log Out ---
  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    createInitialConversation();
    addToast("Logged out and cleared active advisory session", "info");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative antialiased selection:bg-violet-100 selection:text-violet-900">
      
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className={`p-3.5 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 ${
                toast.type === "success" 
                  ? "bg-white border-emerald-100 text-emerald-800 shadow-emerald-50" 
                  : toast.type === "error" 
                  ? "bg-white border-rose-100 text-rose-800 shadow-rose-50" 
                  : "bg-white border-violet-100 text-violet-800 shadow-violet-50"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-rose-500" : "bg-violet-500"
              }`} />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Professional Navigation Bar */}
      <nav className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Logo size={32} className="shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 tracking-tight">
              {language === "bn" ? "গ্লোবাল একাডেমি হাব" : "Global Academy Hub"}
            </span>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
              {language === "bn" ? "ভিসা ও শিক্ষা প্ল্যাটফর্ম" : "Visa & Study Platform"}
            </span>
          </div>
        </div>

        {/* Global Controls & Auth */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Quick Demo Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-2.5 pr-1.5 select-none flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-violet-500 animate-pulse" />
              <span>Role Switcher</span>
            </span>
            <button 
              onClick={() => {
                const loggedUser: User = {
                  id: "usr-admin",
                  name: "Elite Advisor (Admin)",
                  email: "admin@globalacademyhub.com",
                  phone: "+8801841800841",
                  method: "email",
                  avatar: "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff",
                  tier: "premium",
                  role: "admin",
                  createdAt: Date.now(),
                };
                localStorage.setItem("user", JSON.stringify(loggedUser));
                setUser(loggedUser);
                addToast("Switched to Admin Dashboard & Advising Mode", "success");
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                user?.role === "admin" 
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-100" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {language === "bn" ? "এডমিন" : "Admin"}
            </button>
            <button 
              onClick={() => {
                const loggedUser: User = {
                  id: "usr-student",
                  name: "IELTS Student",
                  email: "student@globalacademyhub.com",
                  phone: "+8801700000001",
                  method: "email",
                  avatar: "https://ui-avatars.com/api/?name=Student&background=3b82f6&color=fff",
                  tier: "structured",
                  role: "student",
                  createdAt: Date.now(),
                };
                localStorage.setItem("user", JSON.stringify(loggedUser));
                setUser(loggedUser);
                addToast("Switched to Student (Structured Tier) View", "success");
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                user?.role === "student" 
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-100" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {language === "bn" ? "স্টুডেন্ট" : "Student"}
            </button>
            <button 
              onClick={() => {
                const loggedUser: User = {
                  id: "usr-user",
                  name: "General Aspirant",
                  email: "user@globalacademyhub.com",
                  phone: "+8801700000002",
                  method: "email",
                  avatar: "https://ui-avatars.com/api/?name=User&background=6b7280&color=fff",
                  tier: "free",
                  role: "user",
                  createdAt: Date.now(),
                };
                localStorage.setItem("user", JSON.stringify(loggedUser));
                setUser(loggedUser);
                addToast("Switched to Guest (Free Tier) View", "success");
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                user?.role === "user" || !user 
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-100" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {language === "bn" ? "ফ্রি ইউজার" : "Guest"}
            </button>
          </div>

          <a
            href="https://wa.me/8801841800841"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold border border-emerald-100/50 hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {language === "bn" ? "সহায়তা: +৮৮০ ০১৮৪১৮০০৮৪১" : "Support: +880 01841800841"}
          </a>

          {/* Language Switcher */}
          <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200/60 shadow-xs">
            <button 
              onClick={() => { setLanguage("en"); addToast("Switched system language to English", "info"); }}
              className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-semibold rounded-full transition-all cursor-pointer ${
                language === "en" ? "bg-white text-violet-750 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => { setLanguage("bn"); addToast("বাংলা ভাষায় স্বাগতম!", "info"); }}
              className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-semibold rounded-full transition-all cursor-pointer ${
                language === "bn" ? "bg-white text-violet-750 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />

          {/* User Profile Bar */}
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5 justify-end">
                  {user.role && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase ${
                      user.role === "superadmin" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      user.role === "admin" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      user.role === "student" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {language === "bn" ? (
                        user.role === "superadmin" ? "সুপার এডমিন" :
                        user.role === "admin" ? "এডমিন" :
                        user.role === "student" ? "স্টুডেন্ট" :
                        "ইউজার"
                      ) : user.role}
                    </span>
                  )}
                  <p className="text-[11px] font-bold text-slate-850">{user.name}</p>
                </div>
                <p className="text-[8px] uppercase font-mono tracking-wider font-bold text-violet-600">
                  {language === "bn" ? (
                    user.tier === "elite" ? "এলিট টিয়ার" :
                    user.tier === "premium" ? "প্রিমিয়াম টিয়ার" :
                    user.tier === "structured" ? "স্ট্রাকচার্ড টিয়ার" :
                    "ফ্রি টিয়ার"
                  ) : `${user.tier.toUpperCase()} TIER`}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full border border-violet-150 p-0.5 shrink-0">
                <img src={user.avatar} className="rounded-full w-full h-full object-cover" alt={user.name} />
              </div>
              <button
                onClick={handleLogOut}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded text-[11px] font-bold hover:opacity-95 transition-all"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Student Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Container Grid */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-50/40 border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto shrink-0 md:sticky md:top-14 md:h-[calc(100vh-56px)] scrollbar-none">
          <div className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 px-3">
            {language === "bn" ? "প্রধান নেভিগেশন" : "Core Navigation"}
          </div>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "chat" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            {language === "bn" ? "এআই পরামর্শ চ্যাট" : "AI Consultancy Chat"}
          </button>

          <button
            onClick={() => setActiveTab("channels")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "channels" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            {language === "bn" ? "হোয়াটসঅ্যাপ ও মেসেঞ্জার" : "WhatsApp & Messenger"}
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "simulator" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <Mic className="w-4 h-4 shrink-0" />
            {language === "bn" ? "ইন্টারভিউ সিমুলেটর" : "Interview Simulator"}
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {language === "bn" ? "স্টুডেন্ট ড্যাশবোর্ড" : "Student Dashboard"}
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "pricing" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            {language === "bn" ? "ভিসা ও শিক্ষা পরিকল্পনা" : "Visa & Study Plans"}
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "checklist" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            {language === "bn" ? "নথিপত্র চেকলিস্ট" : "Document Checklist"}
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "tracker" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {language === "bn" ? "অগ্রগতি ট্র্যাকার" : "Progress Tracker"}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "payments" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            {language === "bn" ? "পেমেন্ট লেজার" : "Payment Ledger"}
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shrink-0 transition-all duration-200 ${
              activeTab === "about" 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 font-bold translate-x-1" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            {language === "bn" ? "আমাদের সম্পর্কে ও যোগাযোগ" : "About Us & Contact"}
          </button>

          {/* Interactive Tier Widget */}
          <div className="hidden md:block mt-auto p-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-violet-100 border border-violet-500/10 relative overflow-hidden group">
            {/* Absolute background visual accent */}
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/15 transition-all duration-500" />
            
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-violet-200 font-bold">
                  {language === "bn" ? "বর্তমান স্ট্যাটাস" : "Portal Status"}
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-[10px] text-violet-100 font-medium">
                  {user ? user.name : (language === "bn" ? "অতিথি শিক্ষার্থী" : "Guest Student")}
                </p>
                <p className="font-display font-black text-sm tracking-wide capitalize text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                  <span>
                    {user ? `${user.tier.toUpperCase()} ${language === "bn" ? "পাথওয়ে" : "PATHWAY"}` : (language === "bn" ? "ফ্রি পাথওয়ে" : "FREE PATHWAY")}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-300 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: user?.tier === "free" || !user ? "25%" : user.tier === "entry" ? "50%" : user.tier === "structured" ? "70%" : "95%" }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-violet-200">
                  <span>{language === "bn" ? "যোগ্যতা" : "COMPATIBILITY"}</span>
                  <span className="font-bold">
                    {user?.tier === "free" || !user ? "25%" : user.tier === "entry" ? "50%" : user.tier === "structured" ? "75%" : "100%"}
                  </span>
                </div>
              </div>

              <p className="text-[9.5px] leading-relaxed text-violet-100 font-medium opacity-90">
                {user?.tier === "free" || !user 
                  ? (language === "bn" ? "প্রোফাইল মূল্যায়ন আনলক করতে প্ল্যান আপগ্রেড করুন।" : "Unlock Suitability Map evaluations by upgrading.")
                  : (language === "bn" ? "অভিনন্দন! আপনার প্রফেশনাল পাথওয়ে সক্রিয়।" : "Elite visa advising tools fully activated.")}
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8 md:overflow-y-auto md:max-h-[calc(100vh-56px)]">
          <AnimatePresence mode="wait">
            
            {/* 1. CHAT TAB */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[550px] items-start"
              >
                {/* Mobile Quick Panel Toggles */}
                <div className="lg:hidden col-span-1 flex gap-2 w-full mb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileSessions(!showMobileSessions);
                      setShowMobileTemplates(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-[10.5px] font-bold tracking-wider uppercase border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      showMobileSessions
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{showMobileSessions ? "Hide Sessions" : "Advisory Sessions"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileTemplates(!showMobileTemplates);
                      setShowMobileSessions(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-[10.5px] font-bold tracking-wider uppercase border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      showMobileTemplates
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{showMobileTemplates ? "Hide Templates" : "SOP Templates"}</span>
                  </button>
                </div>

                {/* Conversations Navigation List */}
                <div className={`${showMobileSessions ? "flex" : "hidden lg:flex"} lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 h-full max-h-[500px] overflow-y-auto w-full`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Advisory Sessions</span>
                    <button
                      onClick={handleCreateNewConversation}
                      className="p-1 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors"
                      title="New Chat Session"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    {conversations.map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={`group relative p-3 rounded-xl cursor-pointer text-xs flex flex-col gap-1 transition-all ${
                          conv.id === activeConvId 
                            ? "bg-violet-50/80 border border-violet-100" 
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`font-semibold truncate pr-4 ${conv.id === activeConvId ? "text-violet-800" : "text-slate-700"}`}>
                            {conv.title}
                          </span>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="absolute right-2.5 top-3.5 p-1 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Advisory chat container */}
                <div className="lg:col-span-6 bg-white border border-slate-200 shadow-xl shadow-slate-100 rounded-[2rem] flex flex-col h-[650px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-50">
                  <div className="px-6 py-4.5 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 border border-violet-200">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                          Global Academy Hub AI
                        </h3>
                        <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          Online • Study Expert
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {activeConv && activeConv.messages.length > 0 && (
                        <button
                          onClick={handleDownloadChat}
                          className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-700 rounded-2xl text-[11px] font-bold border border-slate-100 transition-all"
                          title="Download Chat Log as PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Export PDF</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                    {activeConv?.messages.map((msg, index) => {
                      const isVoice = !!msg.audioUrl;
                      const isPlaying = playingAudioId === msg.id;
                      const isSpeaking = currentlyPlayingAudioMsgId === msg.id;

                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[88%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-100 border border-violet-500 rounded-tr-none"
                                : "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none relative group"
                            }`}
                          >
                            {msg.role !== "user" && (
                              <div className="flex justify-between items-center mb-2.5 border-b border-slate-50 pb-1.5">
                                <p className="text-[10px] uppercase tracking-widest font-mono text-violet-600 font-bold flex items-center gap-1.5">
                                  <Shield className="w-2.5 h-2.5" />
                                  Verified Consultant
                                </p>
                                
                                <button
                                  onClick={() => handleSpeakMessage(msg.id, msg.content)}
                                  className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                                    isSpeaking 
                                      ? "bg-violet-100 text-violet-700 border border-violet-200 animate-pulse" 
                                      : "hover:bg-slate-50 text-slate-400 hover:text-violet-600 opacity-0 group-hover:opacity-100"
                                  }`}
                                  title="Read Aloud"
                                >
                                  <Volume2 className={`h-3 w-3 ${isSpeaking ? "animate-bounce" : ""}`} />
                                  <span>{isSpeaking ? "STOP" : "VOICE"}</span>
                                </button>
                              </div>
                            )}

                            {isVoice ? (
                              <div className="space-y-3 py-1">
                                <div className={`flex items-center gap-4 p-3 rounded-2xl border ${msg.role === "user" ? "bg-white/10 border-white/20" : "bg-violet-50/50 border-violet-100/50"}`}>
                                  <button
                                    onClick={() => handleToggleAudioMessage(msg.id, msg.audioUrl!)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                      msg.role === "user"
                                        ? "bg-white text-violet-700 hover:scale-105"
                                        : "bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 shadow-md shadow-violet-200"
                                    }`}
                                  >
                                    {isPlaying ? (
                                      <span className="flex gap-1 items-end h-3">
                                        <span className="w-0.5 bg-current animate-bounce h-2" />
                                        <span className="w-0.5 bg-current animate-bounce h-3 delay-100" />
                                        <span className="w-0.5 bg-current animate-bounce h-2 delay-200" />
                                      </span>
                                    ) : (
                                      <Play className="h-4 w-4 fill-current ml-0.5" />
                                    )}
                                  </button>

                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.role === "user" ? "text-violet-100" : "text-violet-700"}`}>
                                        🎙️ Voice Note
                                      </span>
                                      <span className={`text-[9px] font-mono font-bold ${msg.role === "user" ? "text-violet-200" : "text-slate-400"}`}>
                                        {msg.durationSec ? `${msg.durationSec}s` : "0:08"}
                                      </span>
                                    </div>
                                    <div className="flex items-end gap-0.5 h-5 pt-1">
                                      {[...Array(20)].map((_, i) => {
                                        const h = Math.abs(Math.sin((i + 1) * 0.4)) * 100;
                                        return (
                                          <span
                                            key={i}
                                            style={{ height: `${Math.max(20, h)}%` }}
                                            className={`w-1 rounded-full transition-all ${msg.role === "user" ? "bg-white/40" : "bg-violet-200"}`}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                                  msg.role === "user" ? "bg-black/10 text-white/90 border border-white/10" : "bg-slate-50/80 text-slate-600 border border-slate-100"
                                }`}>
                                  <div className="flex items-center gap-1.5 mb-1 opacity-70">
                                    <FileText className="w-3 h-3" />
                                    <span className="font-bold text-[9px] uppercase tracking-wider">Transcription</span>
                                  </div>
                                  <p className="italic">"{msg.content}"</p>
                                </div>
                              </div>
                            ) : (
                              <p className="whitespace-pre-line text-[13px] md:text-sm font-medium">{msg.content}</p>
                            )}

                            <div className="flex justify-end mt-2 pt-1.5 opacity-60">
                              <span className={`text-[9px] font-bold font-mono tracking-tighter ${msg.role === "user" ? "text-violet-100" : "text-slate-400"}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200/60 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2.5">
                          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                          <span className="text-xs text-slate-500 italic">Global Academy Hub is evaluating requirements...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {activeConv?.messages.length === 1 && (
                    <div className="px-5 py-3 border-t border-slate-100 bg-white/80 shrink-0 flex gap-2 overflow-x-auto scrollbar-none">
                      {QUICK_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-slate-600 border border-slate-200/60 rounded-full text-[11px] font-medium transition-colors shrink-0"
                        >
                          <span>{q.icon}</span>
                          <span>{q.text}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input controls */}
                  <div className="p-5 bg-white border-t border-slate-100 shrink-0">
                    {isChatRecording ? (
                      <div className="bg-rose-50/80 border border-rose-100 rounded-[1.5rem] p-4 flex items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest">
                            Listening ({chatVoiceLanguage === "en" ? "EN" : "BN"})
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 font-mono text-[13px] font-bold text-rose-600">
                          <Clock className="h-4 w-4" />
                          <span>0:{chatRecordingDuration < 10 ? `0${chatRecordingDuration}` : chatRecordingDuration}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setIsChatRecording(false);
                              chatStartTimeRef.current = 0;
                              if (chatTimerIntervalRef.current) clearInterval(chatTimerIntervalRef.current);
                              if (chatMediaRecorderRef.current) chatMediaRecorderRef.current.onstop = null;
                              if (chatMediaRecorderRef.current && chatMediaRecorderRef.current.state !== "inactive") chatMediaRecorderRef.current.stop();
                              if (chatSpeechRecognitionRef.current) chatSpeechRecognitionRef.current.stop();
                              addToast("Recording canceled.", "info");
                            }}
                            className="px-4 py-2 hover:bg-white rounded-xl text-slate-500 hover:text-slate-700 text-[11px] font-bold transition-all"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleStopChatRecording}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-rose-200 flex items-center gap-2 transition-all active:scale-95"
                          >
                            <Square className="h-3 w-3 fill-current" />
                            <span>Done & Send</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shrink-0 shadow-inner">
                          <button
                            onClick={() => {
                              setChatVoiceLanguage("en");
                              addToast("Transcription: English", "success");
                            }}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all uppercase ${
                              chatVoiceLanguage === "en" ? "bg-white text-violet-700 shadow-md" : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            🇬🇧 EN
                          </button>
                          <button
                            onClick={() => {
                              setChatVoiceLanguage("bn");
                              addToast("Transcription: Bengali", "success");
                            }}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all uppercase ${
                              chatVoiceLanguage === "bn" ? "bg-white text-violet-700 shadow-md" : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            🇧🇩 BN
                          </button>
                        </div>

                        <div className="flex-1 relative flex items-center group">
                          <input
                            type="text"
                            placeholder={chatVoiceLanguage === "bn" ? "ভিসা প্রসেস বা SOP নিয়ে জিজ্ঞেস করুন..." : "Ask about SOP, pathways, or block accounts..."}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendMessage(inputMessage);
                            }}
                            className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-5 pr-12 py-3.5 text-xs md:text-sm font-medium focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/50 focus:bg-white transition-all outline-none"
                          />
                          <button
                            onClick={() => handleSendMessage(inputMessage)}
                            disabled={!inputMessage.trim() || chatLoading}
                            className={`absolute right-2 p-2 rounded-xl transition-all ${
                              inputMessage.trim() && !chatLoading
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:scale-105 active:scale-95"
                                : "bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={handleStartChatRecording}
                          className="p-3.5 bg-slate-50 hover:bg-violet-50 text-slate-400 hover:text-violet-600 rounded-2xl border border-slate-200/60 transition-all active:scale-95 shrink-0"
                          title="Record Voice Note"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SOP Templates Library */}
                <div className={`${showMobileTemplates ? "flex" : "hidden lg:flex"} lg:col-span-3 bg-white border border-slate-200 shadow-sm rounded-[2rem] p-5 flex flex-col gap-5 h-[650px] overflow-hidden w-full`}>
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-violet-50 rounded-xl text-violet-600 border border-violet-100">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h4 className="font-display font-bold text-[13px] text-slate-900 tracking-tight">SOP Frameworks</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Proven structures to draft with AI based on your target study field.
                    </p>
                  </div>

                  {/* Search and Category Filter */}
                  <div className="space-y-3 shrink-0">
                    <div className="relative group">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search frameworks..."
                        value={searchSopQuery}
                        onChange={(e) => setSearchSopQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl text-[11px] font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/50 bg-slate-50/50 transition-all"
                      />
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "STEM", "Business", "Humanities", "Creative"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedSopCategory(cat.toLowerCase())}
                          className={`px-2.5 py-1.5 rounded-xl text-[9px] font-bold tracking-[0.05em] uppercase transition-all cursor-pointer border ${
                            selectedSopCategory === cat.toLowerCase()
                              ? "bg-violet-600 text-white shadow-md shadow-violet-100 border-violet-600"
                              : "bg-white text-slate-500 hover:text-slate-800 border-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Templates List */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 scrollbar-none">
                    {(() => {
                      const filteredSopTemplates = SOP_TEMPLATES.filter(tmpl => {
                        const matchesCategory = selectedSopCategory === "all" || tmpl.category.toLowerCase() === selectedSopCategory;
                        const matchesSearch = tmpl.title.toLowerCase().includes(searchSopQuery.toLowerCase()) ||
                          tmpl.description.toLowerCase().includes(searchSopQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      });

                      if (filteredSopTemplates.length === 0) {
                        return (
                          <div className="text-center py-8 text-slate-400 text-[11px]">
                            <p>No templates found.</p>
                          </div>
                        );
                      }

                      return filteredSopTemplates.map((tmpl) => {
                        const isExpanded = expandedSopId === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            className={`border rounded-xl transition-all overflow-hidden ${
                              isExpanded ? "border-violet-300 bg-violet-50/10 shadow-sm" : "border-slate-150 hover:border-slate-300 bg-white"
                            }`}
                          >
                            {/* Card Header */}
                            <div
                              onClick={() => setExpandedSopId(isExpanded ? null : tmpl.id)}
                              className="p-3 cursor-pointer flex justify-between items-start gap-2.5 hover:bg-slate-50/30"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm mt-0.5">{tmpl.icon}</span>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h5 className="font-bold text-[11.5px] text-slate-800 leading-snug">{tmpl.title}</h5>
                                    <span className="px-1.5 py-0.5 bg-violet-50 text-[8px] text-violet-700 font-bold tracking-wide uppercase rounded">
                                      {tmpl.category}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">{tmpl.description}</p>
                                </div>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-violet-600" : ""}`} />
                            </div>

                            {/* Card Expanded Content */}
                            {isExpanded && (
                              <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/30 space-y-3">
                                <div className="flex flex-col gap-1 text-[9px] font-mono border-b border-slate-100 pb-2">
                                  <div className="flex justify-between text-slate-500">
                                    <span>STANDARDS TIER:</span>
                                    <span className="font-bold text-violet-700">{tmpl.badge}</span>
                                  </div>
                                  <div className="flex justify-between text-slate-500">
                                    <span>REQUIREMENT:</span>
                                    <span className="font-bold text-slate-700">{tmpl.difficulty}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Paragraph-by-Paragraph Outline</span>
                                  <div className="space-y-1.5">
                                    {tmpl.structure.map((sect, sidx) => (
                                      <div key={sidx} className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] leading-relaxed font-sans">
                                        <span className="font-bold text-slate-800 block mb-0.5">{sect.section}</span>
                                        <p className="text-slate-500">{sect.detail}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleLoadSopTemplate(tmpl)}
                                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Load into Chat Base</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. DASHBOARD TAB */}
            {activeTab === "dashboard" && (() => {
              const gpaVal = parseFloat(profile.gpa) || 0;
              const ieltsVal = parseFloat(profile.ielts) || 0;
              const budgetVal = profile.budget;
              const countryVal = profile.targetCountry;

              let gpaStrength = "Developing";
              let gpaColor = "text-rose-700 bg-rose-50 border-rose-200";
              if (gpaVal >= 3.8) {
                gpaStrength = "Elite Merit";
                gpaColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
              } else if (gpaVal >= 3.5) {
                gpaStrength = "Excellent";
                gpaColor = "text-teal-700 bg-teal-50 border-teal-200";
              } else if (gpaVal >= 3.0) {
                gpaStrength = "Strong";
                gpaColor = "text-violet-700 bg-violet-50 border-violet-200";
              } else if (gpaVal >= 2.5) {
                gpaStrength = "Moderate";
                gpaColor = "text-amber-700 bg-amber-50 border-amber-200";
              }

              let ieltsLevel = "Needs Attention";
              let ieltsColor = "text-rose-700 bg-rose-50 border-rose-200";
              if (ieltsVal >= 7.5) {
                ieltsLevel = "Expert (C1/C2)";
                ieltsColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
              } else if (ieltsVal >= 6.5) {
                ieltsLevel = "Proficient (B2+)";
                ieltsColor = "text-teal-700 bg-teal-50 border-teal-200";
              } else if (ieltsVal >= 6.0) {
                ieltsLevel = "Competent (B2)";
                ieltsColor = "text-violet-700 bg-violet-50 border-violet-200";
              } else if (ieltsVal >= 5.5) {
                ieltsLevel = "Modest (B1)";
                ieltsColor = "text-amber-700 bg-amber-50 border-amber-200";
              }

              let budgetLevel = "Budget-Conscious";
              let budgetColor = "text-amber-700 bg-amber-50 border-amber-200";
              if (budgetVal === "high") {
                budgetLevel = "Premium Standard";
                budgetColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
              } else if (budgetVal === "medium") {
                budgetLevel = "Sufficient (Sperrkonto Ready)";
                budgetColor = "text-violet-700 bg-violet-50 border-violet-200";
              }

              let compositeScore = 50;
              if (gpaVal >= 3.8) compositeScore += 25;
              else if (gpaVal >= 3.5) compositeScore += 20;
              else if (gpaVal >= 3.0) compositeScore += 15;
              else if (gpaVal >= 2.5) compositeScore += 10;
              else compositeScore += 5;

              if (ieltsVal >= 7.0) compositeScore += 20;
              else if (ieltsVal >= 6.5) compositeScore += 15;
              else if (ieltsVal >= 6.0) compositeScore += 10;
              else if (ieltsVal >= 5.5) compositeScore += 5;

              if (budgetVal === "high") compositeScore += 10;
              else if (budgetVal === "medium") compositeScore += 8;
              else compositeScore += 4;

              const isGermany = countryVal.toLowerCase().includes("germany");
              const isSweden = countryVal.toLowerCase().includes("sweden");
              const isFinland = countryVal.toLowerCase().includes("finland");
              const isPoland = countryVal.toLowerCase().includes("poland");

              if (isGermany) {
                if (gpaVal < 3.0) compositeScore -= 12;
                if (budgetVal === "low") compositeScore -= 12;
              } else if (isSweden || isFinland) {
                if (budgetVal === "low") compositeScore -= 12;
              } else if (isPoland) {
                if (gpaVal >= 2.5) compositeScore += 5;
                if (budgetVal === "low") compositeScore += 3;
              }

              compositeScore = Math.min(100, Math.max(20, compositeScore));

              let scoreColor = "text-rose-600 stroke-rose-500";
              let bgStrokeColor = "stroke-rose-100";
              let scoreLabel = "Challenging Feasibility";
              let ratingDesc = "Your academic or financial profile needs adjustment or human consultant mapping.";
              if (compositeScore >= 85) {
                scoreColor = "text-emerald-600 stroke-emerald-500";
                bgStrokeColor = "stroke-emerald-100";
                scoreLabel = "Optimal Feasibility";
                ratingDesc = "Excellent compatibility! Profile strongly meets typical entrance metrics.";
              } else if (compositeScore >= 70) {
                scoreColor = "text-teal-600 stroke-teal-500";
                bgStrokeColor = "stroke-teal-100";
                scoreLabel = "Highly Feasible Path";
                ratingDesc = "Solid profile. Meets standard requirements for public higher studies.";
              } else if (compositeScore >= 50) {
                scoreColor = "text-amber-600 stroke-amber-500";
                bgStrokeColor = "stroke-amber-100";
                scoreLabel = "Moderate Feasibility";
                ratingDesc = "Feasible, with strategic university shortlists or potential profile boosting.";
              }

              const radius = 40;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (compositeScore / 100) * circumference;

              return (
                <motion.div
                  key="dashboard-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-wider text-violet-700 bg-violet-50 rounded-full font-bold">
                        Dynamic Study Profile
                      </span>
                      <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">
                        Welcome to your Consultancy Command Hub
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 max-w-xl">
                        Update your study metrics to instantly customize university recommendations and visa feasibility reports.
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (user?.tier === "free" || !user) {
                            handleTriggerPayment("entry");
                          } else {
                            setShowReportViewer(true);
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-100"
                      >
                        <Download className="h-4 w-4" />
                        <span>{user?.tier === "free" || !user ? "Unlock Suitability Evaluation (৳30)" : "View Pathway Report"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-violet-600" />
                          <h3 className="font-display font-bold text-sm text-slate-900">Your Academic Metrics & Consultancy Profile</h3>
                        </div>
                        
                        {!isEditingProfile ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-700 text-[11px] font-bold rounded-lg"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="px-2.5 py-1 text-slate-500 text-[11px] font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveProfile}
                              className="flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Candidate Full Name</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.fullName || ""}
                            onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Nazmul Bijoy"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Goal Degree Focus</label>
                          <select
                            disabled={!isEditingProfile}
                            value={profile.targetDegree}
                            onChange={(e) => setProfile(prev => ({ ...prev, targetDegree: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="Bachelor's">Bachelor's Degree</option>
                            <option value="Master's">Master's Degree</option>
                            <option value="PhD">Doctorate / PhD</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Prior Degree / Background</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.previousDegree || ""}
                            onChange={(e) => setProfile(prev => ({ ...prev, previousDegree: e.target.value }))}
                            placeholder="B.Sc. in Computer Science"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Prior Academic Institution</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.previousInstitution || ""}
                            onChange={(e) => setProfile(prev => ({ ...prev, previousInstitution: e.target.value }))}
                            placeholder="Dhaka University"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold flex justify-between">
                            <span>CGPA (out of 4.00)</span>
                            {gpaError && <span className="text-rose-500 text-[10px] animate-pulse">{gpaError}</span>}
                          </label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.gpa}
                            onChange={(e) => handleGpaChange(e.target.value)}
                            className={`w-full p-2.5 rounded-xl border bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none ${
                              gpaError ? "border-rose-300 focus:ring-rose-500/25 focus:border-rose-500" : "border-slate-200 focus:ring-violet-500/25 focus:border-violet-500"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold flex justify-between">
                            <span>IELTS / Language Score</span>
                            {ieltsError && <span className="text-rose-500 text-[10px] animate-pulse">{ieltsError}</span>}
                          </label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.ielts}
                            onChange={(e) => handleIeltsChange(e.target.value)}
                            className={`w-full p-2.5 rounded-xl border bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none ${
                              ieltsError ? "border-rose-300 focus:ring-rose-500/25 focus:border-rose-500" : "border-slate-200 focus:ring-violet-500/25 focus:border-violet-500"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Funding Budget Tier</label>
                          <select
                            disabled={!isEditingProfile}
                            value={profile.budget}
                            onChange={(e) => setProfile(prev => ({ ...prev, budget: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="low">Affordable (৳5L - ৳8L / year)</option>
                            <option value="medium">Medium (৳10L - ৳15L / year - Standard Blocked)</option>
                            <option value="high">Premium (৳18L+ / year)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-semibold">Target Budget Limit (Custom)</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profile.budgetAmount || ""}
                            onChange={(e) => setProfile(prev => ({ ...prev, budgetAmount: e.target.value }))}
                            placeholder="৳10L - ৳15L / year"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        {/* Preferred countries select chips */}
                        <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                          <label className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Preferred Schengen Destinations (Select Multiple)</label>
                          <div className="flex flex-wrap gap-2">
                            {["Germany", "Sweden", "Finland", "Poland"].map(country => {
                              const isSelected = (profile.preferredCountries || []).includes(country);
                              return (
                                <button
                                  key={country}
                                  type="button"
                                  disabled={!isEditingProfile}
                                  onClick={() => {
                                    const current = profile.preferredCountries || [];
                                    let updated = [];
                                    if (isSelected) {
                                      updated = current.filter(c => c !== country);
                                      if (updated.length === 0) updated = ["Germany"]; // Prevent empty fallback
                                    } else {
                                      updated = [...current, country];
                                    }
                                    setProfile(prev => ({ 
                                      ...prev, 
                                      preferredCountries: updated,
                                      targetCountry: updated[0] || "Germany"
                                    }));
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                                    isSelected 
                                      ? "bg-violet-600 text-white border-violet-600" 
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-75"
                                  }`}
                                >
                                  {country === "Germany" && "🇩🇪 Germany"}
                                  {country === "Sweden" && "🇸🇪 Sweden"}
                                  {country === "Finland" && "🇫🇮 Finland"}
                                  {country === "Poland" && "🇵🇱 Poland"}
                                  {isSelected && <span className="text-[9px]">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Desired fields chips */}
                        <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                          <label className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Desired Fields of Study (Select Multiple)</label>
                          <div className="flex flex-wrap gap-1.5">
                            {["Computer Science", "Data Science", "Software Engineering", "Business Administration", "Finance & Economics", "Electrical Engineering", "Mechanical Engineering", "Biotechnology"].map(field => {
                              const isSelected = (profile.desiredFields || []).includes(field);
                              return (
                                <button
                                  key={field}
                                  type="button"
                                  disabled={!isEditingProfile}
                                  onClick={() => {
                                    const current = profile.desiredFields || [];
                                    let updated = [];
                                    if (isSelected) {
                                      updated = current.filter(f => f !== field);
                                      if (updated.length === 0) updated = ["Computer Science"];
                                    } else {
                                      updated = [...current, field];
                                    }
                                    setProfile(prev => ({ 
                                      ...prev, 
                                      desiredFields: updated,
                                      targetSubject: updated[0] || "Computer Science"
                                    }));
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                                    isSelected 
                                      ? "bg-violet-600 text-white border-violet-600" 
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-75"
                                  }`}
                                >
                                  {field}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="lg:col-span-1 space-y-6 flex flex-col">
                      {/* AI Smart CV Scan Card */}
                      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-violet-600" />
                          <h4 className="font-display font-semibold text-md text-slate-900">AI Smart CV Auto-Profiler</h4>
                        </div>
                        
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Upload your academic CV/Resume (PDF/Word). Our AI will instantly analyze and auto-populate your entire student profile!
                        </p>

                        {cvIsScanning ? (
                          <div className="p-5 border border-dashed border-violet-300 bg-violet-50/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
                              <FileText className="h-5 w-5 text-violet-600 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-violet-800">{cvScanProgress}% Scanned</span>
                              <p className="text-[10px] text-slate-500 animate-pulse">{cvScanStep}</p>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-violet-600 h-full rounded-full transition-all duration-300" style={{ width: `${cvScanProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-slate-250 hover:border-violet-400 bg-slate-50/30 hover:bg-violet-50/10 transition-all rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer group">
                            <input 
                              type="file" 
                              accept=".pdf,.doc,.docx,.txt" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCvUpload(e.target.files[0]);
                                }
                              }} 
                            />
                            <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl mb-3 text-slate-400 group-hover:text-violet-600 group-hover:scale-105 transition-all">
                              <Download className="h-5 w-5 rotate-180" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Drag & drop or Click to upload CV</span>
                              <span className="text-[9.5px] text-slate-400 block mt-0.5">Supports PDF, DOCX, TXT up to 10MB</span>
                            </div>
                          </label>
                        )}

                        {profile.cvParsed && profile.cvFileName && (
                          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-150 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold block truncate text-slate-800">{profile.cvFileName}</span>
                              <span className="text-[9px] font-medium text-slate-500 block">Parsed successfully • {profile.cvFileSize || "154 KB"}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Destination Insight Card */}
                      <div className="bg-slate-50 text-slate-900 rounded-3xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-violet-600" />
                            <h4 className="font-display font-semibold text-md">Destination Insight: {profile.targetCountry}</h4>
                          </div>
                          
                          <div className="space-y-3 text-xs text-slate-600">
                            <p>
                              Your target destination is highly viable for a <strong className="text-slate-900">{profile.targetDegree}</strong> program in <strong className="text-slate-900">{profile.targetSubject}</strong>.
                            </p>
                            
                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-violet-600 block font-bold">Eligibility Guidance</span>
                              <p className="text-[11px] leading-relaxed">
                                {Number(profile.gpa) >= 3.0 ? "✅ Excellent CGPA! Public tuition-free universities are heavily receptive." : "⚠️ GPA is moderately competitive. Private pathways or credit transfer is suggested."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 mt-6 flex justify-between items-center text-xs">
                          <span className="text-slate-500">Consultancy Status</span>
                          <span className="px-2 py-0.5 bg-violet-100 text-violet-700 border border-violet-200 rounded-full font-mono text-[10px] font-bold uppercase">
                            READY TO EVALUATE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Academic Audit Panel */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                      <Award className="h-5.5 w-5.5 text-violet-650" />
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900">Real-Time Academic & Visa Feasibility Deep Audit</h3>
                        <p className="text-xs text-slate-500">Live calculation of eligibility parameters for Schengen Student Visas from Bangladesh.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      {/* Left: Score Wheel */}
                      <div className="md:col-span-4 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              className="fill-none stroke-slate-200"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              className={`fill-none ${scoreColor}`}
                              strokeWidth="8"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-display font-bold text-slate-950">{compositeScore}%</span>
                            <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400">COMPLIANCE</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">{scoreLabel}</h4>
                          <p className="text-[10.5px] text-slate-500 leading-relaxed max-w-[220px]">{ratingDesc}</p>
                        </div>
                      </div>

                      {/* Right: Metrics Audit Checklist & Status */}
                      <div className="md:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${gpaColor}`}>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">CGPA Quality Indicator</span>
                            <span className="text-sm font-bold">{profile.gpa} / 4.00</span>
                            <span className="text-[10px] font-medium leading-tight">Strength: {gpaStrength}</span>
                          </div>

                          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${ieltsColor}`}>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">English Language Capacity</span>
                            <span className="text-sm font-bold">IELTS {profile.ielts}</span>
                            <span className="text-[10px] font-medium leading-tight">Tier: {ieltsLevel}</span>
                          </div>

                          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${budgetColor}`}>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">Financial Readiness</span>
                            <span className="text-sm font-bold capitalize">{profile.budget === "high" ? "৳18L+ / Year" : profile.budget === "medium" ? "৳10L - ৳15L / Year" : "৳5L - ৳8L / Year"}</span>
                            <span className="text-[10px] font-medium leading-tight">{budgetLevel}</span>
                          </div>

                          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${Object.values(reviewRequestedDocs).filter(Boolean).length > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">Counselor Sync Status</span>
                            <span className="text-sm font-bold">{Object.values(reviewRequestedDocs).filter(Boolean).length} Docs</span>
                            <span className="text-[10px] font-medium leading-tight">
                              {Object.values(reviewRequestedDocs).filter(Boolean).length > 0 ? "Awaiting Verification" : "All Clear"}
                            </span>
                          </div>
                        </div>

                        {/* European Compliance Checks */}
                        <div className="space-y-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest font-mono">Schengen Compliance Metrics</h4>
                          
                          <div className="space-y-2.5">
                            {/* Blocked Account compliance */}
                            <div className="flex items-start gap-2.5 text-[11px]">
                              {budgetVal !== "low" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                              ) : (
                                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-850">Sperrkonto / German Blocked Account Check</span>
                                <p className="text-slate-500 text-[10px] leading-relaxed">
                                  {budgetVal !== "low" 
                                    ? "Verified! Your budget profile satisfies standard German/Swedish maintenance funding rules (~€11,904 block)." 
                                    : "Warning: Low budget profile might require fully-funded scholarships or alternative EU paths (e.g. Poland / Italian regional waivers)."}
                                </p>
                              </div>
                            </div>

                            {/* IELTS Threshold */}
                            <div className="flex items-start gap-2.5 text-[11px]">
                              {ieltsVal >= 6.5 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                              ) : ieltsVal >= 6.0 ? (
                                <CheckCircle2 className="w-4 h-4 text-teal-650 shrink-0 mt-0.5" />
                              ) : (
                                <HelpCircle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-850">University IELTS Admission Threshold</span>
                                <p className="text-slate-500 text-[10px] leading-relaxed">
                                  {ieltsVal >= 6.5 
                                    ? "Optimal score! Meets 95% of standard European English master's pathways." 
                                    : ieltsVal >= 6.0 
                                    ? "Borderline score. Eligible for general public programs, but higher-ranking tracks often require IELTS 6.5." 
                                    : "Requires retake or specific non-IELTS alternative programs (like MOI or internal tests in lower-barrier states)."}
                                </p>
                              </div>
                            </div>

                            {/* Subject Alignment */}
                            <div className="flex items-start gap-2.5 text-[11px]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-850">Field Credit Compatibility Index</span>
                                <p className="text-slate-500 text-[10px] leading-relaxed">
                                  Your desired subject <span className="text-violet-700 font-semibold">"{profile.targetSubject}"</span> is analyzed. Ensure your Bachelor's transcripts possess at least 120 ECTS or equivalent credits in matching fields to pass stringent German consecutive criteria.
                                </p>
                              </div>
                            </div>

                            {/* Visa Success Ratio */}
                            <div className="flex items-start gap-2.5 text-[11px]">
                              {compositeScore >= 75 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                              ) : (
                                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-850">Estimated Dhaka Embassy Visa Approval Potential</span>
                                <p className="text-slate-500 text-[10px] leading-relaxed">
                                  {compositeScore >= 85 
                                    ? "Excellent success metrics. Proper SOP + solid paperwork results in high visa approval rates." 
                                    : compositeScore >= 70 
                                    ? "Strong profile. Focus closely on writing an exquisite Statement of Purpose (SOP)." 
                                    : "High rejection risk in standard German public channels. We recommend considering Poland or obtaining formal admissions from Sweden."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SOP & Application Next Steps */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-850">Expert Next Step Recommendation (Bangladesh-to-Schengen Zone)</span>
                        <p className="text-slate-500">Use our AI Chatbot to draft a customized Statement of Purpose (SOP) tailored for your target "{profile.targetSubject}" program.</p>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("chat"); addToast("Ready to draft your SOP!", "success"); }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer"
                      >
                        <span>Draft SOP with AI</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Destination Visa Intelligence Section */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <Globe className="h-5.5 w-5.5 text-violet-600" />
                        <div>
                          <h3 className="font-display font-bold text-base text-slate-900">Destination Visa Intelligence</h3>
                          <p className="text-xs text-slate-500">Live visa wait times, processing speeds, and guidelines via Google Search grounding.</p>
                        </div>
                      </div>

                      {/* Preferred country select chips for lookup */}
                      <div className="flex flex-wrap gap-1.5">
                        {(profile.preferredCountries || ["Germany"]).map((country) => (
                          <button
                            key={country}
                            onClick={() => setSelectedDestinationCountry(country)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedDestinationCountry === country
                                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {country === "Germany" && "🇩🇪 Germany"}
                            {country === "Sweden" && "🇸🇪 Sweden"}
                            {country === "Finland" && "🇫🇮 Finland"}
                            {country === "Poland" && "🇵🇱 Poland"}
                            {country !== "Germany" && country !== "Sweden" && country !== "Finland" && country !== "Poland" && country}
                          </button>
                        ))}
                      </div>
                    </div>

                    {destinationInfoLoading ? (
                      <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
                        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">Grounding latest embassy databases...</p>
                          <p className="text-xs text-slate-400">Fetching real-time Dhaka embassy wait times and speeds for {selectedDestinationCountry}</p>
                        </div>
                      </div>
                    ) : destinationInfoError ? (
                      <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center space-y-3">
                        <Info className="h-6 w-6 text-rose-500" />
                        <p className="text-xs font-semibold text-rose-700">{destinationInfoError}</p>
                        <button
                          onClick={() => {
                            // Clear cache for this country and trigger refetch
                            setDestinationInfoCache(prev => {
                              const updated = { ...prev };
                              delete updated[selectedDestinationCountry];
                              return updated;
                            });
                            setReloadTrigger(prev => prev + 1);
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                        >
                          Retry Live Search
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Intelligence report content */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 md:p-6 space-y-3">
                          <div className="prose prose-slate max-w-none">
                            {destinationInfoCache[selectedDestinationCountry] ? (
                              renderFormattedText(destinationInfoCache[selectedDestinationCountry].text)
                            ) : (
                              <p className="text-xs text-slate-400 italic animate-pulse">Loading live intelligence search...</p>
                            )}
                          </div>
                        </div>

                        {/* Citations and Sources */}
                        {destinationInfoCache[selectedDestinationCountry]?.sources && destinationInfoCache[selectedDestinationCountry].sources.length > 0 && (
                          <div className="space-y-2.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                              Grounded Search Sources ({destinationInfoCache[selectedDestinationCountry].sources.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {destinationInfoCache[selectedDestinationCountry].sources.map((source, index) => (
                                <a
                                  key={index}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-medium transition-all"
                                >
                                  <span className="max-w-[200px] truncate">{source.title}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span>Grounding engine: Google Search Live</span>
                            <span>Last updated: Live on request</span>
                          </div>
                          <button
                            onClick={() => handleExportIntelligence("visa")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold rounded-xl text-[11px] font-sans transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Data</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Destination Academic & Career Prospects Section */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="h-5.5 w-5.5 text-indigo-600" />
                        <div>
                          <h3 className="font-display font-bold text-base text-slate-900">Destination Academic & Career Prospects</h3>
                          <p className="text-xs text-slate-500">Education system overview, top universities, and post-study work rights via Google Search grounding.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold rounded-full">
                        {selectedDestinationCountry} Academic Profile
                      </span>
                    </div>

                    {destinationAcademicLoading ? (
                      <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">Grounding latest academic datasets...</p>
                          <p className="text-xs text-slate-400">Fetching education framework, top schools, and work opportunities for {selectedDestinationCountry}</p>
                        </div>
                      </div>
                    ) : destinationAcademicError ? (
                      <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center space-y-3">
                        <Info className="h-6 w-6 text-rose-500" />
                        <p className="text-xs font-semibold text-rose-700">{destinationAcademicError}</p>
                        <button
                          onClick={() => {
                            setDestinationAcademicCache(prev => {
                              const updated = { ...prev };
                              delete updated[selectedDestinationCountry];
                              return updated;
                            });
                            setReloadTrigger(prev => prev + 1);
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                        >
                          Retry Academic Search
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Academic report content */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 md:p-6 space-y-3">
                          <div className="prose prose-slate max-w-none">
                            {destinationAcademicCache[selectedDestinationCountry] ? (
                              renderFormattedText(destinationAcademicCache[selectedDestinationCountry].text)
                            ) : (
                              <p className="text-xs text-slate-400 italic animate-pulse">Loading live academic search...</p>
                            )}
                          </div>
                        </div>

                        {/* Citations and Sources */}
                        {destinationAcademicCache[selectedDestinationCountry]?.sources && destinationAcademicCache[selectedDestinationCountry].sources.length > 0 && (
                          <div className="space-y-2.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                              Grounded Academic Sources ({destinationAcademicCache[selectedDestinationCountry].sources.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {destinationAcademicCache[selectedDestinationCountry].sources.map((source, index) => (
                                source ? (
                                  <a
                                    key={index}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-medium transition-all"
                                  >
                                    <span className="max-w-[200px] truncate">{source.title}</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                  </a>
                                ) : null
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span>Grounding engine: Google Search Live</span>
                            <span>Last updated: Live on request</span>
                          </div>
                          <button
                            onClick={() => handleExportIntelligence("academic")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] font-sans transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Data</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {/* 3. PRICING & STUDY PLANS TAB */}
            {activeTab === "pricing" && (
              <motion.div
                key="pricing-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2 max-w-xl mx-auto mb-6">
                  <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
                    <span>Our Study Abroad Consultancy Tiers</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Transparent, value-focused service models crafted specifically for Bangladesh applicants to Schengen Zone universities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                  
                  {/* Free */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-50/50 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono tracking-widest uppercase font-bold">Tier 01</span>
                        <h4 className="font-display font-black text-base text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">FREE Pathway</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">Unlimited AI chatbot interactions.</p>
                      </div>
                      <div className="text-2xl font-display font-black text-slate-900">
                        ৳0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
                      </div>
                      <ul className="space-y-2.5 text-[11px] text-slate-650 font-medium">
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Unlimited AI chat</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Step-by-step guideline</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Bangla + English support</span>
                        </li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => { setActiveTab("chat"); addToast("Start chatting!", "info"); }}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      Access Chat
                    </button>
                  </div>

                  {/* Entry */}
                  <div className="bg-white border-2 border-violet-500/80 rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 flex flex-col justify-between space-y-6 relative group cursor-pointer hover:-translate-y-1">
                    <span className="absolute -top-3 right-4 px-2.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-[8px] font-mono tracking-widest uppercase font-bold shadow-sm shadow-violet-200">
                      POPULAR REPORT
                    </span>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-[9px] font-mono tracking-widest uppercase font-bold">Tier 02</span>
                        <h4 className="font-display font-black text-base text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">ENTRY-Level</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">Instant Suitability Map report.</p>
                      </div>
                      <div className="text-2xl font-display font-black text-slate-900">
                        ৳30 <span className="text-xs text-slate-400 font-normal">/ instant</span>
                      </div>
                      <ul className="space-y-2.5 text-[11px] text-slate-650 font-medium">
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Suitability evaluation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>University Shortlists Map</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Downloadable PDF</span>
                        </li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => handleTriggerPayment("entry")}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-200 transition-all active:scale-95 cursor-pointer"
                    >
                      {user?.tier === "entry" ? "View Report" : "Get Report"}
                    </button>
                  </div>

                  {/* Structured */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-50/50 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono tracking-widest uppercase font-bold">Tier 03</span>
                        <h4 className="font-display font-black text-base text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">STRUCTURED</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">AI with human advisor validation.</p>
                      </div>
                      <div className="text-2xl font-display font-black text-slate-900">
                        ৳100 - ৳500
                      </div>
                      <ul className="space-y-2.5 text-[11px] text-slate-650 font-medium">
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Human expert evaluation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Admission risk analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Checklists review</span>
                        </li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => handleTriggerPayment("structured")}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      Upgrade Structured
                    </button>
                  </div>

                  {/* Premium */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-50/50 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono tracking-widest uppercase font-bold">Tier 04</span>
                        <h4 className="font-display font-black text-base text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">PREMIUM Mentorship</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">End-to-end advisory backup.</p>
                      </div>
                      <div className="text-2xl font-display font-black text-slate-900">
                        ৳5,500 <span className="text-xs text-slate-400 font-normal">/ complete</span>
                      </div>
                      <ul className="space-y-2.5 text-[11px] text-slate-650 font-medium">
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Matched alumni mentor</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Professional SOP writing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Visa mock interviews</span>
                        </li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => handleTriggerPayment("premium")}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      Purchase Premium
                    </button>
                  </div>

                  {/* Elite */}
                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-150 rounded-2xl p-6 hover:shadow-lg hover:shadow-violet-100/40 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-pointer hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-violet-150 text-violet-700 rounded text-[9px] font-mono tracking-widest uppercase font-bold">Tier 05</span>
                        <h4 className="font-display font-black text-base text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">ELITE Board</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">Full board management.</p>
                      </div>
                      <div className="text-xl font-display font-black text-slate-900">
                        Call for Details
                      </div>
                      <ul className="space-y-2.5 text-[11px] text-slate-650 font-medium">
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Professor outreach</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Scholarship negotiations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="p-0.5 bg-emerald-50 rounded text-emerald-600 border border-emerald-100/50">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>Direct representation</span>
                        </li>
                      </ul>
                    </div>
                    <a 
                      href="https://wa.me/8801841800841"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white text-xs text-center font-bold rounded-xl shadow-md shadow-violet-100 transition-all active:scale-95"
                    >
                      WhatsApp Us
                    </a>
                  </div>

                </div>

                {/* FAQ section */}
                <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-4">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <h3 className="font-display text-lg font-medium text-slate-900 flex items-center justify-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-violet-600" />
                      {language === "bn" ? "সেনজেন ভিসা ও প্রসেস প্রশ্নোত্তর" : "Schengen Visa & Process FAQs"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "bn" 
                        ? "ব্লকড অ্যাকাউন্ট, প্রয়োজনীয় নথিপত্র এবং এম্বেসির সময়সীমা সংক্রান্ত সাধারণ প্রশ্নগুলোর সহজ উত্তর।"
                        : "Get instant answers to the most common questions about Blocked Accounts, document checklists, and embassy timelines."}
                    </p>
                  </div>

                  {/* FAQ Search Bar & Sorting */}
                  <div className="max-w-2xl mx-auto pt-2 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 rounded-2xl shadow-xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={faqSearchQuery}
                        onChange={(e) => {
                          setFaqSearchQuery(e.target.value);
                          setExpandedFaqId(null);
                        }}
                        placeholder={language === "bn" ? "প্রশ্ন বা উত্তর খুঁজুন..." : "Search FAQs by question or answer..."}
                        className="block w-full rounded-2xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 focus:outline-hidden transition-all shadow-xs"
                      />
                      {faqSearchQuery && (
                        <button
                          onClick={() => setFaqSearchQuery("")}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Sort By:</span>
                      <select
                        value={faqSortOrder}
                        onChange={(e) => setFaqSortOrder(e.target.value)}
                        className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-xs"
                      >
                        <option value="default">{language === "bn" ? "ডিফল্ট" : "Default"}</option>
                        <option value="az">{language === "bn" ? "অ আ ক খ (A-Z)" : "Alphabetical (A-Z)"}</option>
                        <option value="za">{language === "bn" ? "খ ক আ অ (Z-A)" : "Alphabetical (Z-A)"}</option>
                        <option value="popular">{language === "bn" ? "সর্বাধিক পঠিত" : "Most Popular"}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="max-w-3xl mx-auto space-y-2.5 pt-4">
                    {(() => {
                      let filteredFaqs = FAQ_ITEMS.filter(faq => {
                        const query = faqSearchQuery.toLowerCase().trim();
                        if (!query) return true;
                        return (
                          faq.question.toLowerCase().includes(query) ||
                          faq.answer.toLowerCase().includes(query)
                        );
                      });

                      // Apply Sorting
                      if (faqSortOrder === "az") {
                        filteredFaqs = [...filteredFaqs].sort((a, b) => a.question.localeCompare(b.question));
                      } else if (faqSortOrder === "za") {
                        filteredFaqs = [...filteredFaqs].sort((a, b) => b.question.localeCompare(a.question));
                      } else if (faqSortOrder === "popular") {
                        filteredFaqs = [...filteredFaqs].sort((a, b) => (b.views || 0) - (a.views || 0));
                      }

                      if (filteredFaqs.length === 0) {
                        return (
                          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">
                              {language === "bn" ? "কোনো মিল পাওয়া যায়নি!" : "No matching questions found."}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {language === "bn" ? "অন্য কোনো শব্দ দিয়ে আবার চেষ্টা করুন।" : "Try searching with different keywords."}
                            </p>
                          </div>
                        );
                      }

                      return filteredFaqs.map((faq) => {
                        const isExpanded = expandedFaqId === faq.id;
                        return (
                          <div key={faq.id} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs hover:border-slate-300/80 transition-all">
                            <button
                              onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                              className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/40 cursor-pointer"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-violet-600 uppercase tracking-widest">{faq.category}</span>
                                <span className="text-xs font-medium text-slate-800 leading-snug">
                                  {faq.question}
                                </span>
                              </div>
                              <span className="shrink-0 p-1 bg-slate-50 rounded-lg text-slate-400">
                                <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180 text-violet-600" : ""}`} />
                              </span>
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                >
                                  <div className="px-5 pb-4 pt-3 border-t border-slate-100 bg-slate-50/20 space-y-3">
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {faq.answer}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] text-slate-400 font-medium">
                                        {faq.views?.toLocaleString()} views • Schengen Advisor Verified
                                      </span>
                                      <button
                                        onClick={() => handleCopyFaq(faq.answer, faq.id)}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                                      >
                                        {copiedFaqId === faq.id ? "Copied!" : "Copy Answer"}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4. PROGRESS TRACKER TAB */}
            {activeTab === "tracker" && (
              <motion.div
                key="tracker-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                    <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-violet-600" />
                      Schengen Visa Milestone Progress Map
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Track ID: #GAH-{user ? user.id.slice(4, 9) : "GUEST"}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 relative">
                      <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-emerald-200" />
                      <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 flex items-center justify-center text-white z-10 shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800">Stage 1: Student Profile Validation</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Filled academic parameters (GPA: {profile.gpa}, IELTS: {profile.ielts}) to map eligibility constraints.
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono font-bold uppercase">
                          COMPLETED
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-emerald-200" />
                      <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 flex items-center justify-center text-white z-10 shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800">Stage 2: Target Country Selection</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Designated {profile.targetCountry} as target destination path to study {profile.targetDegree}.
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono font-bold uppercase">
                          COMPLETED
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-slate-200" />
                      <div className="w-5.5 h-5.5 rounded-full bg-violet-600 ring-4 ring-violet-50 flex items-center justify-center text-white z-10 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-xl border border-violet-100 shadow-sm">
                        <h4 className="text-xs font-bold text-violet-800">Stage 3: University Shortlist Map</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Reviewing public university shortlists in {profile.targetCountry} for {profile.targetSubject}.
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              if (user?.tier === "free" || !user) {
                                handleTriggerPayment("entry");
                              } else {
                                setShowReportViewer(true);
                              }
                            }}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded text-[11px] font-bold shadow-sm transition-all"
                          >
                            Generate Shortlist Report
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-200 flex items-center justify-center text-white z-10 shrink-0" />
                      <div className="flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100 opacity-60">
                        <h4 className="text-xs font-bold text-slate-400">Stage 4: Visa and SOP Submissions</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Formulating document files, writing custom statement papers, and checking bank parameters.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. PAYMENTS TAB */}
            {activeTab === "payments" && (
              <motion.div
                key="payments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">Your Transaction History</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Simulated records of all consultancy upgrades.</p>
                    </div>
                    
                    <button
                      onClick={() => handleTriggerPayment("entry")}
                      className="px-3.5 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-xs font-bold"
                    >
                      Simulate Payment
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                          <th className="p-3">Transaction ID</th>
                          <th className="p-3">Consultancy Level</th>
                          <th className="p-3">Payment Method</th>
                          <th className="p-3">Verified Contact / Card</th>
                          <th className="p-3 text-right">Amount Paid</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map(pay => (
                          <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-mono text-slate-400 font-semibold">{pay.id}</td>
                            <td className="p-3 font-semibold text-slate-800 capitalize">{pay.tier} Tier</td>
                            <td className="p-3 capitalize font-semibold">{pay.method}</td>
                            <td className="p-3 text-slate-500">{pay.phone}</td>
                            <td className="p-3 text-right font-bold text-slate-900">৳{pay.amount}</td>
                            <td className="p-3 text-center">
                              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold">
                                {pay.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono">{new Date(pay.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. WHATSAPP & MESSENGER CHANNEL TAB */}
            {activeTab === "channels" && (
              <motion.div
                key="channels-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-[10px] font-mono tracking-wider uppercase mb-3">
                      <Sparkles className="h-3 w-3" /> Mobile Chatbot Gateways
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900">Global Academy Hub on Your Phone</h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      Connect our expert AI advisor directly to your favorite messaging platforms. Get instant answers regarding blocked accounts, course searches, and visa procedures.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-slate-900">WhatsApp AI Counselor</h4>
                            <span className="inline-block text-[10px] text-emerald-600 font-mono font-medium">● ACTIVE & SYNCED</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Access comprehensive Schengen study guides, direct admissions support, and blocked account estimations instantly via WhatsApp.
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Official Hotline</span>
                          <span className="font-mono font-bold text-slate-800">+880 01841800841</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center p-6 bg-slate-50/50 border border-slate-100 rounded-2xl mb-6">
                        <div className="flex flex-col items-center space-y-3">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Hotline Linked</span>
                          <span className="text-lg font-bold text-slate-850">+880 01841800841</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a 
                        href="https://wa.me/8801841800841" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="h-4 w-4" /> Start WhatsApp Chat
                      </a>
                    </div>
                  </div>

                  {/* Messenger */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-slate-900">Messenger AI Counselor</h4>
                            <span className="inline-block text-[10px] text-blue-600 font-mono font-medium">● ACTIVE & SYNCED</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Connect with our Facebook page and start instant messenger chats. Retrieve evaluations instantly.
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Facebook Page</span>
                          <span className="font-semibold text-slate-800">Global Academy Hub Pathway</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a 
                        href="https://m.me/EasyToEurope" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="h-4 w-4" /> Open in Messenger
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INTERVIEW SIMULATOR */}
            {activeTab === "simulator" && (
              <motion.div
                key="simulator-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-violet-100">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Schengen Visa Interview Simulator
                  </h2>
                  <p className="text-xs sm:text-sm text-violet-100 mt-2">
                    Practice answering real visa interview questions. Submit your recorded or typed transcript to receive immediate expert review scores and actionable recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">
                          Active Question
                        </span>
                        <button
                          onClick={handleSelectRandomQuestion}
                          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Random Question</span>
                        </button>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-4">
                        "{currentSimQuestion}"
                      </h3>

                      <div className="flex gap-2.5 mt-5">
                        <button
                          onClick={handleSuggestSampleAnswer}
                          className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl px-3 py-1.5 font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Suggest Sample Answer</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest">
                          Practice Arena
                        </h4>
                        {isRecording && (
                          <span className="text-xs text-red-600 font-bold">RECORDING ({recordingDuration}s)</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        {!isRecording ? (
                          <button
                            onClick={handleStartRecording}
                            className="w-16 h-16 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Mic className="w-6 h-6" />
                          </button>
                        ) : (
                          <button
                            onClick={handleStopRecording}
                            className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse"
                          >
                            <Square className="w-6 h-6" />
                          </button>
                        )}
                        <span className="text-xs font-bold text-slate-700 mt-4">
                          {isRecording ? "Listening... Speak now" : "Click to record your voice"}
                        </span>
                      </div>

                      {audioBlobUrl && (
                        <div className="bg-violet-50 p-4 rounded-xl flex justify-between items-center">
                          <span className="text-xs font-bold text-violet-800">Your practice audio note:</span>
                          <audio src={audioBlobUrl} controls className="h-8 max-w-full" />
                        </div>
                      )}

                      <textarea
                        value={transcribingText}
                        onChange={(e) => setTranscribingText(e.target.value)}
                        placeholder="Speak to transcribe, or type your answer here..."
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:outline-none"
                      />

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={handleSavePracticeAttempt}
                          className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold"
                        >
                          Save Attempt to Log
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest">
                        Practice Logs & Evaluation
                      </h4>

                      {practiceAttempts.length === 0 ? (
                        <p className="text-xs text-slate-400">No practice attempts logged yet. Complete a trial above!</p>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {practiceAttempts.map((attempt) => (
                            <div key={attempt.id} className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3 relative group">
                              <button
                                onClick={() => handleDeletePracticeAttempt(attempt.id)}
                                className="absolute right-2 top-2 text-slate-400 hover:text-red-600 text-xs"
                              >
                                ✕
                              </button>
                              
                              <h5 className="text-xs font-bold text-slate-800">Q: {attempt.question}</h5>
                              <p className="text-xs text-slate-500 italic">"{attempt.transcript}"</p>

                              {attempt.status === "pending" ? (
                                <button
                                  onClick={() => handleRequestExpertReview(attempt.id)}
                                  className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1.5 rounded-lg font-bold"
                                >
                                  Request AI & Consultant Review
                                </button>
                              ) : (
                                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                    <div className="bg-white p-1 rounded font-bold">Fluency: {attempt.scores?.fluency}/10</div>
                                    <div className="bg-white p-1 rounded font-bold">Relevance: {attempt.scores?.relevance}/10</div>
                                    <div className="bg-white p-1 rounded font-bold">Grammar: {attempt.scores?.grammar}/10</div>
                                    <div className="bg-violet-100 p-1 rounded font-bold text-violet-700">Total: {attempt.scores?.overall}/10</div>
                                  </div>
                                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 leading-relaxed font-medium">
                                    <strong>Advisors note:</strong> {attempt.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DOCUMENT CHECKLIST TAB */}
            {activeTab === "checklist" && (() => {
              const applicableDocs = ALL_DOCUMENTS.filter(doc => {
                const matchesCountry = !doc.countries || doc.countries.includes(profile.targetCountry);
                const matchesDegree = !doc.degrees || doc.degrees.includes(profile.targetDegree);
                return matchesCountry && matchesDegree;
              });

              const filteredDocs = applicableDocs.filter(doc => {
                const matchesCategory = checklistFilter === "all" || doc.category === checklistFilter;
                const searchLower = checklistSearchQuery.toLowerCase().trim();
                const matchesSearch = !searchLower || 
                  doc.titleEn.toLowerCase().includes(searchLower) || 
                  doc.titleBn.toLowerCase().includes(searchLower) ||
                  doc.descEn.toLowerCase().includes(searchLower) ||
                  doc.descBn.toLowerCase().includes(searchLower);
                
                return matchesCategory && matchesSearch;
              });

              const totalCount = applicableDocs.length;
              const completedCount = applicableDocs.filter(doc => checkedDocs[doc.id]).length;
              const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              // Format template tags
              const formatText = (text: string) => {
                return text
                  .replace("{profile.ielts}", profile.ielts || "not provided")
                  .replace("{profile.gpa}", profile.gpa || "not provided")
                  .replace("{profile.targetCountry}", profile.targetCountry)
                  .replace("{profile.targetDegree}", profile.targetDegree)
                  .replace("{profile.targetSubject}", profile.targetSubject);
              };

              const handleToggleDoc = (id: string) => {
                setCheckedDocs(prev => ({
                  ...prev,
                  [id]: !prev[id]
                }));
              };

              const handleToggleReviewRequest = (id: string, e: React.MouseEvent) => {
                e.stopPropagation(); // Prevent toggling the checkbox when clicking the sync button
                setReviewRequestedDocs(prev => {
                  const newState = {
                    ...prev,
                    [id]: !prev[id]
                  };
                  if (newState[id]) {
                    addToast("Document flagged for counselor verification", "success");
                  } else {
                    addToast("Verification request cancelled", "info");
                  }
                  return newState;
                });
              };

              const handleResetChecklist = () => {
                if (confirm("Are you sure you want to clear all checked items in your checklist?")) {
                  setCheckedDocs({});
                  addToast("Checklist reset successfully", "info");
                }
              };

              const handleDownloadChecklistPdf = () => {
                try {
                  const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                  });

                  const pageWidth = doc.internal.pageSize.getWidth();
                  const pageHeight = doc.internal.pageSize.getHeight();
                  const margin = 15;
                  const contentWidth = pageWidth - (margin * 2);
                  const todayStr = new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  });

                  let y = margin + 12;

                  const drawHeaderAndFooter = () => {
                    // Header thin bar
                    doc.setFillColor(124, 58, 237); // violet-600
                    doc.rect(0, 0, pageWidth, 10, "F");
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8);
                    doc.text("GLOBAL ACADEMY HUB  •  SCHENGEN STUDY VISA BLUEPRINT", margin, 6.5);
                    doc.text(todayStr, pageWidth - margin, 6.5, { align: "right" });

                    // Footer text on every page
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(7.5);
                    doc.setTextColor(148, 163, 184);
                    doc.text("© 2026 Global Academy Hub. Developed by Md Nazmul Islam, NB TECH BD", margin, pageHeight - 8);
                    doc.text("Confidential Visa Planner", pageWidth - margin, pageHeight - 8, { align: "right" });
                  };

                  const checkPageSpace = (heightNeeded: number) => {
                    if (y + heightNeeded > pageHeight - margin - 8) {
                      doc.addPage();
                      y = margin + 12;
                      drawHeaderAndFooter();
                    }
                  };

                  // Initial header call
                  drawHeaderAndFooter();

                  // Document Title Block
                  doc.setTextColor(124, 58, 237);
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(15);
                  doc.text("Study Visa Document Checklist & Blueprint", margin, y);
                  y += 5.5;

                  doc.setTextColor(71, 85, 105);
                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(8.5);
                  doc.text("A customized, structured checklist designed to ensure zero visa rejection rates.", margin, y);
                  y += 8;

                  // Section: Student Profile Summary
                  checkPageSpace(32);
                  doc.setFillColor(248, 250, 252);
                  doc.rect(margin, y, contentWidth, 28, "F");
                  doc.setDrawColor(226, 232, 240);
                  doc.rect(margin, y, contentWidth, 28, "S");

                  doc.setTextColor(30, 41, 59);
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(9.5);
                  doc.text("APPLICANT STUDENT PROFILE SUMMARY", margin + 5, y + 6);

                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(8.5);
                  doc.setTextColor(71, 85, 105);
                  doc.text(`Target Country: ${profile.targetCountry}`, margin + 5, y + 12);
                  doc.text(`Target Degree: ${profile.targetDegree}`, margin + 5, y + 17);
                  doc.text(`Chosen Subject: ${profile.targetSubject}`, margin + 5, y + 22);

                  // Middle column profile data
                  doc.text(`Academic GPA: ${profile.gpa} / 4.00`, margin + 65, y + 12);
                  doc.text(`IELTS Band Score: ${profile.ielts}`, margin + 65, y + 17);
                  doc.text(`Financial Budget Track: ${profile.budget.toUpperCase()}`, margin + 65, y + 22);

                  // Progress right indicator box
                  doc.setFillColor(124, 58, 237);
                  doc.rect(margin + contentWidth - 35, y + 4, 30, 20, "F");
                  doc.setTextColor(255, 255, 255);
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(14);
                  doc.text(`${percentComplete}%`, margin + contentWidth - 20, y + 12, { align: "center" });
                  doc.setFontSize(7);
                  doc.text("PREPARATION", margin + contentWidth - 20, y + 17, { align: "center" });
                  doc.text(`${completedCount} of ${totalCount} READY`, margin + contentWidth - 20, y + 21, { align: "center" });

                  y += 34;

                  // Section: Country-Specific Critical Visa Notes
                  checkPageSpace(38);
                  
                  let embassyNotes = "";
                  if (profile.targetCountry === "Germany") {
                    embassyNotes = "A German study visa requires activating a Blocked Account (Sperrkonto) with precisely EUR 11,904 in an approved provider (such as Expatrio/Fintiba). Ensure to secure your visa slot at the Dhaka German Embassy 3-4 months in advance as slots are extremely competitive. All your academic certificates and transcripts must undergo legal verification and physical attestation from the Education Board, Education Ministry, and Ministry of Foreign Affairs (MoFA) of Bangladesh before your interview.";
                  } else if (profile.targetCountry === "Sweden") {
                    embassyNotes = "For Swedish student residence permits, you must demonstrate a minimum of SEK 10,314 per month (approx SEK 103,140 for a standard 10-month school year) inside your personal, single-owner bank account. Sweden's application is processed completely online via the Swedish Migration Agency. Ensure you do not deposit sudden large amounts of cash without clear, documented tax sources of sponsor income.";
                  } else if (profile.targetCountry === "Finland") {
                    embassyNotes = "Finland requires demonstrating a minimum of EUR 800 per month (EUR 9,600 for a 1-year study permit) in the student's personal bank account (joint accounts, third-party sponsors, or distant relatives are strictly rejected). You must also present the original paid tuition fee receipt from your Finnish university and buy a comprehensive private health insurance policy spanning your entire study duration.";
                  } else if (profile.targetCountry === "Poland") {
                    embassyNotes = "Poland student visas require paying your full first-year tuition fee upfront. Because Poland does not run an active student visa office in Dhaka, Bangladeshi students must travel and apply through the Embassy of Poland in New Delhi, India. Flawless professional sponsorship files, travel insurance coverage, and official academic board attestations are essential to prevent rejection.";
                  } else {
                    embassyNotes = "Ensure all your academic certificates, mark sheets, and transcripts are physically attested by the Ministry of Education and Ministry of Foreign Affairs (MoFA) in Dhaka, Bangladesh. Ensure your sponsoring bank account is maintained at a trusted commercial bank with clear, traceable sources of income such as tax certificates, salary slips, or trade licenses.";
                  }

                  const formattedNotes = embassyNotes;
                  const notesLines = doc.splitTextToSize(formattedNotes, contentWidth - 10);
                  const notesBoxHeight = 10 + (notesLines.length * 4);

                  checkPageSpace(notesBoxHeight);
                  doc.setFillColor(239, 246, 255); // light-blue background
                  doc.setDrawColor(191, 219, 254);
                  doc.rect(margin, y, contentWidth, notesBoxHeight, "F");
                  doc.rect(margin, y, contentWidth, notesBoxHeight, "S");

                  doc.setTextColor(30, 58, 138); // dark blue
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(8.5);
                  doc.text(`CRITICAL EMBASSY ADVICE & FINANCIAL MANDATES FOR ${profile.targetCountry.toUpperCase()}`, margin + 5, y + 5);

                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(8);
                  doc.setTextColor(30, 41, 59);
                  let noteY = y + 10;
                  notesLines.forEach((line: string) => {
                    doc.text(line, margin + 5, noteY);
                    noteY += 4;
                  });

                  y += notesBoxHeight + 8;

                  // Helper function to render a document item beautifully
                  const drawDocItem = (docItem: any, index: number, isChecked: boolean) => {
                    const statusText = isChecked ? "[X] READY" : "[ ] PENDING";
                    const statusColor = isChecked ? [16, 185, 129] : [100, 116, 139]; // Green vs Gray

                    const formattedDesc = formatText(docItem.descEn);
                    const descLines = doc.splitTextToSize(formattedDesc, contentWidth - 25);
                    
                    const deadlineAlert = ATTESTATION_DEADLINES[profile.targetCountry]?.[docItem.id];
                    let extraHeight = 0;
                    let alertLines: string[] = [];
                    if (deadlineAlert) {
                      alertLines = doc.splitTextToSize(`ATTESTATION WARNING: ${deadlineAlert.alertEn}`, contentWidth - 25);
                      extraHeight = (alertLines.length * 3.8) + 2;
                    }

                    const itemHeight = 6 + (descLines.length * 4.2) + extraHeight + 3;

                    checkPageSpace(itemHeight);

                    // Checkbox/Status
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8);
                    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
                    doc.text(statusText, margin, y);

                    // Document Title
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.setTextColor(15, 23, 42);
                    doc.text(`${index}. ${docItem.titleEn}`, margin + 20, y);

                    // Category tag
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.setTextColor(124, 58, 237);
                    doc.text(`(${docItem.category.toUpperCase()})`, margin + contentWidth - 5, y, { align: "right" });

                    y += 4.5;

                    // Description text
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(71, 85, 105);

                    descLines.forEach((line: string) => {
                      doc.text(line, margin + 20, y);
                      y += 4.2;
                    });

                    // Draw Attestation Alert if present
                    if (deadlineAlert) {
                      y += 1;
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(7.5);
                      doc.setTextColor(180, 83, 9); // Amber-700
                      
                      alertLines.forEach((line: string) => {
                        doc.text(line, margin + 20, y);
                        y += 3.8;
                      });
                    }

                    y += 3; // Space after item
                  };

                  // Filter the checked and unchecked documents
                  const checkedList = applicableDocs.filter(d => checkedDocs[d.id]);
                  const uncheckedList = applicableDocs.filter(d => !checkedDocs[d.id]);

                  // Draw SECTION: COMPLETED DOCUMENTS
                  checkPageSpace(15);
                  doc.setTextColor(16, 185, 129); // Green
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(10.5);
                  doc.text("II. READY & COMPLETED DOCUMENTS", margin, y);
                  y += 4;
                  doc.setDrawColor(16, 185, 129);
                  doc.setLineWidth(0.4);
                  doc.line(margin, y, pageWidth - margin, y);
                  y += 6;

                  if (checkedList.length === 0) {
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(8.5);
                    doc.setTextColor(148, 163, 184);
                    doc.text("No documents marked as ready yet. Begin gathering files below.", margin + 5, y);
                    y += 8;
                  } else {
                    checkedList.forEach((docItem, idx) => {
                      drawDocItem(docItem, idx + 1, true);
                    });
                  }

                  // Draw SECTION: PENDING / REQUIRED DOCUMENTS
                  y += 4;
                  checkPageSpace(15);
                  doc.setTextColor(219, 39, 119); // Rose-600 / Pink
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(10.5);
                  doc.text("III. PENDING / REQUIRED DOCUMENTS IN-PROGRESS", margin, y);
                  y += 4;
                  doc.setDrawColor(219, 39, 119);
                  doc.setLineWidth(0.4);
                  doc.line(margin, y, pageWidth - margin, y);
                  y += 6;

                  if (uncheckedList.length === 0) {
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.setTextColor(16, 185, 129);
                    doc.text("Congratulations! You have completed all required documentation for your Schengen Visa.", margin + 5, y);
                    y += 8;
                  } else {
                    uncheckedList.forEach((docItem, idx) => {
                      drawDocItem(docItem, idx + 1, false);
                    });
                  }

                  // Final closing recommendations and footer details
                  y += 4;
                  checkPageSpace(22);
                  doc.setDrawColor(226, 232, 240);
                  doc.setLineWidth(0.3);
                  doc.line(margin, y, pageWidth - margin, y);
                  y += 6;

                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(8.5);
                  doc.setTextColor(30, 41, 59);
                  doc.text("GLOBAL ACADEMY HUB DHAKA CONSULTANCY OFFICE", margin, y);
                  y += 4;

                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(7.5);
                  doc.setTextColor(100, 116, 139);
                  doc.text("Office: Building 2, Mullick Villa, House-519 Road No-01, Dhanmondi, Dhaka 1205. Phone: +8801346582060", margin, y);
                  y += 3.5;
                  doc.text("Disclaimer: GAH provides visa checklist advice based on official immigration guidelines. Final decisions lie with the respective Embassies.", margin, y);

                  doc.save(`GAH_Schengen_Visa_Blueprint_${profile.targetCountry}.pdf`);
                  addToast("Checklist successfully exported to PDF!", "success");
                } catch (err: any) {
                  console.error("PDF generation failed:", err);
                  addToast("Failed to generate PDF.", "error");
                }
              };

              return (
                <motion.div
                  key="checklist-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Top Dashboard Banner */}
                  <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono tracking-wider uppercase">
                        <GraduationCap className="h-3.5 w-3.5 text-violet-200" /> 
                        {language === "bn" ? "ভিসা পেপারওয়ার্ক গাইড" : "Visa Paperwork Blueprint"}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-bold">
                        {language === "bn" ? `${profile.targetCountry} স্টুডেন্ট ভিসা ডকুমেন্ট চেকলিস্ট` : `${profile.targetCountry} Student Visa Document Checklist`}
                      </h2>
                      <p className="text-xs md:text-sm text-indigo-100 leading-relaxed">
                        {language === "bn" 
                          ? `আপনার প্রোফাইল অনুযায়ী (${profile.targetDegree} ডিগ্রী, IELTS ${profile.ielts}, CGPA ${profile.gpa}) শেনজেনভুক্ত দেশে আবেদন করার প্রয়োজনীয় নথিপত্র নিচে দেওয়া হলো।`
                          : `Customized specifically for your profile (${profile.targetDegree} Degree, IELTS ${profile.ielts}, CGPA ${profile.gpa}) to ensure zero rejection rates at the Dhaka Embassy.`}
                      </p>
                    </div>

                    {/* Progress Wheel */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 w-full md:w-auto">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" className="fill-none stroke-white/10" strokeWidth="3" />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="16" 
                            className="fill-none stroke-violet-300" 
                            strokeWidth="3" 
                            strokeDasharray="100" 
                            strokeDashoffset={100 - percentComplete}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-xs font-bold font-mono text-white">{percentComplete}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-violet-200 block font-bold">
                          {language === "bn" ? "প্রস্তুতির অগ্রগতি" : "Preparation Progress"}
                        </span>
                        <span className="text-sm font-bold block">{completedCount} of {totalCount} Ready</span>
                        <p className="text-[9px] text-indigo-200">
                          {percentComplete === 100 
                            ? (language === "bn" ? "সব পেপার রেডি! আপনি সম্পূর্ণ প্রস্তুত।" : "Outstanding! All documents prepared.")
                            : (language === "bn" ? "বাকি ফাইলগুলো রেডি করুন।" : "Complete the rest of your files.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visa Readiness Advice / Tips Alert Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Country Specific Specific Insight */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 md:col-span-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <MapPin className="h-5 w-5 text-indigo-650" />
                        <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wide">
                          {language === "bn" ? `${profile.targetCountry} এর জন্য বিশেষ ভিসা টিপস` : `Critical Embassy Advice for ${profile.targetCountry}`}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {profile.targetCountry === "Germany" && (
                          language === "bn" 
                            ? "জার্মান স্টুডেন্ট ভিসার জন্য অন্যতম শর্ত হলো 'Sperrkonto' বা ব্লকড অ্যাকাউন্ট। আপনাকে অবশ্যই এফডিআর বা ফ্যামিলি ফান্ড থেকে Expatrio/Fintiba-তে ১১,৯০৪ ইউরো জমা দিতে হবে। এছাড়া ঢাকা জার্মান দূতাবাসে ফিজিক্যাল ইন্টারভিউয়ের মুখোমুখি হতে হবে এবং আপনার সমস্ত কাগজপত্র পররাষ্ট্র মন্ত্রণালয় থেকে সত্যায়িত হতে হবে।"
                            : "A German visa is contingent on activating your Blocked Account (Sperrkonto) with €11,904. Make sure to schedule your Embassy appointment in Dhaka at least 3-4 months ahead as slots are highly competitive. All academic files must be verified prior to the interview."
                        )}
                        {profile.targetCountry === "Sweden" && (
                          language === "bn" 
                            ? "সুইডেনের ক্ষেত্রে কোনো ব্লকড অ্যাকাউন্টের প্রয়োজন নেই, তবে নিজের ব্যক্তিগত ব্যাংক অ্যাকাউন্টে কমপক্ষে ১০৩,১৪০ SEK সমপরিমাণ টাকা প্রায় ৩ মাসের জন্য দেখাতে হবে। সুইডিশ মাইগ্রেশন এজেন্সির ওয়েবসাইট থেকে সম্পূর্ণ আবেদনটি অনলাইনে সাবমিট করা হয় এবং বায়োমেট্রিকের জন্য সুইডিশ দূতাবাসে যেতে হয়।"
                            : "For Sweden, funds (SEK 103,140 for 10 months) must remain inside your personal bank account. Sweden's student residence permit is processed completely online. Avoid depositing sudden large sums of money in your account without showing source of funds."
                        )}
                        {profile.targetCountry === "Finland" && (
                          language === "bn" 
                            ? "ফিনল্যান্ডের জন্য আপনার নিজের ব্যাংক অ্যাকাউন্টে কমপক্ষে ৯,৬০০ ইউরো থাকতে হবে। ফিনল্যান্ড মাইগ্রেশন বোর্ড টাকার উৎসের ব্যাপারে অনেক কঠোর, তাই আপনার বা আপনার স্পন্সরের আয়ের বৈধ প্রমাণ থাকতে হবে। এছাড়া প্রথম বছরের টিউশন ফি পরিশোধের মূল রসিদটি দূতাবাসে জমা দিতে হবে।"
                            : "Finland demands €9,600 inside the student's personal account. Finland is extremely rigorous about bank account ownership (no joint accounts or distant relatives). You must also purchase a comprehensive international health insurance policy."
                        )}
                        {profile.targetCountry === "Poland" && (
                          language === "bn" 
                            ? "পোল্যান্ড স্টুডেন্ট ভিসার জন্য প্রথম বছরের টিউশন ফি এবং আবাসন ভাড়া পরিশোধের রসিদ আবশ্যিক। আপনার স্পন্সরের ব্যাংক স্টেটমেন্টে পর্যাপ্ত তহবিল দেখাতে হবে। ঢাকা থেকে পোল্যান্ডের কোনো দূতাবাস সরাসরি সার্ভিস দেয় না, তাই দিল্লিতে গিয়ে অথবা ভারতের পোলিশ দূতাবাসে ভিসার জন্য আবেদন সাবমিট করতে হয়।"
                            : "Poland student visas require paying tuition for the first year upfront. Since Poland does not have a functioning student visa embassy in Dhaka, Bangladeshi students often apply through the Embassy in New Delhi, India. Flawless sponsorship files are vital."
                        )}
                      </p>
                    </div>

                    {/* Dynamic Status Badges for Profile Score Card */}
                    <div className="bg-slate-50 text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono tracking-widest text-violet-600 block font-bold uppercase">
                          {language === "bn" ? "প্রোফাইল সতর্কতা" : "Profile Audit Flag"}
                        </span>
                        <h4 className="font-display font-bold text-xs text-slate-800">
                          {language === "bn" ? "দূতাবাস রেট ইমপ্যাক্ট" : "Dhk Embassy Viability"}
                        </h4>
                        <div className="space-y-1.5 text-[11px] text-slate-600 leading-normal">
                          {Number(profile.ielts) < 6.0 ? (
                            <p className="text-rose-600 font-semibold">
                              ⚠️ IELTS Score is Low ({profile.ielts}): Most embassies will flag this. Consider a retake to raise it to 6.5!
                            </p>
                          ) : (
                            <p className="text-emerald-600">
                              ✓ IELTS score is excellent ({profile.ielts}). Highly compliant!
                            </p>
                          )}
                          {Number(profile.gpa) < 3.0 ? (
                            <p className="text-amber-600">
                              ⚠️ CGPA ({profile.gpa}) is below 3.00. Expect academic consistency queries during your visa interview.
                            </p>
                          ) : (
                            <p className="text-emerald-600">
                              ✓ CGPA is superb ({profile.gpa}). Excellent academic standings!
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                        <span>Profile Quality</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${Number(profile.ielts) >= 6.5 && Number(profile.gpa) >= 3.0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                          {Number(profile.ielts) >= 6.5 && Number(profile.gpa) >= 3.0 ? "HIGH PASS" : "REVIEW NEEDED"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Attestation & Submission Timeline Planner */}
                  <div className="bg-amber-50/40 border border-amber-200/70 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-amber-100">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                        <div>
                          <h4 className="font-display font-bold text-xs text-slate-950 uppercase tracking-wider">
                            {language === "bn" ? "ইন্টারেক্টিভ লিগালাইজেশন ও ডেডলাইন প্ল্যানার" : "Interactive Attestation & Submission Timeline Planner"}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {language === "bn" ? `টার্গেট দেশ: ${profile.targetCountry} (প্রোফাইল থেকে পরিবর্তনযোগ্য)` : `Target Destination: ${profile.targetCountry} (Syncs with Profile)`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-amber-200">
                        <span className="text-[11px] text-slate-600 font-bold">
                          {language === "bn" ? "টার্গেট ইনটেক সেমিস্টার:" : "Target Intake:"}
                        </span>
                        <select
                          value={targetIntake}
                          onChange={(e) => setTargetIntake(e.target.value)}
                          className="text-xs p-1 rounded-lg bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="october_2026">🍂 Winter Intake (Oct 2026)</option>
                          <option value="april_2027">🌸 Summer Intake (Apr 2027)</option>
                          <option value="october_2027">🍂 Winter Intake (Oct 2027)</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculated Dates Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-amber-100 flex flex-col justify-between space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 block mb-1">
                          {language === "bn" ? "১. বোর্ড ও পররাষ্ট্র মন্ত্রণালয় (MoFA) সত্যায়ন" : "1. Board & MoFA Attestation"}
                        </span>
                        <span className="text-sm font-extrabold text-amber-900 font-mono block">
                          {targetIntake === "october_2026" ? "June 15, 2026" : targetIntake === "april_2027" ? "December 15, 2026" : "June 15, 2027"}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-50 mt-1">
                          {language === "bn" 
                            ? "সনদপত্র বোর্ড, শিক্ষা এবং পররাষ্ট্র মন্ত্রণালয় থেকে সত্যায়ন করার প্রস্তাবিত শেষ সময়।" 
                            : "Physical attestation stamps must be processed through Dhaka Board & MoFA before this."}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-amber-100 flex flex-col justify-between space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 block mb-1">
                          {language === "bn" ? "২. ব্লকড অ্যাকাউন্ট / আর্থিক ব্যালেন্স" : "2. Funds Setup & Transfer"}
                        </span>
                        <span className="text-sm font-extrabold text-amber-900 font-mono block">
                          {targetIntake === "october_2026" ? "July 01, 2026" : targetIntake === "april_2027" ? "January 15, 2027" : "July 01, 2027"}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-50 mt-1">
                          {language === "bn" 
                            ? "ব্যাংক স্টেটমেন্ট ম্যাচিউর করা বা ব্লকড অ্যাকাউন্ট ফান্ড হস্তান্তরের চূড়ান্ত সময়।" 
                            : "Complete bank deposit transfers or let sponsor savings mature in full."}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-amber-100 flex flex-col justify-between space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 block mb-1">
                          {language === "bn" ? "৩. ভিসা ইন্টারভিউ ও স্লট সাবমিশন" : "3. Dhaka Visa Submission"}
                        </span>
                        <span className="text-sm font-extrabold text-amber-900 font-mono block">
                          {targetIntake === "october_2026" ? "August 01, 2026" : targetIntake === "april_2027" ? "February 01, 2027" : "August 01, 2027"}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-50 mt-1">
                          {language === "bn" 
                            ? "দূতাবাসে ফাইল জমা দেওয়ার প্রস্তাবিত সময় যাতে ক্লাস শুরুর আগেই ভিসা হাতে পান।" 
                            : "Submit your final visa paperwork to avoid missing your class start date."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-500/5 p-3 rounded-xl border border-amber-200/30">
                      <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                      <p className="leading-relaxed">
                        {language === "bn"
                          ? `সতর্কতা: ${profile.targetCountry} এর জন্য উপরোক্ত ডেডলাইনগুলো ঢাকা দূতাবাসের ফাইল জট এবং প্রসেসিং টাইমের গড় হিসেব অনুযায়ী নির্ধারণ করা হয়েছে। নির্দিষ্ট সময়ে কাজ শেষ করার চেষ্টা করুন।`
                          : `Timeline Note: These recommended attestation and deposit deadlines for ${profile.targetCountry} take Dhaka visa backlogs into account. Proceeding with these avoids late entry rejections.`}
                      </p>
                    </div>
                  </div>

                  {/* Main Checklist Card and Filters */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <h3 className="font-display font-bold text-base text-slate-900">
                          {language === "bn" ? "প্রয়োজনীয় নথিপত্রের তালিকা" : "Interactive Document Builder"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {language === "bn" 
                            ? "ফাইল রেডি করার সাথে সাথে চেকবক্স টিক দিন এবং শেষে একটি অফিসিয়াল পিডিএফ কপি ডাউনলোড করুন।"
                            : "Mark off items as you gather them. Click 'Export Checklist' to generate a physical PDF for records."}
                        </p>
                      </div>

                      {/* Header Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleResetChecklist}
                          className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 transition-all uppercase cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{language === "bn" ? "রিসেট করুন" : "Reset checks"}</span>
                        </button>
                        <button
                          onClick={handleDownloadChecklistPdf}
                          className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{language === "bn" ? "পিডিএফ ডাউনলোড" : "Export PDF Checklist"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Search and Category Filters Row */}
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                          type="text"
                          value={checklistSearchQuery}
                          onChange={(e) => setChecklistSearchQuery(e.target.value)}
                          placeholder={language === "bn" ? "ডকুমেন্টের নাম বা কীওয়ার্ড দিয়ে খুঁজুন..." : "Search documents by name or keyword..."}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        />
                        {checklistSearchQuery && (
                          <button
                            onClick={() => setChecklistSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-none border-b border-slate-100">
                      {[
                        { id: "all", labelEn: "All Documents", labelBn: "সকল কাগজপত্র" },
                        { id: "mandatory", labelEn: "Identity & Mandatory", labelBn: "বাধ্যতামূলক ও আইডেন্টিটি" },
                        { id: "financial", labelEn: "Financial Soundness", labelBn: "আর্থিক সক্ষমতার প্রমাণ" },
                        { id: "academic", labelEn: "Academic Papers", labelBn: "একাডেমিক ফাইলসমূহ" },
                        { id: "optional", labelEn: "Supporting & Optional", labelBn: "অতিরিক্ত কাগজপত্র" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setChecklistFilter(tab.id as any)}
                          className={`px-3 py-2 rounded-xl text-[10.5px] font-bold tracking-wider uppercase shrink-0 transition-all cursor-pointer ${
                            checklistFilter === tab.id
                              ? "bg-violet-600 text-white shadow-xs"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/40"
                          }`}
                        >
                          {language === "bn" ? tab.labelBn : tab.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Document list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((docItem) => {
                          const isChecked = !!checkedDocs[docItem.id];
                          return (
                            <div
                              key={docItem.id}
                              onClick={() => handleToggleDoc(docItem.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 select-none ${
                                isChecked 
                                  ? "bg-emerald-50/20 border-emerald-300 shadow-xs" 
                                  : "bg-white border-slate-150 hover:border-slate-250 hover:bg-slate-50/20"
                              }`}
                            >
                              {/* Checkbox circle */}
                              <div className="shrink-0 mt-0.5">
                                <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                                  isChecked 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-slate-300 bg-white text-transparent hover:border-violet-500"
                                }`}>
                                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                </div>
                              </div>

                              {/* Text and description details */}
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className={`text-[12.5px] font-bold ${isChecked ? "text-slate-800 line-through opacity-75" : "text-slate-900"}`}>
                                    {language === "bn" ? docItem.titleBn : docItem.titleEn}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase shrink-0 ${
                                    docItem.category === "mandatory" 
                                      ? "bg-rose-50 text-rose-700 border border-rose-100" 
                                      : docItem.category === "financial" 
                                      ? "bg-amber-50 text-amber-700 border border-amber-100" 
                                      : docItem.category === "academic" 
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                                      : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {docItem.category}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                  {language === "bn" ? formatText(docItem.descBn) : formatText(docItem.descEn)}
                                </p>

                                {/* Minor translated language subtitle */}
                                <p className="text-[10px] text-slate-400 italic">
                                  {language === "bn" ? `En: ${formatText(docItem.descEn)}` : `বাংলা: ${formatText(docItem.descBn)}`}
                                </p>

                                 {/* Country Specific Deadline Attestation Warning */}
                                {ATTESTATION_DEADLINES[profile.targetCountry]?.[docItem.id] && (
                                  <div className="mt-2.5 p-2 rounded-lg bg-amber-500/5 border border-amber-200/40 text-[10.5px] text-amber-800 font-semibold flex items-center gap-1.5 leading-snug">
                                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0 animate-pulse" />
                                    <span>
                                      {language === "bn" 
                                        ? ATTESTATION_DEADLINES[profile.targetCountry][docItem.id].alertBn 
                                        : ATTESTATION_DEADLINES[profile.targetCountry][docItem.id].alertEn}
                                    </span>
                                  </div>
                                )}

                                {/* Email Alerts Toggle */}
                                {ATTESTATION_DEADLINES[profile.targetCountry]?.[docItem.id] && (
                                  <div className="mt-2.5 p-3 rounded-xl bg-violet-50/40 border border-violet-100/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
                                        <span className="text-xs font-bold text-slate-800">
                                          {language === "bn" ? "ডেডলাইন ইমেইল এলার্ট" : "Get Email Alerts"}
                                        </span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleEmailAlert(docItem, ATTESTATION_DEADLINES[profile.targetCountry][docItem.id]);
                                        }}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                          emailAlerts[docItem.id] ? "bg-violet-600 justify-end" : "bg-slate-300 justify-start"
                                        }`}
                                      >
                                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                                      </button>
                                    </div>
                                    
                                    {emailAlerts[docItem.id] && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <input
                                          type="email"
                                          placeholder={language === "bn" ? "আপনার ইমেইল দিন" : "Enter your email"}
                                          value={emailAlertEmails[docItem.id] !== undefined ? emailAlertEmails[docItem.id] : emailAlertInputVal}
                                          onChange={(e) => handleEmailAlertAddressChange(docItem.id, e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-violet-500 font-medium"
                                        />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveEmailAlertAddress(docItem, ATTESTATION_DEADLINES[profile.targetCountry][docItem.id]);
                                          }}
                                          className="px-2.5 py-1 bg-violet-600 text-white rounded-lg text-[10px] font-bold hover:bg-violet-700 transition-colors cursor-pointer shrink-0"
                                        >
                                          {language === "bn" ? "সংরক্ষণ" : "Save"}
                                        </button>
                                      </div>
                                    )}

                                    {emailAlerts[docItem.id] && emailAlertEmails[docItem.id] && (
                                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium bg-slate-100/50 px-2 py-1 rounded-md">
                                        <span className="truncate">Active for: {emailAlertEmails[docItem.id]}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTriggerTestEmail(docItem.id, emailAlertEmails[docItem.id]);
                                          }}
                                          className="text-violet-600 hover:text-violet-700 font-bold hover:underline shrink-0 flex items-center gap-0.5"
                                        >
                                          <Send className="w-2.5 h-2.5" />
                                          <span>{language === "bn" ? "টেস্ট পাঠান" : "Test Now"}</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Sync with Counselor / Awaiting Verification */}
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    {reviewRequestedDocs[docItem.id] ? (
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-100 animate-pulse">
                                        <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
                                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                                          {language === "bn" ? "ভেরিফিকেশনের অপেক্ষায়" : "Awaiting Verification"}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-medium text-slate-400">
                                        {language === "bn" ? "কাউন্সেলর রিভিউ প্রয়োজন?" : "Need counselor review?"}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => handleToggleReviewRequest(docItem.id, e)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                      reviewRequestedDocs[docItem.id]
                                        ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                                        : "bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100"
                                    }`}
                                  >
                                    {reviewRequestedDocs[docItem.id] ? (
                                      <>
                                        <X className="w-3 h-3" />
                                        {language === "bn" ? "অনুরোধ বাতিল" : "Cancel Request"}
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="w-3 h-3" />
                                        {language === "bn" ? "কাউন্সেলর সিঙ্ক" : "Sync with Counselor"}
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <div className="p-3 bg-white rounded-full shadow-sm">
                            <Search className="h-6 w-6 text-slate-300" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">
                              {language === "bn" ? "কোনো ডকুমেন্ট খুঁজে পাওয়া যায়নি" : "No documents found"}
                            </p>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                              {language === "bn" 
                                ? `"${checklistSearchQuery}" এর সাথে মিলে এমন কোনো ফাইল নেই। দয়া করে ভিন্ন কীওয়ার্ড দিয়ে ট্রাই করুন।`
                                : `We couldn't find any documents matching "${checklistSearchQuery}". Try a different keyword.`}
                            </p>
                            <button
                              onClick={() => setChecklistSearchQuery("")}
                              className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
                            >
                              {language === "bn" ? "সার্চ ক্লিয়ার করুন" : "Clear search results"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SOP Assistance Hook */}
                    <div className="pt-5 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-violet-600" />
                          <span>{language === "bn" ? "প্রোফাইল ম্যাচড এআই রাইটার এসিস্ট্যান্স" : "Academic Integrity Assurance"}</span>
                        </span>
                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-2xl">
                          {language === "bn"
                            ? "আপনার উদ্দেশ্য বিবৃতি (Statement of Purpose - SOP) পেপারটি সুন্দরভাবে লিখতে আমাদের 'SOP Templates' ও 'AI Consultancy' ট্যাব ব্যবহার করুন।"
                            : "Your Statement of Purpose (SOP) requires meticulous academic tailoring to reflect continuous credits. Use our SOP Templates Library or chat to structure it correctly."}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("chat"); addToast("Ready to draft your SOP!", "success"); }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer"
                      >
                        <span>{language === "bn" ? "এআই দিয়ে এসওপি তৈরি" : "Begin SOP Drafting"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Email Alert Manager & Dispatch Logs Panel */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-display text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                              <Mail className="w-5 h-5 text-violet-600" />
                              <span>{language === "bn" ? "ডকুমেন্ট এলার্ট এবং নোটিফিকেশন হাব" : "Deadline Notifications Hub"}</span>
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {language === "bn"
                                ? "আপনার সক্রিয় ডেডলাইন এলার্ট ট্র্যাকার এবং ইমেইল ডিসপ্যাচ হিস্ট্রি।"
                                : "Manage your active subscription notifications and review sandbox email dispatch logs."}
                            </p>
                          </div>
                          
                          <button
                            onClick={fetchEmailAlertData}
                            className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 text-violet-700 hover:bg-violet-105 font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{language === "bn" ? "রিফ্রেশ" : "Refresh Hub"}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Active Subscriptions */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">
                              {language === "bn" ? "সক্রিয় সাবস্ক্রিপশনসমূহ" : "Active Alert Subscriptions"}
                            </h4>
                            {emailSubscriptions.length === 0 ? (
                              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-500 text-xs">
                                {language === "bn"
                                  ? "কোনো ডেডলাইন এলার্ট চালু নেই।"
                                  : "No active deadline email subscriptions. Toggle 'Get Email Alerts' on any checklist items above!"}
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {emailSubscriptions.map((sub: any) => (
                                  <div key={sub.id} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start justify-between gap-3 text-xs">
                                    <div className="space-y-1">
                                      <div className="font-bold text-slate-800">
                                        {language === "bn" ? sub.docTitleBn : sub.docTitle}
                                      </div>
                                      <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                        <span className="bg-violet-100 text-violet-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">{sub.country}</span>
                                        <span>•</span>
                                        <span className="font-medium">Buffer: {sub.days}</span>
                                        <span>•</span>
                                        <span className="font-mono text-slate-600">{sub.email}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleToggleEmailAlert({ id: sub.docId, titleEn: sub.docTitle, titleBn: sub.docTitleBn }, { days: sub.days })}
                                      className="text-rose-600 hover:text-rose-700 font-bold text-[10px] uppercase tracking-wider hover:underline shrink-0 cursor-pointer"
                                    >
                                      {language === "bn" ? "বাতিল" : "Unsubscribe"}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Email Dispatch History Logs */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono">
                              {language === "bn" ? "ইমেইল ডিসপ্যাচ হিস্ট্রি" : "Email Dispatch History"}
                            </h4>
                            {emailAlertLogs.length === 0 ? (
                              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-500 text-xs">
                                {language === "bn"
                                  ? "কোনো ইমেইল পাঠানোর লগ নেই।"
                                  : "No email dispatch history found. When you activate or test alerts, logs will appear here."}
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {emailAlertLogs.map((log: any) => (
                                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-mono text-[9px] text-slate-400 bg-slate-150 px-1 py-0.5 rounded">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                        log.status.includes("Sent Successfully")
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                          : "bg-blue-50 text-blue-700 border border-blue-100"
                                      }`}>
                                        {log.status}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="font-semibold text-slate-800 line-clamp-1">{log.subject}</div>
                                      <div className="text-[10px] text-slate-500">
                                        Recipient: <strong className="font-mono text-slate-600">{log.email}</strong>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Informational Note */}
                        <div className="p-3 bg-amber-500/5 border border-amber-200/30 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2 font-medium">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold">{language === "bn" ? "সার্ভার কনফিগারেশন নোট:" : "Integration Sandbox Details:"}</span>
                            <p className="text-slate-650 leading-relaxed text-[10px]">
                              {language === "bn"
                                ? "অ্যাপটি রিয়েল-টাইম SMTP ইমেইল ডেলিভারি সমর্থন করে। আপনি যদি আপনার জিমেইল বা ডোমেইন মেইল দিয়ে আসল ইমেইল পেতে চান, তবে আপনার `.env` ফাইলে SMTP_HOST, SMTP_USER এবং SMTP_PASS ভ্যালুগুলো যোগ করুন। কনফিগারেশন না থাকলে এটি সিকিউর স্যান্ডবক্স লগ হিসেবে উপরে হিস্ট্রি রেকর্ড করবে।"
                                : "This app fully integrates standard SMTP servers using nodemailer. To receive real emails, set up SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment's Secrets panel. If SMTP is not defined, alerts are safely preserved in our backend database and logged above."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ABOUT US TAB */}
            {activeTab === "about" && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 max-w-5xl mx-auto"
              >
                {/* About Us Hero Banner */}
                <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.15),transparent_50%)]" />
                  <div className="relative z-10 space-y-4 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold text-violet-200">
                      <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                      {language === "bn" ? "গ্লোবাল একাডেমি হাব" : "Global Academy Hub"}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
                      {language === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
                    </h1>
                    <p className="text-sm md:text-lg text-indigo-100 font-medium tracking-wide uppercase font-mono">
                      "where ambition meets opportunity"
                    </p>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-2xl">
                      {language === "bn"
                        ? "গ্লোবাল একাডেমি হাব বাংলাদেশ একটি বিশ্বস্ত এবং শিক্ষার্থী-বান্ধব উচ্চশিক্ষা কনসালটেন্সি ফার্ম। আমরা আপনার বিদেশের বিশ্ববিদ্যালয়ে ভর্তি, ভিসা প্রসেসিং ও আইইএলটিএস প্রস্তুতিতে দিচ্ছি সম্পূর্ণ গাইডলাইন।"
                        : "Global Academy Hub is a trusted and student‑oriented study abroad consultancy in Bangladesh, dedicated to guiding students who aspire to pursue higher education overseas."}
                    </p>
                  </div>
                </div>

                {/* Main Narrative split with Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Core Description Story */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                      <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                        <p>
                          <strong>Global Academy Hub</strong> is a trusted and student‑oriented study abroad consultancy in Bangladesh, dedicated to guiding students who aspire to pursue higher education overseas. We support students at every stage of their study abroad journey by providing professional counseling, coaching, and application support, ensuring a smooth and well‑informed process.
                        </p>
                        <p>
                          A key service of Global Academy Hub is personalized academic counseling to help students choose the right courses, universities, and countries. Our experienced counselors carefully assess each student’s academic background, career goals, interests, and financial capacity before offering tailored recommendations. This ensures that students select study options that align with both their current qualifications and future ambitions.
                        </p>
                        <p className="border-l-2 border-violet-500 pl-4 py-1 italic text-slate-500 font-mono text-[11px] uppercase tracking-wide">
                          Global Academy hub bd | Global Academy hub Bangladesh
                        </p>
                        <p>
                          In addition, we arrange IELTS preparation for students who need to meet English language requirements for admission and visa purposes. Our coaching approach focuses on building language skills, exam strategies, and student confidence, helping learners achieve competitive scores and meet international standards.
                        </p>
                        <p>
                          Global Academy Hub has expert file processing teams for major study destinations, including Australia, The UK, New Zealand, EU countries, Malaysia, and other popular international education hubs. Our specialists are highly knowledgeable about country‑specific admission procedures, visa requirements, and documentation standards. This expertise allows us to manage applications efficiently, accurately, and professionally.
                        </p>
                        <p>
                          We are officially connected with several universities and institutions abroad, which enables us to provide authentic information, up‑to‑date admission requirements, and direct application support. These official partnerships strengthen our credibility and help students access genuine study opportunities with confidence.
                        </p>
                        <p>
                          At Global Academy Hub, we believe studying abroad is a life‑changing opportunity. Our goal is not only to help students secure admission and visas but also to prepare them for academic success and personal growth in a global environment. From IELTS preparation and course selection to visa guidance and pre‑departure support, we remain committed to our students until they begin their international education journey.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mission, Vision, Destinations */}
                  <div className="space-y-6">
                    {/* Mission Card */}
                    <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-24 h-24 bg-violet-600/5 rounded-full blur-xl" />
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-xl border border-violet-200 text-violet-600">
                          <Award className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-sm tracking-wide uppercase text-slate-800">Our Mission</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Our Mission is to provide honest, professional, and student‑focused study abroad services that enable students to access quality global education and build successful international careers.
                      </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl" />
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-600">
                          <Compass className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-sm tracking-wide uppercase text-slate-800">Our Vision</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Our Vision is to become one of the most trusted study abroad consultancies in Bangladesh by maintaining excellence in counseling, IELTS coaching, admission support, and visa guidance, while building strong partnerships with universities worldwide.
                      </p>
                    </div>

                    {/* Quick Destinations Card */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                      <h3 className="font-display font-bold text-xs tracking-wider uppercase text-slate-900 pb-2 border-b border-slate-100">
                        Study Abroad Destinations
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in Australia</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in New Zealand</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in UK</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in Europe</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in Canada</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/40">Study in Asia</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Us & Counseling Request Form Section */}
                <div id="contact-us-section" className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Panel: Contact Info */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-display font-extrabold text-xl text-slate-900">
                          Contact Us for any Query
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Talk to an expert student advisor & get personalized guidance.
                        </p>
                      </div>

                      <div className="p-5 bg-violet-50/40 border border-violet-100 rounded-2xl space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                          A renowned study abroad advisor, Global Academy Hub is committed to helping students who wish to study for Bachelor’s, Master’s and Doctoral degrees abroad.
                        </p>

                        <div className="space-y-2.5 text-xs text-slate-700">
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-violet-600 shrink-0" />
                            <span className="font-mono font-bold">+8801346582060</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-violet-600 shrink-0" />
                            <span className="font-mono font-bold">contact@globalacademyhubbd.com</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-medium">Building 2, Mullick Villa, House-519 Road No-01, Dhanmondi, Dhaka 1205.</span>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold">Follow Our Channels</p>
                        <div className="flex flex-wrap gap-2">
                          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                            <span>Facebook</span>
                          </a>
                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                            <span>Instagram</span>
                          </a>
                          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                            <span>Youtube</span>
                          </a>
                          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                            <span>X-twitter</span>
                          </a>
                          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
                            <span>Tiktok</span>
                          </a>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-violet-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:text-violet-700 transition-all">
                            <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                            <span>Linkedin</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Counseling Request Form */}
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wide">
                          Get Personalized Counseling
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Fill out this form and book an appointment with our elite counselors instantly.
                        </p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!contactFirstName || !contactEmail || !contactPhone) {
                            addToast("Please fill out all required fields.", "error");
                            return;
                          }
                          setIsSubmittingContact(true);
                          setTimeout(() => {
                            setIsSubmittingContact(false);
                            addToast(`Awesome ${contactFirstName}! Your query has been logged. Our student advisor will contact you within 24 hours.`, "success");
                            setContactFirstName("");
                            setContactLastName("");
                            setContactEmail("");
                            setContactPhone("");
                            setContactQuestion("");
                          }, 1000);
                        }}
                        className="space-y-3.5 text-xs"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">First Name <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="Enter Your First Name"
                              value={contactFirstName}
                              onChange={(e) => setContactFirstName(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-medium transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">Last Name</label>
                            <input
                              type="text"
                              placeholder="Enter Your Last Name"
                              value={contactLastName}
                              onChange={(e) => setContactLastName(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-medium transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">Email <span className="text-rose-500">*</span></label>
                            <input
                              type="email"
                              required
                              placeholder="Email Address"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-medium font-mono transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-500 font-bold block">Phone <span className="text-rose-500">*</span></label>
                            <input
                              type="tel"
                              required
                              placeholder="Phone Number"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-medium font-mono transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-500 font-bold block">Question</label>
                          <textarea
                            placeholder="Question"
                            rows={3}
                            value={contactQuestion}
                            onChange={(e) => setContactQuestion(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-medium transition-all resize-none"
                          />
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            disabled={isSubmittingContact}
                            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-violet-100 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmittingContact ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Logging Request...</span>
                              </>
                            ) : (
                              <span>Get Personalized Counseling</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!contactFirstName || !contactEmail || !contactPhone) {
                                addToast("Please fill out at least First Name, Email and Phone to request an appointment.", "error");
                                return;
                              }
                              setIsSubmittingContact(true);
                              setTimeout(() => {
                                setIsSubmittingContact(false);
                                addToast(`Success! Your appointment has been booked. An expert advisor will contact you at ${contactPhone} shortly.`, "success");
                                setContactFirstName("");
                                setContactLastName("");
                                setContactEmail("");
                                setContactPhone("");
                                setContactQuestion("");
                              }, 1000);
                            }}
                            className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book An Appointment</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 px-8 text-center text-xs text-slate-400 shrink-0">
        <p className="font-semibold">© 2026 Global Academy Hub. All Rights Reserved.</p>
        <p className="mt-1">Office: Building 2, Mullick Villa, House-519 Road No-01, Dhanmondi, Dhaka 1205 | Hotline: +8801346582060 | Email: contact@globalacademyhubbd.com</p>
        <p className="mt-2 text-[10px] text-slate-300 font-mono tracking-wider">Developed by Md Nazmul Islam, NB TECH BD</p>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={(loggedUser) => {
              setUser(loggedUser);
              addToast(`Welcome back, ${loggedUser.name}!`, "success");
            }}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedTierForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-6 text-white relative">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  ✕
                </button>
                <h3 className="font-display font-bold text-lg">Secure Gateway Simulator</h3>
                <p className="text-violet-100 text-xs mt-1">Upgrading Pathway: <span className="uppercase font-mono font-bold text-white">{selectedTierForPayment}</span></p>
              </div>

              <form onSubmit={handleProcessPaymentSubmit} className="p-6 space-y-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold block mb-1">Select Payment Gateway</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bkash")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                        paymentMethod === "bkash" ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-200"
                      }`}
                    >
                      bKash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("nagad")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                        paymentMethod === "nagad" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200"
                      }`}
                    >
                      Nagad
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("stripe")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                        paymentMethod === "stripe" ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200"
                      }`}
                    >
                      Stripe
                    </button>
                  </div>
                </div>

                {paymentMethod !== "stripe" ? (
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold block">Mobile Wallet Number</label>
                    <input
                      type="tel"
                      placeholder="+880 1841800841"
                      required
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-semibold block">Credit Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        required
                        value={paymentCard}
                        onChange={(e) => setPaymentCard(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? "Authorizing..." : "Confirm & Authorize Upgrade"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suitability evaluation report */}
      <AnimatePresence>
        {showReportViewer && (
          <ReportViewer 
            profile={profile} 
            onClose={() => setShowReportViewer(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
