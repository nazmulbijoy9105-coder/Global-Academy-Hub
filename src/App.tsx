/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, MessageSquare, LayoutDashboard, Compass, CreditCard, 
  MapPin, CheckCircle2, ArrowRight, UserCheck, 
  HelpCircle, GraduationCap, DollarSign, Calendar, ChevronDown,
  LogOut, Download, Phone, Mail, Award, Loader2, Send, Plus, Trash2, Edit3, Check, Copy, MessageCircle,
  Mic, Square, Play, Volume2, Clock, BookOpen, RefreshCw
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
    question: "What is a German Blocked Account (Sperrkonto) and how does it work?",
    answer: "A blocked account is a mandatory special bank account for the German student visa. You must deposit €11,904 (required for the current academic years) to prove you can cover your living costs. Each month, €992 is released to your standard bank account once you arrive in Germany."
  },
  {
    question: "What are the general visa requirements for Schengen countries?",
    answer: "The key requirements include: (1) An official university Admission Letter, (2) Proof of sufficient financial funds (e.g. Blocked account, scholarships, or sponsor), (3) Valid travel and health insurance, (4) Academic transcripts/certificates, (5) English proficiency proof (IELTS or Medium of Instruction), and (6) A well-structured Statement of Purpose (SOP)."
  },
  {
    question: "How long does student visa processing take from Bangladesh?",
    answer: "Visa processing times vary: Germany takes 6 to 12 weeks (requires physical interview at the Embassy in Dhaka). Sweden takes 4 to 8 weeks (processed online via the Swedish Migration Agency, biometric collection required). Finland/Estonia takes 4 to 6 weeks. Always begin applications at least 3 months in advance."
  },
  {
    question: "Is IELTS mandatory or is a Medium of Instruction (MOI) certificate sufficient?",
    answer: "While some universities accept an MOI if your Bachelor's degree was fully taught in English, major Schengen Embassies (specifically Germany, Sweden, and Denmark) strongly prefer or require an official IELTS score (minimum 6.0 or 6.5) to issue visas. Having an IELTS score significantly boosts your success rate."
  },
  {
    question: "Can I work part-time while studying in Europe?",
    answer: "Yes, international students are legally permitted to work part-time: Germany allows 140 full days or 280 half days per year. Sweden has no official hourly cap, but maintaining studies is required (20 hours/week is typical). Most other Schengen states permit up to 20 hours per week."
  },
  {
    question: "What questions should I expect in the German/Schengen visa interview?",
    answer: "Embassies focus on: (1) Your specific reasons for choosing Europe instead of Bangladesh, (2) Your knowledge about your course modules and selected university, (3) Your funding plan (how you will support your studies), and (4) Your future career plans. Speak clearly and confidently in English."
  }
];

