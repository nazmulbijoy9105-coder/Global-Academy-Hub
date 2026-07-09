// PREMIUM UI ENHANCEMENTS for App.tsx
// Add these patterns to your existing App.tsx for better UX

// ============================================
// 1. ENHANCED LOADING STATES (replace chatLoading spinner)
// ============================================

{chatLoading && (
  <div className="flex justify-start animate-fade-in-up">
    <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 shadow-elevated flex items-center gap-3.5 max-w-[80%]">
      <div className="relative w-5 h-5">
        <div className="absolute inset-0 rounded-full border-2 border-violet-200" />
        <div className="absolute inset-0 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
      <div className="space-y-1.5">
        <span className="text-xs text-slate-500 font-medium">Global Academy Hub is evaluating requirements...</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{animationDelay: '0ms'}} />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{animationDelay: '150ms'}} />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{animationDelay: '300ms'}} />
        </div>
      </div>
    </div>
  </div>
)}

// ============================================
// 2. PREMIUM TOAST NOTIFICATIONS (enhanced)
// ============================================

{toasts.map(toast => (
  <motion.div
    key={toast.id}
    initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
    exit={{ opacity: 0, y: -10, scale: 0.9, x: 20 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`p-4 rounded-2xl shadow-floating border text-xs font-medium flex items-center gap-3 min-w-[280px] max-w-sm glass-panel-strong ${
      toast.type === "success"
        ? "border-emerald-200/60 text-emerald-800"
        : toast.type === "error"
        ? "border-rose-200/60 text-rose-800"
        : "border-violet-200/60 text-violet-800"
    }`}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
      toast.type === "success" ? "bg-emerald-100 text-emerald-600"
      : toast.type === "error" ? "bg-rose-100 text-rose-600"
      : "bg-violet-100 text-violet-600"
    }`}>
      {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" />
      : toast.type === "error" ? <AlertCircle className="w-4 h-4" />
      : <Info className="w-4 h-4" />}
    </div>
    <span className="leading-relaxed">{toast.message}</span>
  </motion.div>
))}

// ============================================
// 3. PREMIUM SIDEBAR NAVIGATION (enhanced)
// ============================================

// Replace sidebar buttons with this enhanced pattern:
<button
  onClick={() => setActiveTab("chat")}
  className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-medium tracking-wider uppercase transition-all duration-200 interactive-btn ${
    activeTab === "chat"
      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-brand"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
  }`}
>
  <div className={`p-1.5 rounded-lg transition-all ${
    activeTab === "chat" ? "bg-white/20" : "bg-slate-200/50 group-hover:bg-slate-200"
  }`}>
    <MessageSquare className="w-4 h-4" />
  </div>
  <span>AI Consultancy Chat</span>
  {activeTab === "chat" && (
    <motion.div
      layoutId="activeTab"
      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
    />
  )}
</button>

// ============================================
// 4. PREMIUM CHAT MESSAGE BUBBLES
// ============================================

// User message (enhanced):
<div className="max-w-[85%] rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 text-white shadow-elevated border border-violet-500/20 relative">
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600 rotate-45 rounded-sm" />
  <p className="whitespace-pre-line">{msg.content}</p>
  <div className="flex justify-end mt-2 pt-1.5 border-t border-white/10">
    <span className="text-[9px] font-mono text-violet-200/80">{timeStr}</span>
  </div>
</div>

// Assistant message (enhanced):
<div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm leading-relaxed bg-white border border-slate-200/80 text-slate-800 shadow-elevated relative group">
  <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rotate-45 rounded-sm border-l border-t border-slate-200/80" />
  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <p className="text-[10px] uppercase tracking-widest font-mono text-violet-600 font-medium">GAH AI</p>
    </div>
    <button
      onClick={() => handleSpeakMessage(msg.id, msg.content)}
      className={`p-2 rounded-xl transition-all ${
        isSpeaking ? "bg-emerald-50 text-emerald-600 animate-pulse" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
      }`}
    >
      <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-bounce" : ""}`} />
    </button>
  </div>
  <p className="whitespace-pre-line text-slate-700">{msg.content}</p>
</div>

// ============================================
// 5. PREMIUM INPUT AREA (enhanced)
// ============================================

<div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 shrink-0">
  <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/60 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-violet-500/15 focus-within:border-violet-300 transition-all">
    <div className="flex bg-white p-0.5 rounded-xl border border-slate-200/40 shrink-0 shadow-sm">
      <button
        onClick={() => setChatVoiceLanguage("en")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${
          chatVoiceLanguage === "en" ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setChatVoiceLanguage("bn")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${
          chatVoiceLanguage === "bn" ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        বাংলা
      </button>
    </div>

    <input
      type="text"
      placeholder={chatVoiceLanguage === "bn" ? "ভিসা প্রসেস, ব্লক অ্যাকাউন্ট বা SOP নিয়ে জিজ্ঞেস করুন..." : "Ask about SOP drafting, university pathways, or block accounts..."}
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
      className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
    />

    <button
      onClick={handleStartChatRecording}
      className="p-2.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl transition-all interactive-btn"
      title="Record Voice Note"
    >
      <Mic className="w-4 h-4" />
    </button>

    <button
      onClick={() => handleSendMessage(inputMessage)}
      disabled={!inputMessage.trim() || chatLoading}
      className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all interactive-btn shadow-glow-brand"
    >
      <Send className="w-4 h-4" />
    </button>
  </div>
</div>

// ============================================
// 6. PREMIUM DASHBOARD SCORE WHEEL (enhanced)
// ============================================

<div className="relative w-36 h-36 flex items-center justify-center">
  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="42" className="fill-none stroke-slate-100" strokeWidth="8" />
    <circle
      cx="50" cy="50" r="42"
      className="fill-none"
      stroke="url(#scoreGradient)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
    />
  </svg>
  <div className="absolute flex flex-col items-center">
    <span className="text-3xl font-display font-medium text-slate-900">{compositeScore}%</span>
    <span className="text-[8px] uppercase font-mono tracking-wider text-slate-400 font-medium">Compliance</span>
  </div>
</div>

// ============================================
// 7. PREMIUM DOCUMENT CHECKLIST CARDS
// ============================================

<div
  onClick={() => handleToggleDoc(docItem.id)}
  className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-4 select-none interactive-card ${
    isChecked
      ? "bg-emerald-50/30 border-emerald-300/60 shadow-sm"
      : "bg-white border-slate-200/60 hover:border-violet-300/60 hover:shadow-elevated"
  }`}
>
  <div className="shrink-0 mt-0.5">
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
      isChecked
        ? "bg-emerald-500 border-emerald-500 text-white scale-110"
        : "border-slate-300 bg-white text-transparent group-hover:border-violet-400"
    }`}>
      <Check className="w-3.5 h-3.5 stroke-[3px]" />
    </div>
  </div>
  <div className="space-y-1.5 flex-1 min-w-0">
    <div className="flex items-center justify-between gap-3">
      <h4 className={`text-[13px] font-medium truncate ${isChecked ? "text-slate-500 line-through" : "text-slate-900"}`}>
        {language === "bn" ? docItem.titleBn : docItem.titleEn}
      </h4>
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-medium tracking-wider uppercase shrink-0 ${
        docItem.category === "mandatory" ? "bg-rose-50 text-rose-700 border border-rose-100"
        : docItem.category === "financial" ? "bg-amber-50 text-amber-700 border border-amber-100"
        : docItem.category === "academic" ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
        : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}>
        {docItem.category}
      </span>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed">{formatText(docItem.descEn)}</p>
  </div>
</div>

// ============================================
// 8. PREMIUM PRICING CARDS (enhanced)
// ============================================

<div className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-violet-300/60 transition-all duration-300 interactive-card overflow-hidden">
  {/* Popular badge */}
  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-[9px] font-mono tracking-widest uppercase font-medium">
    Popular
  </div>

  {/* Gradient top border on hover */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

  <div className="space-y-4 pt-2">
    <div className="space-y-1">
      <span className="text-[9px] font-mono uppercase tracking-widest text-violet-600 font-medium">Tier 02</span>
      <h4 className="font-display text-lg text-slate-900 font-medium">Entry-Level</h4>
      <p className="text-slate-500 text-[11px] leading-relaxed">Instant Suitability Map report.</p>
    </div>

    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-display font-medium text-slate-900">৳30</span>
      <span className="text-xs text-slate-400">/ instant</span>
    </div>

    <ul className="space-y-3 text-[11px] text-slate-600">
      <li className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-emerald-600" />
        </div>
        Suitability evaluation report
      </li>
      <li className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-emerald-600" />
        </div>
        University Shortlists Map
      </li>
      <li className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-emerald-600" />
        </div>
        Instant downloadable PDF
      </li>
    </ul>

    <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-medium transition-all interactive-btn shadow-glow-brand">
      Get Report
    </button>
  </div>
</div>

// ============================================
// 9. PREMIUM INTERVIEW SIMULATOR (enhanced)
// ============================================

{/* Recording button with ripple effect */}
<div className="relative">
  {!isRecording ? (
    <button
      onClick={handleStartRecording}
      className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-full flex items-center justify-center shadow-floating interactive-btn"
    >
      <Mic className="w-7 h-7" />
    </button>
  ) : (
    <button
      onClick={handleStopRecording}
      className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-floating animate-pulse interactive-btn"
    >
      <Square className="w-7 h-7 fill-current" />
    </button>
  )}
  {isRecording && (
    <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping" />
  )}
</div>

// ============================================
// 10. PREMIUM EMPTY STATES
// ============================================

{/* Empty state for practice attempts */}
{practiceAttempts.length === 0 && (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
      <Mic className="w-7 h-7 text-slate-300" />
    </div>
    <h4 className="text-sm font-medium text-slate-700 mb-1">No practice attempts yet</h4>
    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
      Complete a trial above to receive AI-powered feedback on your visa interview responses.
    </p>
  </div>
)}

// ============================================
// 11. PREMIUM PROGRESS TRACKER
// ============================================

<div className="flex items-start gap-4 relative">
  {/* Connector line */}
  <div className="absolute left-5 top-8 bottom-[-24px] w-0.5 bg-gradient-to-b from-emerald-300 to-slate-200" />

  {/* Completed step */}
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-4 ring-emerald-50 flex items-center justify-center text-white z-10 shrink-0 shadow-sm">
    <Check className="w-5 h-5" />
  </div>

  <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-elevated">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-xs font-medium text-slate-800">Stage 1: Student Profile Validation</h4>
      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-mono font-medium uppercase tracking-wide border border-emerald-100">
        Completed
      </span>
    </div>
    <p className="text-[11px] text-slate-500 leading-relaxed">
      Filled academic parameters (GPA: {profile.gpa}, IELTS: {profile.ielts}) to map eligibility constraints.
    </p>
  </div>
</div>

// ============================================
// 12. PREMIUM NAVBAR (enhanced)
// ============================================

<nav className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 glass-panel-strong">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl shadow-glow-brand">
      <Logo size={28} className="shrink-0 text-white" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-800 tracking-tight">Global Academy Hub</span>
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-medium">
        Visa & Study Platform
      </span>
    </div>
  </div>

  {/* Right side controls */}
  <div className="flex items-center gap-3">
    {/* WhatsApp support pill */}
    <a
      href="https://wa.me/88001841800841"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 text-emerald-700 rounded-xl text-[10px] font-medium border border-emerald-200/60 hover:bg-emerald-100 transition-all"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      Support: +880 01841800841
    </a>

    {/* Language switcher */}
    <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/40">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${
          language === "en" ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("bn")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all ${
          language === "bn" ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        বাংলা
      </button>
    </div>
  </div>
</nav>
