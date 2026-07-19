import { University } from "../types";

export const UNIVERSITY_DATA: University[] = [
  // --- EUROPE ---
  {
    id: "lmu-germany",
    name: "Ludwig Maximilian University of Munich",
    country: "Germany",
    region: "Europe",
    subjects: {
      common: ["Physics", "Medicine", "Business Administration"],
      uncommon: ["Egyptology", "Logic and Philosophy of Science"]
    },
    costLevel: "Low",
    tuitionRange: "€0 - €1,500 / sem",
    livingCostRange: "€900 - €1,200 / mo",
    rankRange: "Top 50 Global",
    highlights: ["Public university (no tuition for most)", "Strong research focus", "Historic prestige"]
  },
  {
    id: "sapienza-italy",
    name: "Sapienza University of Rome",
    country: "Italy",
    region: "Europe",
    subjects: {
      common: ["Archaeology", "Classics", "Engineering"],
      uncommon: ["Space Engineering", "Sustainable Development"]
    },
    costLevel: "Low",
    tuitionRange: "€500 - €3,000 / year",
    livingCostRange: "€700 - €1,000 / mo",
    rankRange: "Top 200 Global",
    highlights: ["Very low tuition", "Vibrant student life", "Rich cultural heritage"]
  },
  {
    id: "warsaw-poland",
    name: "University of Warsaw",
    country: "Poland",
    region: "Europe",
    subjects: {
      common: ["Computer Science", "International Relations", "Psychology"],
      uncommon: ["Oriental Studies", "Bioinformatics"]
    },
    costLevel: "Low",
    tuitionRange: "€2,000 - €4,500 / year",
    livingCostRange: "€400 - €600 / mo",
    rankRange: "Top 300 Global",
    highlights: ["Extremely affordable living", "English-taught programs", "Growing tech hub"]
  },

  // --- ASIA ---
  {
    id: "nus-singapore",
    name: "National University of Singapore (NUS)",
    country: "Singapore",
    region: "Asia",
    subjects: {
      common: ["Data Science", "Engineering", "Architecture"],
      uncommon: ["Halal Science", "Southeast Asian Studies"]
    },
    costLevel: "High",
    tuitionRange: "S$20,000 - S$40,000 / year",
    livingCostRange: "S$1,200 - S$2,000 / mo",
    rankRange: "Top 15 Global",
    highlights: ["World-class facilities", "Global networking", "High employability"]
  },
  {
    id: "utm-malaysia",
    name: "Universiti Teknologi Malaysia (UTM)",
    country: "Malaysia",
    region: "Asia",
    subjects: {
      common: ["Civil Engineering", "Biotechnology", "Information Systems"],
      uncommon: ["Islamic Finance", "Halal Management"]
    },
    costLevel: "Low",
    tuitionRange: "RM 5,000 - RM 15,000 / sem",
    livingCostRange: "RM 1,200 - RM 2,500 / mo",
    rankRange: "Top 200 Global",
    highlights: ["Budget-friendly", "Recognized engineering degrees", "Multicultural environment"]
  },
  {
    id: "chulalongkorn-thailand",
    name: "Chulalongkorn University",
    country: "Thailand",
    region: "Asia",
    subjects: {
      common: ["Medicine", "Engineering", "Arts"],
      uncommon: ["Thai Traditional Medicine", "Tropical Medicine"]
    },
    costLevel: "Medium",
    tuitionRange: "$3,000 - $8,000 / year",
    livingCostRange: "$500 - $900 / mo",
    rankRange: "Top 250 Global",
    highlights: ["Oldest university in Thailand", "Strong industry links", "Exotic location"]
  },

  // --- MIDDLE EAST ---
  {
    id: "kaust-saudi",
    name: "King Abdullah University of Science and Technology",
    country: "Saudi Arabia",
    region: "Middle East",
    subjects: {
      common: ["Energy", "Water", "Food & Environment"],
      uncommon: ["Extreme Computing", "Marine Science"]
    },
    costLevel: "Low",
    tuitionRange: "Full Scholarship (Free)",
    livingCostRange: "Fully Funded Stipend",
    rankRange: "Top 100 Global (Research)",
    highlights: ["Incredible funding", "High-tech labs", "Tax-free environment"]
  },
  {
    id: "aus-uae",
    name: "American University of Sharjah",
    country: "UAE",
    region: "Middle East",
    subjects: {
      common: ["Petroleum Engineering", "Business Admin", "Design"],
      uncommon: ["Gulf Studies", "Renewable Energy Management"]
    },
    costLevel: "High",
    tuitionRange: "AED 90,000 - AED 110,000 / year",
    livingCostRange: "AED 3,000 - AED 5,000 / mo",
    rankRange: "Top 400 Global",
    highlights: ["American-style curriculum", "Premium campus", "High diversity"]
  },

  // --- USA ---
  {
    id: "asu-usa",
    name: "Arizona State University (ASU)",
    country: "USA",
    region: "USA",
    subjects: {
      common: ["Innovation", "Management", "Public Health"],
      uncommon: ["Sustainability", "Space Exploration"]
    },
    costLevel: "Medium",
    tuitionRange: "$20,000 - $35,000 / year",
    livingCostRange: "$1,000 - $1,500 / mo",
    rankRange: "#1 in Innovation (USA)",
    highlights: ["Top-tier networking", "High scholarship availability", "Large campus"]
  },
  {
    id: "cc-usa",
    name: "Community Colleges (Pathway)",
    country: "USA",
    region: "USA",
    subjects: {
      common: ["General Education", "Nursing", "IT"],
      uncommon: ["Fire Science", "Culinary Arts"]
    },
    costLevel: "Low",
    tuitionRange: "$6,000 - $12,000 / year",
    livingCostRange: "$800 - $1,200 / mo",
    rankRange: "Transfer Gateway",
    highlights: ["Easiest pathway to top Unis", "Low entry requirements", "Cost saving"]
  },

  // --- NEW ZEALAND ---
  {
    id: "auckland-nz",
    name: "University of Auckland",
    country: "New Zealand",
    region: "New Zealand",
    subjects: {
      common: ["Biological Sciences", "Education", "Law"],
      uncommon: ["Wine Science", "Indigenous Studies"]
    },
    costLevel: "High",
    tuitionRange: "NZ$35,000 - NZ$50,000 / year",
    livingCostRange: "NZ$1,500 - NZ$2,500 / mo",
    rankRange: "Top 70 Global",
    highlights: ["Stunning scenery", "Work rights after study", "Safe and welcoming"]
  }
];