export default function App() {
  // --- States ---
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard" | "pricing" | "tracker" | "payments" | "channels" | "simulator">("chat");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  
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
    targetCountry: "Germany",
    targetDegree: "Master's",
    targetSubject: "Computer Science",
    gpa: "3.65",
    budget: "medium",
    ielts: "6.5"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showReportViewer, setShowReportViewer] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copiedFaqIdx, setCopiedFaqIdx] = useState<number | null>(null);
  
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
      setProfile(JSON.parse(storedProfile));
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
          content: "Assalamu Alaikum! Welcome to Global Academy Hub. I am Peopole AI, your dedicated Europe study and visa expert.\n\nI can help you shortlist universities, estimate blocked accounts, format SOPs, and prepare for interviews. \n\nHow can I help you take your first step towards Europe today?",
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
          stream: true
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

  const handleCopyFaq = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFaqIdx(idx);
      addToast("Answer copied to clipboard!", "success");
      setTimeout(() => {
        setCopiedFaqIdx(null);
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
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("student_profile", JSON.stringify(profile));
    setIsEditingProfile(false);
    addToast("Consultancy Profile Updated Successfully!", "success");
  };

  // --- Log Out ---
  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    createInitialConversation();
    addToast("Logged out and cleared active advisory session", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative antialiased selection:bg-violet-100 selection:text-violet-900">
      
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
              Global Academy Hub
            </span>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
              Visa & Study Platform
            </span>
          </div>
        </div>

        {/* Global Controls & Auth */}
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="https://wa.me/88001841800841"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-semibold hover:bg-emerald-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Support: +880 01841800841
          </a>

          {/* Language Switcher */}
          <div className="flex bg-slate-100 rounded p-0.5 border border-slate-200/60">
            <button 
              onClick={() => { setLanguage("en"); addToast("Switched system language to English", "info"); }}
              className={`px-2 py-0.5 text-[9px] md:text-[10px] font-semibold rounded transition-all ${
                language === "en" ? "bg-white text-violet-750 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => { setLanguage("bn"); addToast("বাংলা ভাষায় স্বাগতম!", "info"); }}
              className={`px-2 py-0.5 text-[9px] md:text-[10px] font-semibold rounded transition-all ${
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
                <p className="text-[11px] font-bold text-slate-850">{user.name}</p>
                <p className="text-[8px] uppercase font-mono tracking-wider font-bold text-violet-600">
                  {user.tier.toUpperCase()} TIER
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-2 md:p-3 flex flex-row md:flex-col gap-1 overflow-x-auto shrink-0 md:sticky md:top-14 md:h-[calc(100vh-56px)] scrollbar-none">
          <div className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-3">
            Navigation Menu
          </div>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "chat" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Consultancy Chat
          </button>

          <button
            onClick={() => setActiveTab("channels")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "channels" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp & Messenger
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "simulator" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Interview Simulator
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "dashboard" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Student Dashboard
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "pricing" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Visa & Study Plans
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "tracker" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Progress Tracker
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium tracking-wider uppercase shrink-0 transition-all ${
              activeTab === "payments" 
                ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600 font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payment Ledger
          </button>

          {/* Interactive Tier Widget */}
          <div className="hidden md:block mt-auto p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white">
            <p className="text-[9px] uppercase font-mono tracking-widest text-slate-400 mb-0.5">Current Standing</p>
            <p className="font-display font-semibold text-xs mb-1.5 capitalize text-violet-300">{user ? `${user.tier} Pathway` : "Free Pathway"}</p>
            <div className="w-full bg-slate-700 h-1 rounded-full mb-1.5">
              <div 
                className="bg-violet-500 h-full rounded-full transition-all duration-500" 
                style={{ width: user?.tier === "free" || !user ? "25%" : user.tier === "entry" ? "50%" : user.tier === "structured" ? "70%" : "95%" }}
              />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-300">
              {user?.tier === "free" || !user 
                ? "Unlock suitability Evaluations by upgrading plan."
                : "Professional pathways active."}
            </p>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-64px)]">
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
                {/* Conversations Navigation List */}
                <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 h-full max-h-[500px] overflow-y-auto">
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
                <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col h-[550px] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">
                          Peopole AI Specialist
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Active GAH Chatbot • English & বাংলা
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {activeConv && activeConv.messages.length > 0 && (
                        <button
                          onClick={handleDownloadChat}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-[11px] font-medium transition-colors"
                          title="Download Chat Log as PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Chat</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
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
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg border border-violet-500/10"
                                : "bg-white border border-slate-200/80 text-slate-800 shadow-sm relative group"
                            }`}
                          >
                            {msg.role !== "user" && (
                              <div className="flex justify-between items-center mb-1.5 border-b border-slate-100 pb-1">
                                <p className="text-[10px] uppercase tracking-widest font-mono text-violet-600 font-bold">
                                  GAH AI • Academic Agent
                                </p>
                                
                                <button
                                  onClick={() => handleSpeakMessage(msg.id, msg.content)}
                                  className={`p-1 rounded-md transition-colors flex items-center gap-1 text-[9px] font-mono ${
                                    isSpeaking 
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse" 
                                      : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                                  }`}
                                  title="Read Aloud"
                                >
                                  <Volume2 className={`h-3 w-3 ${isSpeaking ? "animate-bounce" : ""}`} />
                                  <span>{isSpeaking ? "MUTE" : "READ ALOUD"}</span>
                                </button>
                              </div>
                            )}

                            {isVoice ? (
                              <div className="space-y-2 py-1">
                                <div className="flex items-center gap-3.5 bg-violet-50/30 p-2.5 rounded-xl border border-violet-100/50">
                                  <button
                                    onClick={() => handleToggleAudioMessage(msg.id, msg.audioUrl!)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                      msg.role === "user"
                                        ? "bg-white text-violet-700 hover:scale-105"
                                        : "bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 shadow-md"
                                    }`}
                                  >
                                    {isPlaying ? (
                                      <span className="flex gap-1 items-end h-3">
                                        <span className="w-0.5 bg-current animate-bounce h-2" />
                                        <span className="w-0.5 bg-current animate-bounce h-3 delay-100" />
                                      </span>
                                    ) : (
                                      <Play className="h-4 w-4 fill-current ml-0.5" />
                                    )}
                                  </button>

                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.role === "user" ? "text-violet-100" : "text-violet-700"}`}>
                                        🎙️ Voice Memo
                                      </span>
                                      <span className={`text-[9px] font-mono ${msg.role === "user" ? "text-violet-200" : "text-slate-400"}`}>
                                        {msg.durationSec ? `${msg.durationSec}s` : "0:08"}
                                      </span>
                                    </div>
                                    <div className="flex items-end gap-0.5 h-4 pt-1">
                                      {[...Array(16)].map((_, i) => {
                                        const h = Math.abs(Math.sin((i + 1) * 0.5)) * 100;
                                        return (
                                          <span
                                            key={i}
                                            style={{ height: `${Math.max(15, h)}%` }}
                                            className={`w-1 rounded-full transition-all ${msg.role === "user" ? "bg-white/40" : "bg-violet-200"}`}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                <div className={`p-2 rounded-lg text-xs ${
                                  msg.role === "user" ? "bg-violet-750/30 text-violet-100" : "bg-slate-50 text-slate-600 border border-slate-100"
                                }`}>
                                  <span className="font-semibold block text-[10px] uppercase tracking-wider mb-0.5 opacity-80">Transcribed text:</span>
                                  <p className="italic">"{msg.content}"</p>
                                </div>
                              </div>
                            ) : (
                              <p className="whitespace-pre-line text-xs md:text-sm">{msg.content}</p>
                            )}

                            <div className="flex justify-end mt-1 pt-1">
                              <span className={`text-[9px] font-mono ${msg.role === "user" ? "text-violet-200" : "text-slate-400"}`}>
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
                  <div className="p-4 bg-white border-t border-slate-150 shrink-0">
                    {isChatRecording ? (
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
                          </span>
                          <span className="text-xs font-mono font-bold text-rose-700 uppercase tracking-widest">
                            Recording ({chatVoiceLanguage === "en" ? "EN" : "BN"})
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span>0:{chatRecordingDuration < 10 ? `0${chatRecordingDuration}` : chatRecordingDuration}</span>
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="px-3 py-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-semibold"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleStopChatRecording}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-rose-100 flex items-center gap-1.5 transition-colors"
                          >
                            <Square className="h-3 w-3 fill-current" />
                            <span>Done & Send</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 shrink-0">
                          <button
                            onClick={() => {
                              setChatVoiceLanguage("en");
                              addToast("Transcription: English", "success");
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${
                              chatVoiceLanguage === "en" ? "bg-white text-violet-700 shadow-sm" : "text-slate-400"
                            }`}
                          >
                            🇬🇧 EN
                          </button>
                          <button
                            onClick={() => {
                              setChatVoiceLanguage("bn");
                              addToast("Transcription: Bengali", "success");
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${
                              chatVoiceLanguage === "bn" ? "bg-white text-violet-700 shadow-sm" : "text-slate-400"
                            }`}
                          >
                            🇧🇩 BN
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder={chatVoiceLanguage === "bn" ? "ভিসা প্রসেস, ব্লক অ্যাকাউন্ট বা SOP নিয়ে জিজ্ঞেস করুন..." : "Ask about SOP drafting, university pathways, or block accounts..."}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage(inputMessage);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs md:text-sm focus:ring-2 focus:ring-violet-500/25 outline-none"
                        />

                        <button
                          onClick={handleStartChatRecording}
                          className="p-3 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl shrink-0"
                          title="Record Voice Note"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleSendMessage(inputMessage)}
                          disabled={!inputMessage.trim() || chatLoading}
                          className="bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl disabled:opacity-50 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. DASHBOARD TAB */}
            {activeTab === "dashboard" && (
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
                        <h3 className="font-display font-bold text-sm text-slate-900">Your Academic Metrics</h3>
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
                        <label className="text-slate-500 font-semibold">Target Destination</label>
                        <select
                          disabled={!isEditingProfile}
                          value={profile.targetCountry}
                          onChange={(e) => setProfile(prev => ({ ...prev, targetCountry: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        >
                          <option value="Germany">🇩🇪 Germany (জার্মানি)</option>
                          <option value="Sweden">🇸🇪 Sweden (সুইডেন)</option>
                          <option value="Finland">🇫🇮 Finland (ফিনল্যান্ড)</option>
                          <option value="Poland">🇵🇱 Poland (পোল্যান্ড)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold">Degree Goal</label>
                        <select
                          disabled={!isEditingProfile}
                          value={profile.targetDegree}
                          onChange={(e) => setProfile(prev => ({ ...prev, targetDegree: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        >
                          <option value="Bachelor's">Bachelor's Degree</option>
                          <option value="Master's">Master's Degree</option>
                          <option value="PhD">Doctorate / PhD</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold">Desired Major Subject</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.targetSubject}
                          onChange={(e) => setProfile(prev => ({ ...prev, targetSubject: e.target.value }))}
                          placeholder="Computer Science"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold">CGPA (out of 4.00)</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.gpa}
                          onChange={(e) => setProfile(prev => ({ ...prev, gpa: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold">IELTS Score</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.ielts}
                          onChange={(e) => setProfile(prev => ({ ...prev, ielts: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 font-semibold">Funding Budget Capacity</label>
                        <select
                          disabled={!isEditingProfile}
                          value={profile.budget}
                          onChange={(e) => setProfile(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-85 font-semibold text-slate-800"
                        >
                          <option value="low">Affordable (৳5L - ৳8L / year)</option>
                          <option value="medium">Medium (৳10L - ৳15L / year - Standard Blocked)</option>
                          <option value="high">Premium (৳18L+ / year)</option>
                        </select>
                      </div>
                    </form>
                  </div>

                  <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between border border-slate-800 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-violet-400" />
                        <h4 className="font-display font-semibold text-md">Destination Insight: {profile.targetCountry}</h4>
                      </div>
                      
                      <div className="space-y-3 text-xs text-slate-300">
                        <p>
                          Your target destination is highly viable for a <strong className="text-white">{profile.targetDegree}</strong> program in <strong className="text-white">{profile.targetSubject}</strong>.
                        </p>
                        
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-violet-300 block font-bold">Eligibility Guidance</span>
                          <p className="text-[11px] leading-relaxed">
                            {Number(profile.gpa) >= 3.0 ? "✅ Excellent CGPA! Public tuition-free universities are heavily receptive." : "⚠️ GPA is moderately competitive. Private pathways or credit transfer is suggested."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 mt-6 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Consultancy Status</span>
                      <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full font-mono text-[10px] font-bold uppercase">
                        READY TO EVALUATE
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. PRICING & STUDY PLANS TAB */}
            {activeTab === "pricing" && (
              <motion.div
                key="pricing-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 max-w-xl mx-auto mb-4">
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Our Study Abroad Consultancy Tiers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent, value-focused service models crafted specifically for Bangladesh applicants to Schengen Zone universities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
                  
                  {/* Free */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 transition-all space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Tier 01</span>
                      <h4 className="font-display font-bold text-base text-slate-800">FREE Pathway</h4>
                      <p className="text-slate-500 text-[10px]">Unlimited AI chatbot interactions.</p>
                    </div>
                    <div className="text-2xl font-display font-bold text-slate-900">
                      ৳0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">✓ Unlimited AI chat</li>
                      <li className="flex items-center gap-2">✓ Step-by-step guideline</li>
                      <li className="flex items-center gap-2">✓ Bangla + English</li>
                    </ul>
                    <button 
                      onClick={() => { setActiveTab("chat"); addToast("Start chatting!", "info"); }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                    >
                      Access Chat
                    </button>
                  </div>

                  {/* Entry */}
                  <div className="bg-white border-2 border-violet-100 rounded-2xl p-5 hover:border-violet-300 transition-all space-y-4 shadow-sm shadow-violet-50 relative">
                    <span className="absolute -top-3 right-4 px-2 py-0.5 bg-violet-600 text-white rounded-full text-[8px] font-mono tracking-widest uppercase font-bold">
                      POPULAR PDF
                    </span>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-violet-600 font-bold">Tier 02</span>
                      <h4 className="font-display font-bold text-base text-slate-800">ENTRY-Level</h4>
                      <p className="text-slate-500 text-[10px]">Instant Suitability Map report.</p>
                    </div>
                    <div className="text-2xl font-display font-bold text-slate-900">
                      ৳30 <span className="text-xs text-slate-400 font-normal">/ instant</span>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">✓ Suitability evaluation report</li>
                      <li className="flex items-center gap-2">✓ University Shortlists Map</li>
                      <li className="flex items-center gap-2">✓ Instant downloadable PDF</li>
                    </ul>
                    <button 
                      onClick={() => handleTriggerPayment("entry")}
                      className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl"
                    >
                      {user?.tier === "entry" ? "View Report" : "Get Report"}
                    </button>
                  </div>

                  {/* Structured */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 transition-all space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Tier 03</span>
                      <h4 className="font-display font-bold text-base text-slate-800">STRUCTURED</h4>
                      <p className="text-slate-500 text-[10px]">AI with human advisor validation.</p>
                    </div>
                    <div className="text-2xl font-display font-bold text-slate-900">
                      ৳100 - ৳500
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">✓ Human expert evaluation</li>
                      <li className="flex items-center gap-2">✓ AI admission risk analysis</li>
                      <li className="flex items-center gap-2">✓ Document checklists review</li>
                    </ul>
                    <button 
                      onClick={() => handleTriggerPayment("structured")}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                    >
                      Upgrade Structured
                    </button>
                  </div>

                  {/* Premium */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 transition-all space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Tier 04</span>
                      <h4 className="font-display font-bold text-base text-slate-800">PREMIUM Mentorship</h4>
                      <p className="text-slate-500 text-[10px]">End-to-end advisory backup.</p>
                    </div>
                    <div className="text-2xl font-display font-bold text-slate-900">
                      ৳5,500 <span className="text-xs text-slate-400 font-normal">/ complete</span>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">✓ Matched alumni mentor</li>
                      <li className="flex items-center gap-2">✓ Professional SOP writing</li>
                      <li className="flex items-center gap-2">✓ Visa mock interviews</li>
                    </ul>
                    <button 
                      onClick={() => handleTriggerPayment("premium")}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                    >
                      Purchase Premium
                    </button>
                  </div>

                  {/* Elite */}
                  <div className="bg-slate-900 text-white border border-slate-850 rounded-2xl p-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-violet-400 font-bold">Tier 05</span>
                      <h4 className="font-display font-bold text-base">ELITE Board</h4>
                      <p className="text-slate-400 text-[10px]">Full board management.</p>
                    </div>
                    <div className="text-xl font-display font-bold">
                      Call for Details
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      <li className="flex items-center gap-2">✓ Professor research outreach</li>
                      <li className="flex items-center gap-2">✓ Scholarship negotiation</li>
                      <li className="flex items-center gap-2">✓ Direct Board representation</li>
                    </ul>
                    <a 
                      href="https://wa.me/88001841800841"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs text-center font-bold rounded-xl"
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
                      Schengen Visa & Process FAQs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Get instant answers to the most common questions about Blocked Accounts, document checklists, and embassy timelines.
                    </p>
                  </div>
                  
                  <div className="max-w-3xl mx-auto space-y-2.5 pt-4">
                    {FAQ_ITEMS.map((faq, idx) => {
                      const isExpanded = expandedFaq === idx;
                      return (
                        <div key={idx} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                            className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/40"
                          >
                            <span className="text-xs font-medium text-slate-800 leading-snug">
                              {faq.question}
                            </span>
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
                                  <div className="flex justify-end">
                                    <button
                                      onClick={() => handleCopyFaq(faq.answer, idx)}
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-medium"
                                    >
                                      {copiedFaqIdx === idx ? "Copied!" : "Copy Answer"}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
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

          </AnimatePresence>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 px-8 text-center text-xs text-slate-400 shrink-0">
        <p className="font-semibold">© 2026 Global Academy Hub. All Rights Reserved.</p>
        <p className="mt-1">Headquarters: Panthapath, Dhaka, Bangladesh | Hotline: +880 01841800841</p>
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
