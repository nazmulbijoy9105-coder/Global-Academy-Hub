export type ServiceTier = "free" | "entry" | "structured" | "premium" | "elite";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  method: "email" | "phone" | "google";
  avatar: string;
  tier: ServiceTier;
  role?: "superadmin" | "admin" | "student" | "user";
  createdAt: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  audioUrl?: string;
  durationSec?: number;
  isVoiceMessage?: boolean;
}

export interface Conversation {
  id: string;
  userId: string; // "guest" or user-id
  title: string;
  messages: Message[];
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Payment {
  id: string;
  userId: string;
  tier: Exclude<ServiceTier, "free">;
  amount: number;
  method: "bkash" | "nagad" | "stripe";
  phone: string;
  status: "completed" | "pending" | "failed";
  timestamp: number;
}

export interface StudentProfile {
  fullName: string;
  previousDegree: string;
  previousInstitution?: string;
  targetCountry: string; // Left for compatibility
  preferredCountries: string[]; // List of preferred countries
  targetDegree: string;
  targetSubject: string; // Left for compatibility
  desiredFields: string[]; // List of fields of study
  gpa: string;
  ielts: string;
  budget: string; // "low" | "medium" | "high"
  budgetAmount?: string; // Specific budget e.g., "৳10L - ৳12L / year"
  cvFileName?: string;
  cvFileSize?: string;
  cvParsed?: boolean;
  cvSkills?: string[];
  lastUpdated?: number;
}
