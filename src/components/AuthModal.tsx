import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Phone, Key, ShieldCheck, X, LogIn, CheckCircle, Globe, Sparkles } from "lucide-react";
import { User } from "../types";
import Logo from "./Logo";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"email" | "phone" | "google">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Phone Auth states
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneName, setPhoneName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handler for Email sign-in / sign-up
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isSignUp && !name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      if (!email.trim() || !password.trim()) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }
      if (password.length < 4) {
        setError("Password should be at least 4 characters long");
        setLoading(false);
        return;
      }

      // Successful simulation
      const loggedUser: User = {
        id: "usr-" + Math.floor(Math.random() * 1000000),
        name: isSignUp ? name : email.split("@")[0].toUpperCase(),
        email: email,
        phone: "",
        method: "email",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isSignUp ? name : email.split("@")[0])}&background=7c3aed&color=fff`,
        tier: "free",
        createdAt: Date.now(),
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setSuccessMsg(isSignUp ? "Account created successfully!" : "Logged in successfully!");
      setTimeout(() => {
        onSuccess(loggedUser);
        onClose();
      }, 1000);
    }, 1000);
  };

  // Handler for Phone Auth
  const handlePhoneSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!phoneName.trim()) {
      setError("Please enter your name first");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setSuccessMsg("SMS OTP sent! Use '1234' for testing.");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1200);
  };

  const handlePhoneVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp !== "1234") {
      setError("Invalid OTP code. Please use demo code '1234'.");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const loggedUser: User = {
        id: "usr-" + Math.floor(Math.random() * 1000000),
        name: phoneName,
        email: "",
        phone: phone,
        method: "phone",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(phoneName)}&background=4f46e5&color=fff`,
        tier: "free",
        createdAt: Date.now(),
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setSuccessMsg("Phone verification complete!");
      setTimeout(() => {
        onSuccess(loggedUser);
        onClose();
      }, 1000);
    }, 1000);
  };

  // Handler for Google Auth
  const handleGoogleAuth = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const loggedUser: User = {
        id: "usr-" + Math.floor(Math.random() * 1000000),
        name: "Bijoy Rahman",
        email: "bijoy.student@gmail.com",
        phone: "",
        method: "google",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        tier: "free",
        createdAt: Date.now(),
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setSuccessMsg("Google OAuth connected successfully!");
      setTimeout(() => {
        onSuccess(loggedUser);
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Top brand header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white/90 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-3">
            <Logo size={24} className="bg-white p-0.5 rounded shadow-xs" />
            <span className="text-xs uppercase font-mono tracking-widest text-violet-100 font-semibold">Global Academy Hub</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Start Your Journey</h2>
          <p className="text-violet-100 text-xs mt-1">
            Access free study abroad guides, AI assistance, university shortlists, and dashboard logs.
          </p>
        </div>

        {/* Tabs for switching auth type */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => { setTab("email"); setError(""); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              tab === "email" ? "text-violet-600 border-violet-600" : "text-slate-500 border-transparent hover:bg-slate-50"
            }`}
          >
            <Mail className="inline-block h-3.5 w-3.5 mr-1" />
            Email
          </button>
          <button
            onClick={() => { setTab("phone"); setError(""); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              tab === "phone" ? "text-violet-600 border-violet-600" : "text-slate-500 border-transparent hover:bg-slate-50"
            }`}
          >
            <Phone className="inline-block h-3.5 w-3.5 mr-1" />
            Phone OTP
          </button>
          <button
            onClick={() => { setTab("google"); setError(""); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              tab === "google" ? "text-violet-600 border-violet-600" : "text-slate-500 border-transparent hover:bg-slate-50"
            }`}
          >
            <Globe className="inline-block h-3.5 w-3.5 mr-1" />
            Google
          </button>
        </div>

        {/* Main forms body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email Tab */}
          {tab === "email" && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400">
                      <LogIn className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Mohammad Rahman"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-600">Password</label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-lg shadow-violet-200 transition-all disabled:opacity-50"
              >
                {loading ? "Please wait..." : isSignUp ? "Create Student Account" : "Access Platform"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-medium text-violet-600 hover:underline"
                >
                  {isSignUp ? "Already registered? Sign In" : "New to Global Academy Hub? Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* Phone OTP Tab */}
          {tab === "phone" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handlePhoneSendOtp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Your Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-slate-400">
                        <LogIn className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Naimul Islam"
                        required
                        value={phoneName}
                        onChange={(e) => setPhoneName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Phone Number (Bangladeshi Mobile)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        placeholder="+880 1841800841"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? "Sending SMS OTP..." : "Request OTP Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePhoneVerifyOtp} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-slate-600">SMS Verification Code</label>
                      <span className="text-[10px] font-mono font-bold text-violet-600 uppercase">Test OTP: 1234</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-slate-400">
                        <Key className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter 4-digit code (use 1234)"
                        required
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm tracking-widest text-center font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify Code & Sign In"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      ← Back to phone registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Google Simulation Tab */}
          {tab === "google" && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <h3 className="font-display font-semibold text-slate-800 text-sm">Instant Google Account Sync</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect quickly using your pre-authorized Gmail account for immediate access to reports and chat records.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? "Authenticating..." : "Connect with Google"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
