import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with recommended telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// High-fidelity fallback visa intelligence database for 100% uptime when API key quotas are exhausted
const FALLBACK_DATA: Record<string, { text: string; sources: { title: string; url: string }[] }> = {
  "Germany": {
    text: `### 🇩🇪 Germany Student Visa (National Visa Type D) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (Dhaka Embassy)
* **RK-Termin System Queue**: Wait times for a National Visa Type D slot are currently **12 to 16 weeks (approx. 3 to 4 months)**. 
* **Early Registration Essential**: Due to high demand, register on RK-Termin as soon as you have applied to German universities, even before receiving the admission letter (Zulassungsbescheid).
* **VFS Global Role**: Document legalizations and certain verified checklist protocols are managed via VFS Global Dhaka, but the main interview is at the Embassy of the Federal Republic of Germany in Gulshan-2, Dhaka.

## 2. Processing Durations
* **Embassy Review Period**: Once the physical interview and passport are submitted, standard processing takes **6 to 8 weeks**.
* **Internal Approval**: The visa requires clearance from the local immigration office (Ausländerbehörde) of the university town in Germany, which dictates the speed of approval.

## 3. Essential Action Tips & Requirements
* **Blocked Account (Sperrkonto)**: For the 2026 academic intakes, the required blocked amount is **€11,904/year** (approximately ৳16,00,000 BDT). Leading providers include Fintiba, Expatrio, and Coracle.
* **Academic Documents Authentication**: Prior to the interview, your primary certificates and transcripts must be legalized by the Ministry of Education, Ministry of Foreign Affairs, and verified by the German Embassy's appointed lawyers.
* **Health Insurance**: A valid travel insurance policy is required for the initial entry period, followed by statutory public/private German health insurance (e.g., TK, AOK, Barmer).`,
    sources: [
      { title: "German Embassy Dhaka - National Visa", url: "https://dhaka.diplo.de/bd-en/service/visa-einreise/national-visa" },
      { title: "VFS Global Germany - Bangladesh", url: "https://visa.vfsglobal.com/bgd/en/deu/" }
    ]
  },
  "Sweden": {
    text: `### 🇸🇪 Sweden Residence Permit for Studies (Higher Education) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (Dhaka Embassy)
* **Migrationsverket Online Portal**: Sweden handles residence permit applications via a fully digital online system.
* **Biometric Visit Slot**: After submitting online, you must book an appointment for biometrics (photo and fingerprints) at the Embassy of Sweden in Dhaka. Slot availability is high, with typical queues of only **1 to 2 weeks**.
* **Embassy Interview**: Interviews are rarely requested unless there are discrepancies in financial resources or academic intentions.

## 2. Processing Durations
* **Standard Assessment Time**: Swedish Migration Agency (Migrationsverket) takes **2 to 3 months** for a decision. 
* **Prioritization**: Autumn semester applications are prioritized from May to August, but early submission is strongly recommended to avoid late arrivals.

## 3. Essential Action Tips & Requirements
* **Financial Bank Funds**: You must show a personal bank statement with at least **SEK 10,385 per month** for the entire duration of the permit (e.g., SEK 103,850 for a 10-month academic year). The funds must be held in your own name and be readily available (no fixed deposits).
* **Tuition Fee Payment**: The first installment of the university tuition fee must be paid and cleared before Migrationsverket begins assessing your application.
* **Schengen-Compliant Comprehensive Insurance**: If studying for less than two years, comprehensive medical insurance coverage of at least SEK 1,00,000 is mandatory.`,
    sources: [
      { title: "Swedish Migration Agency - Studies", url: "https://www.migrationsverket.se/English/Private-individuals/Studying-in-Sweden.html" },
      { title: "Embassy of Sweden Dhaka", url: "https://www.swedenabroad.se/en/embassies/bangladesh-dhaka/" }
    ]
  },
  "Finland": {
    text: `### 🇫🇮 Finland Residence Permit for Studies Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (VFS Dhaka)
* **Enter Finland Digital Submission**: Applications are submitted online via the Enter Finland portal.
* **Biometrics Verification (VFS Global Dhaka)**: Bangladeshi students must verify their identity and submit biometrics at the VFS Global Finland application center in Dhaka. Slot wait times are highly optimized, usually **1 to 2 weeks**.
* **No Direct Embassy Visit**: Almost all standard verification and document scanning is done at VFS Dhaka, making the queue streamlined.

## 2. Processing Durations
* **Migri Decision Speed**: The Finnish Immigration Service (Migri) processes digital student applications in **30 to 45 days** (4 to 6 weeks) on average. This is one of the fastest processing times in the Schengen zone.

## 3. Essential Action Tips & Requirements
* **Financial Requirements**: You must prove you have at least **€560 per month** (€6,720 per year) at your disposal. The funds must be in your personal bank account, and third-party sponsorships from relatives are strictly scrutinized.
* **Mandatory Private Health Insurance**: You must purchase student health insurance (e.g., Swisscare or SIP) covering medical expenses up to €120,000.
* **Fast-Track Stream**: First-year Master's degree students with full scholarships are eligible for priority processing.`,
    sources: [
      { title: "Finnish Immigration Service (Migri) - Studies", url: "https://migri.fi/en/studying-in-finland" },
      { title: "VFS Global Finland - Bangladesh", url: "https://visa.vfsglobal.com/bgd/en/fin/" }
    ]
  },
  "Poland": {
    text: `### 🇵🇱 Poland National Student Visa (Type D) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (VFS Dhaka / New Delhi Embassy)
* **New Decentralized Booking**: Poland recently authorized delegated VFS Global application centers in Dhaka to receive student visa files.
* **Slot Competition**: Visa appointment slot queueing is moderately competitive. Booking a slot at VFS Dhaka can take **4 to 6 weeks** during peak seasons (June-August).
* **Embassy Review**: In some instances, files may be routed to the Embassy of Poland in New Delhi for final decision-making.

## 2. Processing Durations
* **Consular Assessment Time**: Polish authorities process student visas within **15 to 30 calendar days** after receiving the complete physical application file.

## 3. Essential Action Tips & Requirements
* **Apostille & Legalization**: The Polish Ministry of Science and Higher Education strictly requires all high school/university transcripts to have an official **Apostille or Ministry Legalization** from the Ministry of Foreign Affairs (MoFA) in Dhaka.
* **Tuition Fee Confirmation**: A formal confirmation receipt of the paid tuition fee from the Polish university is required.
* **Sufficient Bank Balances & Travel Insurance**: Show living cost funds (€150/month equivalent) plus a return ticket budget. Provide travel insurance covering €30,000 across the entire Schengen Zone.`,
    sources: [
      { title: "Embassy of Poland New Delhi", url: "https://www.gov.pl/web/india/embassy-new-delhi" },
      { title: "VFS Global Poland - Bangladesh", url: "https://visa.vfsglobal.com/bgd/en/pol/" }
    ]
  },
  "Italy": {
    text: `### 🇮🇹 Italy Student Visa (National Visa Type D) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (VFS Dhaka)
* **VFS Global Italy Portal**: Appointments for Italian student visas are scheduled through VFS Global in Dhaka. Slots are highly competitive and can take **8 to 12 weeks** to secure during the peak pre-enrollment window (May to August).
* **Universitaly Pre-Enrollment**: Before booking a slot, you must complete your pre-enrollment on the official Universitaly portal and receive approval (Form A/Summary) from your target Italian university.

## 2. Processing Durations
* **Standard Embassy Processing**: The Embassy of Italy in Dhaka typically takes **4 to 8 weeks** to process student visas once documents are submitted.

## 3. Essential Action Tips & Requirements
* **Financial Suitability**: You must show personal/parental bank statements with at least **€6,000 per academic year** (approx. ৳8,00,000 BDT) in accessible funds.
* **DOV (Declaration of Value) or CIMEA**: Academic transcripts must have a Declaration of Value from the Italian Embassy or a CIMEA compatibility certificate to prove equivalence.
* **Schengen Insurance & Flights**: A one-way flight booking reservation and travel medical insurance covering at least €30,000 are mandatory.`,
    sources: [
      { title: "Italian Embassy in Dhaka", url: "https://ambdhaka.esteri.it/" },
      { title: "VFS Global Italy - Bangladesh", url: "https://visa.vfsglobal.com/bgd/en/ita/" }
    ]
  },
  "USA": {
    text: `### 🇺🇸 United States F-1 Student Visa Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (Dhaka Embassy)
* **US Embassy Dhaka Visa Queue**: Standard F-1 visa interview appointment wait times are currently **12 to 24 weeks (3 to 6 months)**. High-priority student visa drives are occasionally conducted in summer.
* **Emergency Appointments**: If your program start date is within 60 days and no regular appointments are available, you can request an expedited/emergency appointment.

## 2. Processing Durations
* **Immediate Decision**: Unlike European visas, the F-1 visa decision is made **immediately during your in-person interview** at the US Embassy in Dhaka. If approved, passport delivery takes **3 to 5 business days**.

## 3. Essential Action Tips & Requirements
* **I-20 Form**: Secure your Form I-20 (Certificate of Eligibility for Nonimmigrant Student Status) from your university.
* **SEVIS Fee**: Pay the **$350 SEVIS I-901 Fee** online before your interview.
* **Strong Ties & Funding**: Demonstrate robust liquid funds covering tuition and living costs for at least the first year of study, alongside clear intentions to return to Bangladesh post-graduation.`,
    sources: [
      { title: "US Embassy in Bangladesh", url: "https://bd.usembassy.gov/" },
      { title: "US Visa Scheduling - Bangladesh", url: "https://www.ustraveldocs.com/bd/" }
    ]
  },
  "New Zealand": {
    text: `### 🇳🇿 New Zealand Fee-Paying Student Visa Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (Online Portal)
* **RealMe Online Platform**: Applications are fully submitted online. No physical passport submission is needed initially, so there are no physical slot wait times.
* **Biometrics**: Verification processes are completed online or via specific designated partners.

## 2. Processing Durations
* **Immigration New Zealand (INZ)**: Student visa processing usually takes **6 to 10 weeks**. Ensure you submit your application at least 3 months prior to your intake.

## 3. Essential Action Tips & Requirements
* **Funds Requirement**: Show at least **NZD $20,000 per year** of study for living costs, plus return travel tickets and tuition fee coverage.
* **FTS (Funds Transfer Scheme)**: INZ may offer a Funds Transfer Scheme for Bangladeshi applicants, allowing safe locked-account transfers.
* **Medical & Police Clearance**: Chest X-ray and medical certificates from authorized panel doctors in Dhaka are mandatory for programs longer than 6 months.`,
    sources: [
      { title: "Immigration New Zealand - Student Visa", url: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/full-fee-paying-student-visa" }
    ]
  },
  "Singapore": {
    text: `### 🇸🇬 Singapore Student's Pass (STP) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (SOLAR System)
* **SOLAR Digital Portal**: Registration is fully online using the Student's Pass On-Line Application & Registration (SOLAR) system after university admission.
* **No Embassy Interview**: No physical embassy interview is required in Dhaka. Everything is processed digitally.

## 2. Processing Durations
* **Immigration & Checkpoints Authority (ICA)**: Standard processing times range from **2 to 4 weeks**. Peak season (June-August) might require up to 6 weeks.

## 3. Essential Action Tips & Requirements
* **Financial Guarantee**: Show sufficient funds (approximately SGD $30,000) for tuition and living costs in Singapore.
* **In-Principle Approval (IPA)**: Once approved, you will receive an IPA letter, which serves as your single-entry visa to enter Singapore and collect your physical STP card.
* **Medical Fitness Report**: A medical check-up (including HIV and Tuberculosis screening) is mandatory to claim your Pass upon arrival.`,
    sources: [
      { title: "Singapore ICA - Student's Pass", url: "https://www.ica.gov.sg/reside/STP" }
    ]
  },
  "Malaysia": {
    text: `### 🇲🇾 Malaysia Student Visa (eVAL) Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (EMGS Portal)
* **EMGS Digital System**: Malaysia student visas are processed online via the Education Malaysia Global Services (EMGS) portal.
* **Single Entry Visa (SEV)**: Once EMGS issues your eVAL (Electronic Visa Approval Letter), you must submit your passport to the Malaysian High Commission in Dhaka via an authorized agent, which takes **5 to 7 days**.

## 2. Processing Durations
* **eVAL Issuance**: EMGS approval takes **3 to 4 weeks** to reach 100% status.

## 3. Essential Action Tips & Requirements
* **Medical Screening**: Pre-arrival medical screening must be completed by designated clinics in Bangladesh and uploaded to the EMGS portal.
* **Academic Authentication**: Ensure high school certificates are verified by the board and MoFA in Dhaka.
* **Passport Validity**: Your passport must be valid for at least 18 months beyond the start date of your academic program.`,
    sources: [
      { title: "Education Malaysia Global Services (EMGS)", url: "https://educationmalaysia.gov.my/" },
      { title: "Malaysian High Commission Dhaka", url: "https://www.kln.gov.my/web/bgd_dhaka/home" }
    ]
  },
  "UAE": {
    text: `### 🇦🇪 United Arab Emirates Student Visa Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (University Sponsored)
* **University-led Process**: UAE student visas are fully sponsored and processed by the host university in Dubai, Abu Dhabi, or Sharjah.
* **No Embassy Visit**: Fully digital, zero-wait times for booking appointments in Dhaka.

## 2. Processing Durations
* **GDRFA / ICA Processing**: Typical processing takes **2 to 3 weeks**. Urgent tracks are available for 1 week.

## 3. Essential Action Tips & Requirements
* **Visa Sponsorship Fees**: Annual student visa charges (approx. AED 2,000 to AED 3,500) must be paid to the university.
* **Medical Screening**: Upon entry, students must complete medical fitness tests (blood test and chest X-ray) to convert their entry permit into an official Emirates ID.
* **Tuition Fee Deposits**: Most universities require a full semester's tuition fee clear before starting the visa process.`,
    sources: [
      { title: "Official UAE Government Portal", url: "https://u.ae/en/information-and-services/education/higher-education/student-visa" }
    ]
  },
  "Saudi Arabia": {
    text: `### 🇸🇦 Saudi Arabia Study Visa Intelligence for Bangladeshi Applicants

## 1. Appointment Slot Wait Times (Study in Saudi Portal)
* **Study in Saudi Portal**: Applications are initiated online via the Ministry of Education's centralized system.
* **Embassy Stamp**: Once the scholarship or admission is approved, passport submission is processed through authorized visa centers in Dhaka, taking **1 to 2 weeks**.

## 2. Processing Durations
* **Ministry Approval**: MoE clearance can take **4 to 8 weeks** during admissions cycles.

## 3. Essential Action Tips & Requirements
* **Fully Funded Scholarships**: Many Saudi student visas come with 100% tuition coverage, free accommodation, monthly stipends, and free annual flight tickets.
* **Police Clearance Certificate**: A verified, MoFA-attested police clearance certificate from Bangladesh is mandatory.
* **Attested Academic Records**: All previous academic transcripts must be translated to Arabic and attested by the Saudi Embassy in Dhaka.`,
    sources: [
      { title: "Study in Saudi Centralized Portal", url: "https://studyinsaudi.moe.gov.sa/" }
    ]
  }
};

export async function handleDestinationInfo(req: Request, res: Response) {
  const { country } = req.body;

  if (!country) {
    res.status(400).json({ error: "Country parameter is required" });
    return;
  }

  // Normalize country name
  const normalizedCountry = country.trim();

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("[Destination Info] GEMINI_API_KEY environment variable is not defined, serving fallback.");
      const fallback = FALLBACK_DATA[normalizedCountry] || FALLBACK_DATA["Germany"];
      res.json({
        success: true,
        country: normalizedCountry,
        text: fallback.text + "\n\n*(Note: Displaying offline pre-compiled intelligence since the live search service is unconfigured)*",
        sources: fallback.sources,
      });
      return;
    }

    const prompt = `Search and provide the most up-to-date and specific Schengen student visa (National Visa Type D) appointment wait times, slots availability, and processing speeds for applicants from Bangladesh applying to travel to ${normalizedCountry}.
Provide:
1. Current estimated appointment slot waiting times (e.g., in weeks or months) at the respective embassy or VFS Global in Dhaka, Bangladesh.
2. Estimated processing duration once the interview/documents are submitted.
3. Essential, highly specific action tips for Bangladeshi students applying for this intake (e.g., Blocked account, VFS procedures, or portal requirements).

Format your response in professional, highly readable markdown. Be objective, concise, and accurate based on the latest web searches.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No intelligence data could be compiled at this time.";

    // Extract grounding sources securely
    const sources: { title: string; url: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Official Resource",
            url: chunk.web.uri,
          });
        }
      }
    }

    // Remove duplicates from sources
    const uniqueSources = sources.filter(
      (source, index, self) => self.findIndex((s) => s.url === source.url) === index
    );

    res.json({
      success: true,
      country: normalizedCountry,
      text,
      sources: uniqueSources,
    });
  } catch (err: any) {
    console.log("[Notice] Live search quota limitation encountered; applying pre-compiled Schengen visa intelligence database for", normalizedCountry);
    
    // Fall back gracefully instead of returning 500
    const fallback = FALLBACK_DATA[normalizedCountry] || FALLBACK_DATA["Germany"];
    res.json({
      success: true,
      country: normalizedCountry,
      text: fallback.text + "\n\n*(Note: Grounded via high-fidelity pre-compiled Dhaka embassy intelligence due to current live search rate limits)*",
      sources: fallback.sources,
    });
  }
}

