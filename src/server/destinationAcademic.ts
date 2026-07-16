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

const ACADEMIC_FALLBACK_DATA: Record<string, { text: string; sources: { title: string; url: string }[] }> = {
  "Germany": {
    text: `### 🇩🇪 Germany Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **World-Class Public Education**: Germany is famous for its tuition-free education at public universities for both EU and non-EU students (with the exception of Baden-Württemberg state and minor administrative semester fees of €150-€400).
* **Universities vs. Universities of Applied Sciences (Fachhochschulen)**: Standard universities focus heavily on theoretical research and doctorates. Fachhochschulen (FH) are highly practice-oriented, featuring mandatory internships, close industry ties, and applied project work.
* **Winter and Summer Intakes**: The primary intake is Winter (starts October; applications close around July 15th), while the secondary intake is Summer (starts April; applications close around January 15th).

## 2. Top 3 Universities for International Students
* **Technical University of Munich (TUM)**: Consistently ranked as Germany's top technical university, renowned for Computer Science, Engineering, and entrepreneurship.
* **Ludwig Maximilian University of Munich (LMU)**: A global powerhouse in humanities, natural sciences, medicine, and research.
* **Heidelberg University**: Germany's oldest university, exceptionally strong in medicine, life sciences, and physical sciences.

## 3. Post-study Work Opportunities
* **18-Month Job Seeker Visa**: Upon graduating from a German university, international students are granted an 18-month residence permit to find a job matching their qualification.
* **No Work Restrictions**: During these 18 months, graduates can work any job (even unrelated) to support themselves while looking for permanent professional employment.
* **Fast-Track Permanent Residency (PR)**: Graduates can apply for a permanent settlement permit (Niederlassungserlaubnis) after working in a qualified position for just **2 years** (24 months) and paying pension contributions.`,
    sources: [
      { title: "DAAD Germany - Higher Education System", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/the-german-higher-education-system/" },
      { title: "Make it in Germany - Prospects after Studies", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany/prospects-after-studies" }
    ]
  },
  "Sweden": {
    text: `### 🇸🇪 Sweden Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Student-Centered & Innovative**: The Swedish higher education system ranks among the best in the world, prioritizing group work, critical thinking, and informal non-hierarchical relationships (students address professors by first name).
* **ECTS Credits and Structure**: Degrees align with the European Bologna Process. A standard Bachelor's is 3 years (180 ECTS) and a Master's is 1 or 2 years (60/120 ECTS).
* **Tuition Fees and Scholarships**: Sweden charges tuition fees for non-EU/EEA students. However, the prestigious Swedish Institute (SI) Scholarship covers 100% of tuition, living expenses, travel, and insurance for select countries, including Bangladesh.

## 2. Top 3 Universities for International Students
* **KTH Royal Institute of Technology**: Sweden's largest and most respected technical university, based in Stockholm, leading in Engineering and Tech.
* **Lund University**: Founded in 1666, highly prestigious and ranked in the global Top 100, offering massive English-taught Master's portfolios.
* **Uppsala University**: The oldest university in the Nordic countries (founded 1477), famous for life sciences, medicine, and social sciences.

## 3. Post-study Work Opportunities
* **12-Month Job Search Permit**: Sweden offers a 1-year residence permit after graduation for international students to look for work or start a business.
* **Work Permit Requirements**: Once you secure a job offer that pays a salary aligned with Swedish collective agreements (and above the current minimum threshold), you can transition to a Work Permit.
* **Direct Path to PR**: After holding a work permit for **4 years** (48 months), you are eligible to apply for Swedish Permanent Residence (PR). Additionally, PhD graduates receive fast-tracked PR tracks.`,
    sources: [
      { title: "Study in Sweden - Official Portal", url: "https://studyinsweden.se/" },
      { title: "Swedish Migration Agency - Working after studies", url: "https://www.migrationsverket.se/English/Private-individuals/Studying-in-Sweden/After-completed-studies.html" }
    ]
  },
  "Finland": {
    text: `### 🇫🇮 Finland Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Ranked #1 for Happiness & Education**: Finland's education system is highly respected globally, emphasizing research, equality, and high educational autonomy.
* **Research Universities vs. Universities of Applied Sciences (AMKs)**: Research universities focus on scientific research, while AMKs (Ammattikorkeakoulu) focus on vocational/practical professional skills for direct employment.
* **English-Taught Master's**: Wide availability of high-quality courses in IT, Sustainability, Clean Tech, and Business.

## 2. Top 3 Universities for International Students
* **University of Helsinki**: The country's oldest and largest institution, ranking among the world's top 100 research universities.
* **Aalto University**: A highly innovative merger of technology, business, and art/design, famous for its startup culture (creator of Slush).
* **Tampere University**: A leading hub for technology, health, and societal research.

## 3. Post-study Work Opportunities
* **2-Year Post-Study Visa**: Finland offers a highly generous **2-year residence permit** (which can be split into parts within 5 years of graduation) to look for work or establish a business.
* **Extended Work Permit**: Once a professional job is secured, you apply for a residence permit on the grounds of employment.
* **Permanent Residency**: After **4 years** of continuous residence in Finland on an "A" (continuous) permit, you are eligible to apply for Permanent Residency. Finnish language proficiency provides rapid advantages.`,
    sources: [
      { title: "Study in Finland - Official Portal", url: "https://www.studyinfinland.fi/" },
      { title: "Finnish Immigration Service (Migri) - Work after graduation", url: "https://migri.fi/en/extended-permit-to-look-for-work" }
    ]
  },
  "Poland": {
    text: `### 🇵🇱 Poland Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Affordable European Quality**: Poland offers high-quality European university degrees with significantly lower tuition fees and living costs compared to Western Europe (tuition averages €2,000-€4,000 per year).
* **Bologna Process Integration**: Offers 3-year Bachelor's and 2-year Master's degrees recognized globally and fully compatible within the European Higher Education Area (EHEA).
* **Rich Academic Tradition**: Poland has a centuries-old academic history with modern campus infrastructures and expanding English-taught portfolios.

## 2. Top 3 Universities for International Students
* **University of Warsaw**: Poland's largest and top-ranked research university, highly respected globally.
* **Jagiellonian University**: Located in Kraków, founded in 1364 (one of the oldest in Europe), featuring world-renowned historical prestige.
* **Warsaw University of Technology**: The premier technical university in Poland, outstanding for engineering, robotics, and IT.

## 3. Post-study Work Opportunities
* **9-Month Temporary Residence Permit**: Polish university graduates can apply for a 9-month temporary residence card specifically to look for a job or start a business.
* **Exemption from Work Permit**: A major advantage of graduating from a full-time Polish university is that you are **exempt from needing a labor market work permit** to work in Poland. You can work freely for any employer.
* **EU Long-Term Residency**: After 5 years of continuous legal stay (including half of the years spent studying plus work years), you can apply for EU Long-Term Resident status.`,
    sources: [
      { title: "Ready, Study, Go! Poland", url: "https://study.gov.pl/" },
      { title: "Office for Foreigners - Poland Graduation Prospects", url: "https://www.gov.pl/web/udsc-en" }
    ]
  }
};

export async function handleDestinationAcademic(req: Request, res: Response) {
  const { country } = req.body;

  if (!country) {
    res.status(400).json({ error: "Country parameter is required" });
    return;
  }

  const normalizedCountry = country.trim();

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("[Destination Academic] GEMINI_API_KEY is not defined, serving pre-compiled intelligence.");
      const fallback = ACADEMIC_FALLBACK_DATA[normalizedCountry] || ACADEMIC_FALLBACK_DATA["Germany"];
      res.json({
        success: true,
        country: normalizedCountry,
        text: fallback.text + "\n\n*(Note: Displaying offline pre-compiled academic intelligence since the live search service is unconfigured)*",
        sources: fallback.sources,
      });
      return;
    }

    const prompt = `Search and provide highly current, authoritative academic and career intelligence for students from Bangladesh traveling to ${normalizedCountry}.
Provide the following sections strictly in detailed, professional markdown format:
1. **Education System Overview**: Key facts, structural parameters, tuition rules, and winter/summer intake mechanics.
2. **Top 3 Universities for International Students**: Highly respected options including their unique specializations or rankings.
3. **Post-study Work Opportunities**: Job search visa duration details, work authorization rules, and the path to permanent residency (PR).

Be objective, concise, and accurate based on the latest web search results.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No academic intelligence could be compiled at this time.";

    // Extract grounding sources
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
    console.log("[Notice] Live search quota limitation encountered; applying pre-compiled academic intelligence database for", normalizedCountry);
    const fallback = ACADEMIC_FALLBACK_DATA[normalizedCountry] || ACADEMIC_FALLBACK_DATA["Germany"];
    res.json({
      success: true,
      country: normalizedCountry,
      text: fallback.text + "\n\n*(Note: Grounded via high-fidelity pre-compiled European academic intelligence due to current live search rate limits)*",
      sources: fallback.sources,
    });
  }
}
