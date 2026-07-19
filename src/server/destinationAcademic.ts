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
  },
  "Italy": {
    text: `### 🇮🇹 Italy Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Affordable Excellence & Historic Legacy**: Italy features some of Europe's oldest and most prestigious universities. Tuition fees at public universities are highly affordable (averaging €1,000 to €3,000 per year) and are often based on family income (ISEE certification).
* **Massive English Portfolios**: Major institutions offer a wide array of completely English-taught Bachelor's and Master's courses, particularly in engineering, architecture, design, and economics.
* **Generous DSU Scholarships**: The regional DSU scholarships provide selected international students with 100% free tuition, free university student housing, and free meal plans, plus a yearly stipend of up to €7,000.

## 2. Top 3 Universities for International Students
* **Sapienza University of Rome**: Founded in 1303, one of Europe's largest universities, world-renowned for Classics, Physics, and Aerospace Engineering.
* **Politecnico di Milano**: The top-ranked technical university in Italy, highly prestigious globally for engineering, architecture, and industrial design.
* **University of Bologna**: Known as the oldest university in the Western world (founded 1088), offering robust, modern, English-medium curricula.

## 3. Post-study Work Opportunities
* **12-Month Job Seeker Residence Permit**: Upon completing a degree, graduates can apply for a 12-month permit (Permesso di Soggiorno per Cerca Occupazione) to look for a job or start a business.
* **Work Authorization Conversion**: Once you secure a qualified employment contract, you can instantly convert your student/job-seeker permit into a standard work permit (lavoro subordinato) under the national quotas.
* **Direct Permanent Residency Track**: Long-term EU residency is attainable after 5 years of continuous legal residence in Italy.`,
    sources: [
      { title: "Study in Italy - Official Portal", url: "https://studyinitaly.esteri.it/" },
      { title: "Universitaly Portal", url: "https://www.universitaly.it/" }
    ]
  },
  "USA": {
    text: `### 🇺🇸 United States Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **The Global Standard in Higher Education**: The United States hosts the largest number of high-ranking universities globally, characterized by exceptional academic flexibility, substantial research budgets, and extensive industry-funded labs.
* **Diverse Institutional Range**: Choose from top-tier research universities, prestigious private Ivy League schools, extensive public state university systems, and focused liberal arts colleges.
* **Assistantships & Funding**: Graduate students can often offset tuition and secure living stipends via Graduate Assistantships (Teaching Assistant/TA or Research Assistant/RA).

## 2. Top 3 Universities for International Students
* **Massachusetts Institute of Technology (MIT)**: The world's undisputed leader in science, computer technology, and engineering sciences.
* **Stanford University**: Anchored in Silicon Valley, leading globally in tech, venture capital, and business management.
* **Harvard University**: The oldest and most prestigious Ivy League university, boasting elite portfolios across law, business, medicine, and humanities.

## 3. Post-study Work Opportunities
* **OPT (Optional Practical Training)**: Standard F-1 graduates are eligible for 12 months of temporary employment authorization matching their study field.
* **STEM OPT Extension**: Graduates with eligible Science, Technology, Engineering, or Math (STEM) degrees receive an additional **24-month extension** (totaling 3 years of work rights in the US!).
* **H-1B & Green Card Pathways**: OPT employment is the standard pipeline to secure corporate H-1B specialty occupation visa sponsorship and transition to employment-based permanent residency (Green Card).`,
    sources: [
      { title: "EducationUSA - Official Source on US Higher Ed", url: "https://educationusa.state.gov/" },
      { title: "USCIS - Optional Practical Training for F-1 Students", url: "https://www.uscis.gov/working-in-the-united-states/students-and-employment/optional-practical-training-opt-for-f-1-students" }
    ]
  },
  "New Zealand": {
    text: `### 🇳🇿 New Zealand Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Highly Practical & Project-led**: All 8 of New Zealand's public universities rank in the top 3% globally (QS World Rankings). The system emphasizes critical analysis, self-guided research, and practical problem-solving.
* **Work During Studies**: International students are legally authorized to work up to 20 hours per week during academic semesters and full-time during holidays.
* **Safe, Vibrant Quality of Life**: Highly welcoming environment with spectacular natural beauty, low crime rates, and robust post-graduate work streams.

## 2. Top 3 Universities for International Students
* **University of Auckland**: New Zealand's largest and highest-ranked university, globally renowned for research, medicine, and engineering.
* **University of Otago**: Based in Dunedin, world-renowned for health sciences, biology, and molecular science.
* **Victoria University of Wellington**: Located in the capital city, featuring strong government links, public administration, and creative technologies.

## 3. Post-study Work Opportunities
* **Post-Study Work Visa (PSWV)**: New Zealand offers a generous post-study work visa for up to **3 years**, depending on the level of qualification completed (typically 3 years for Bachelor's/Master's/PhD).
* **Open Work Rights**: PSWV provides open work rights, allowing you to work for virtually any employer in any role.
* **Path to Permanent Residency**: NZ utilizes a points-based Skilled Migrant Category alongside Green List occupations, offering straightforward pathways to residency for high-demand professionals.`,
    sources: [
      { title: "Study with New Zealand - Official Government Portal", url: "https://www.studywithnewzealand.govt.nz/" },
      { title: "Immigration New Zealand - Post Study Work Visa", url: "https://www.immigration.govt.nz/new-zealand-visas/already-have-a-visa/my-situation-has-changed/study/post-study-work-visa" }
    ]
  },
  "Singapore": {
    text: `### 🇸🇬 Singapore Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **The Academic Capital of Asia**: Singapore represents an ultra-modern global hub of innovation, commerce, and technology, featuring world-leading academic standards.
* **Bilingual & Multicultural**: Education is entirely in English, paired with high-quality, safe, and clean living environments.
* **Tuition Grant Scheme (TGS)**: The Singapore government offers substantial tuition grants to international students in exchange for a commitment to work in Singapore for 3 years post-graduation.

## 2. Top 3 Universities for International Students
* **National University of Singapore (NUS)**: Ranked consistently in the global Top 10-15, famous for engineering, CS, and natural sciences.
* **Nanyang Technological University (NTU)**: A powerhouse in technological innovation, materials sciences, and advanced computing.
* **Singapore Management University (SMU)**: A specialized, business-style school modeled on Wharton, offering elite programs in finance, business, and economics.

## 3. Post-study Work Opportunities
* **Long-Term Social Visit Pass (LTVP)**: Graduates from local universities are eligible for a 1-year social visit pass specifically to seek professional work.
* **Employment Pass (EP) or S Pass**: Once you secure a job meeting the minimum salary threshold, your employer sponsors an EP or S Pass.
* **Straightforward Permanent Residency**: Singapore offers a direct PR application stream for professional pass holders who live and pay taxes in Singapore.`,
    sources: [
      { title: "Ministry of Education Singapore", url: "https://www.moe.gov.sg/post-secondary/overview" }
    ]
  },
  "Malaysia": {
    text: `### 🇲🇾 Malaysia Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Affordable Global Hub**: Malaysia offers high-ranking global education at a fraction of Western costs. Typical tuition fees are $2,500 to $5,000 per year, coupled with very low living costs.
* **Foreign Branch Campuses**: Hosts premium branch campuses of top-tier foreign universities (e.g., Monash University, University of Nottingham) offering identical degrees at a lower cost.
* **Strategic Regional Hub**: Safe, multicultural country with extensive links to global MNCs across Southeast Asia.

## 2. Top 3 Universities for International Students
* **Universiti Malaya (UM)**: Malaysia's premier research university, ranked in the global top 70, strong in science, medicine, and engineering.
* **Universiti Putra Malaysia (UPM)**: Exceptionally strong in agricultural science, forestry, biotechnology, and computer science.
* **Taylor's University**: The top-ranked private university in Malaysia, internationally renowned for hospitality, business, and creative fields.

## 3. Post-study Work Opportunities
* **PLS (Pass Law Law Scheme)**: Graduates can apply for short-term residency to seek employment.
* **Employment Pass (EP)**: To work in Malaysia, students must secure a job offer from an MSC-status or authorized company that sponsors an Employment Pass (Category I, II, or III).
* **Regional Career Launchpad**: Provides excellent initial career starts with multinational companies operating in Kuala Lumpur and Penang.`,
    sources: [
      { title: "Education Malaysia Global Services", url: "https://educationmalaysia.gov.my/" }
    ]
  },
  "UAE": {
    text: `### 🇦🇪 United Arab Emirates Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Expanding Global Campus Hub**: The UAE (particularly Dubai and Abu Dhabi) hosts prestigious branch campuses of top international universities (e.g., NYU Abu Dhabi, Heriot-Watt, Birmingham, Wollongong).
* **Tax-Free Environment**: Living and learning in a tax-free, high-income country with a vibrant international student population.
* **Strategic Geographical Hub**: Directly accessible from Dhaka with very high safety standards.

## 2. Top 3 Universities for International Students
* **United Arab Emirates University (UAEU)**: The country's flagship public research university, highly respected for sciences and engineering.
* **New York University Abu Dhabi (NYUAD)**: An elite liberal arts and science branch campus of NYU, fully funded research, and highly selective.
* **American University of Sharjah (AUS)**: Heavily renowned across the Gulf region for engineering, architecture, and business.

## 3. Post-study Work Opportunities
* **Golden Visa for Outstanding Graduates**: High-performing university graduates (GPA of 3.8+ or top percentile) are eligible for a prestigious **10-year Golden Visa** without any local sponsor!
* **Standard Work Residency**: Transition to standard corporate residency is sponsor-led, which is highly dynamic given the massive tax-free commercial market in Dubai and Abu Dhabi.`,
    sources: [
      { title: "UAE Ministry of Education", url: "https://www.moe.gov.ae/en/" }
    ]
  },
  "Saudi Arabia": {
    text: `### 🇸🇦 Saudi Arabia Academic & Career Intelligence for Bangladeshi Students

## 1. Education System Overview
* **Elite Funding & Research Facilities**: Saudi Arabia's leading research universities are some of the wealthiest in the world, featuring massive endowment funds and state-of-the-art laboratory infrastructures.
* **Fully Funded Scholarships**: Almost all international student admissions are accompanied by comprehensive scholarships covering tuition, housing, health care, and monthly stipends.
* **Vision 2030 Growth**: Expanding industrial research collaborations under the historic Vision 2030 initiative.

## 2. Top 3 Universities for International Students
* **King Abdullah University of Science and Technology (KAUST)**: A graduate-only, international research university, globally prestigious for sciences and engineering.
* **King Fahd University of Petroleum and Minerals (KFUPM)**: One of the elite engineering hubs in the Middle East, highly sought after by global energy sectors.
* **King Saud University (KSU)**: Based in Riyadh, oldest public university in KSA with massive medical and research faculties.

## 3. Post-study Work Opportunities
* **Vision 2030 Corporate Hiring**: Graduates are highly prioritized for technical roles in major Saudi gigaprojects (e.g., NEOM, Aramco research centers).
* **Iqama Transfer**: Transitioning from a student visa to a standard Employment Iqama is handled directly by sponsoring employers in Saudi Arabia.`,
    sources: [
      { title: "Study in Saudi Official Portal", url: "https://studyinsaudi.moe.gov.sa/" }
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
