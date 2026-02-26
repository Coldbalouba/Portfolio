import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Server, BrainCircuit, Briefcase, 
  Mail, Phone, MapPin, ChevronRight, Github, ExternalLink, 
  Menu, X, LineChart, Globe, Database, MessageSquare, BookOpen, GraduationCap, Award, ShieldCheck,
  Send, Bot, User, Loader2, Monitor, ImageIcon, ChevronLeft
} from 'lucide-react';

// Chat uses server-side /api/chat (set GEMINI_API_KEY in Vercel). No key in client.

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey there! 👋 I'm AJ's custom AI clone. I've been trained on his entire brain (well, his resume, projects, and skills at least!). Go ahead and interview me to see if he's a fit for your team!" }
  ]);
  
  const messagesEndRef = useRef(null);
  const galleryVideoRef = useRef(null);

  // Gallery State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [currentGalleryTitle, setCurrentGalleryTitle] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (project) => {
    if (project.gallery && project.gallery.length > 0) {
      setCurrentGallery(project.gallery);
      setCurrentGalleryTitle(project.title);
      setCurrentImageIndex(0);
      setGalleryOpen(true);
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % currentGallery.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + currentGallery.length) % currentGallery.length);

  // High-quality Drive image: large thumbnail (w1920). "Open full size" opens Drive for GIFs/full res.
  const toDriveImageUrl = (url, large = true) => {
    const match = typeof url === "string" && url.includes("drive.google.com") && url.match(/[?&]id=([^&]+)/);
    if (!match) return url;
    const id = match[1];
    return large ? `https://drive.google.com/thumbnail?id=${id}&sz=w1920` : `https://drive.google.com/uc?export=view&id=${id}`;
  };
  const getDriveViewUrl = (url) => {
    const match = typeof url === "string" && url.includes("drive.google.com") && url.match(/[?&]id=([^&]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/view` : url;
  };

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const systemPrompt = `You are the AI clone and professional representative of Ahmed Jouini (AJ). Answer as if you are AJ himself: confident, professional, concise, and enthusiastic. Use first person only.

1. CORE IDENTITY & DEMOGRAPHICS
- Name: Ahmed Jouini (AJ). Age: 31. Nationality: Tunisian.
- Current location: Phnom Penh, Cambodia (resident 4+ years). Open to remote worldwide.
- Physical: 178 cm, 75 kg.
- Languages: English (native-level), French (fluent), Arabic (fluent), Polish (intermediate), Spanish (intermediate).
- Contact: Phone +855061292510 | Email Coldbalouba@gmail.com.
- Roles: Whole Stack Developer, AI Consultant, Business Strategist, Educator.

2. EDUCATION & CERTIFICATIONS
Degrees: IPGCE (University of Essex, UK, 2024-2025); BA Business Management (London School of International Business, 2026); BS Computer Science (Faculty of Science & Technology, Tunisia, 2012-2015).
Technical & AI: Google AI Essentials (2025), IBM Applied AI Professional Certificate (2025), Machine Learning Specialization (DeepLearning.AI, 2024).
Teaching & pastoral: Advanced TEFL (120-hr), Teaching Business English, Teaching Young Learners, Social-Emotional Learning (CASEL & UNESCO, 2025), Mental Health First Aid (2025), Child Safety PD, First Aid.

3. PROFESSIONAL EXPERIENCE — EDUCATION & PEDAGOGY
- ELT Berkeley International School (July 2025–Present): IGCSE and AS/A Levels Business Teacher / Business Instructor. Integrates AI/ML for assessments, business/finance models for case studies, leads community innovation. Teaches Global Perspectives Year 8 to AS Level.
- Footprints International School (Aug 2023–July 2025): Homeroom & English Teacher / Curriculum Developer. Built EdTech environments for delivery and analytics. Pastoral care, EAL differentiation (phonics/reading), "Student Voice" initiatives.
- Golden Gate American School (Sep 2022–Aug 2023): Grade 5 & 6 Homeroom Teacher. Core subjects, social studies, daily SEL.
- Invictus International School (Mar 2022–Aug 2022): French & ESL Cover Teacher.
Pedagogy: Inquiry-Based Learning, Gamification, Project-Based Learning, Positive Discipline.

4. PROFESSIONAL EXPERIENCE — BUSINESS & FREELANCE
- Business consulting (Cambodia): Consulting in Phnom Penh and Siem Reap; assisted 20+ businesses over 3 years with optimization and strategy.
- Freelance (Upwork/Fiverr, 2015–Present): Custom apps and media (Python/Unity/Adobe). AI consulting for research and automation; e.g. 30% productivity boosts for clients.

5. TECHNICAL & DIGITAL SKILLS
AI & ML: Expert prompting and ML pipelines. ChatGPT, Grok, TensorFlow, PyTorch. Open-source local AI (e.g. clawdbot via Termux on Android).
Programming: Python, JavaScript, Java, MQL5 (trading bots/scripts).
Automation: n8n with Gmail and other APIs.
Software & EdTech: Google Workspace, Moodle, Canvas, Adobe Creative Suite, Canva, Unity, Figma, Scratch, Minecraft Education.
Data: Excel, Google Sheets, SQL.

6. FINANCE & TRADING
- Active day trader; focus on XAU/USD (Gold) and silver. Platforms: MT5, Exness, cTrader, TradingView.
- Strong in business finance models, hedging, risk management, ratio calculations.
- STRICT: When calculating Return on Capital Employed (ROCE), use current liabilities in the formula, not long-term liabilities.

7. CREATIVE PROJECTS, INTERESTS & TRIVIA
- Creative writing: Developing a comic universe. Lead characters include "Zero" (superbeing form "The Being") and "Gray". STRICT: Do not default Gray's age to 25; follow custom backstory specs.
- History & culture: Ancient history (Punic Wars, Carthage vs Rome), Nordic Noir, The Book Thief, The Rocky Horror Picture Show.
- Gaming: Football Manager (record-breaking challenges), eFootball (scouting high-potential youth). Coaches youth football in real life.
- Pop culture & astrology: Superhero lore and power scaling (e.g. Dr. Manhattan, Ebony Maw); astrological character traits (e.g. Aquarius and Aries).

8. PROJECTS (TECH)
- BizOps-AI Enterprise Suite: Enterprise AI automation, predictive analytics, workflow optimization.
- MyBot: Headless server/dock for browser automation via natural language (Ollama, Gemini vision).
- SchoAi Platform: AI-driven EdTech for schools; tutoring, admin tools, secure hub.
- DeskUp: Desktop environment manager and productivity suite for remote work.
- TeachHelp AI Generator: Gemini-based tool for teachers to create HTML lesson packages quickly.

RULES:
- Always first person. Tone: professional, competent, slightly witty and approachable.
- Keep responses to 3–4 short paragraphs for recruiters.
- If outside knowledge base: "That's a great question! I'd love to discuss that in an interview. Email me at Coldbalouba@gmail.com."
- Emphasize the mix of business, tech, and AI.`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = { role: "user", text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory, systemPrompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error || `Error ${res.status}`;
        console.error("Chat API error:", res.status, data);
        setMessages(prev => [...prev, { role: "ai", text: `Something went wrong: ${errMsg}. Make sure GEMINI_API_KEY is set in Vercel → Settings → Environment Variables and redeploy. You can always email me at Coldbalouba@gmail.com!` }]);
        return;
      }

      const aiText = data?.text || "I didn't get a reply. Try again or email me at Coldbalouba@gmail.com!";
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "Network error. If you're testing locally, run `vercel dev` so the chat API works. Otherwise reach out at Coldbalouba@gmail.com!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const projects = [
    {
      title: "BizOps-AI Enterprise Suite",
      category: "Business Intelligence & AI",
      description: "An enterprise-grade AI automation suite designed to streamline business operations. Integrates predictive analytics, automated reporting, and LLM-driven workflow optimizations to elevate organizational efficiency.",
      tech: ["Next.js", "Python", "LLM APIs", "Data Analytics", "AWS"],
      icon: <LineChart className="w-6 h-6 text-orange-400" />,
      githubLink: "https://github.com/Coldbalouba/BizOps-AI.git",
      gallery: ["/projects/bizops-ai/video.mp4", "/projects/bizops-ai/1.png"]
    },
    {
      title: "MyBot - AI Web Automator",
      category: "AI Desktop/Server App",
      description: "A headless server and dock for controlling browsers using natural language. Automates web tasks with vision-capable AI models (Local Ollama or Cloud APIs like Gemini). Features a FastAPI server for VPS hosting.",
      tech: ["Python", "FastAPI", "Ollama", "AI Vision", "Chromium"],
      icon: <img src="/image_439cb4.jpg" alt="MyBot Logo" className="w-7 h-7 rounded-md object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=MB&background=0f172a&color=34d399"; }} />,
      githubLink: "https://github.com/Coldbalouba/MyBot.git",
      gallery: ["/projects/mybot/2.png"]
    },
    {
      title: "SchoAi Platform",
      category: "EdTech & AI System",
      description: "A comprehensive AI-driven educational platform designed for responsible use in schools. It features intelligent tutoring, automated administrative tools, and a centralized hub to connect students, teachers, and stakeholders securely.",
      tech: ["React", "Python", "Node.js", "AI Integration", "PostgreSQL"],
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
      githubLink: "https://github.com/Coldbalouba/SchoAi",
      gallery: ["/projects/schoai/video.mp4", "/projects/schoai/1.png"]
    },
    {
      title: "DeskUp - Workspace Automator",
      category: "Desktop Productivity App",
      description: "An advanced desktop environment manager and productivity suite. Integrates system-level automation, smart task prioritization, and cross-platform syncing to optimize daily workflows for remote professionals.",
      tech: ["Electron", "React", "TypeScript", "Node.js", "System APIs"],
      icon: <Monitor className="w-6 h-6 text-indigo-400" />,
      githubLink: "https://github.com/Coldbalouba/DeskUp.git",
      gallery: ["/projects/deskup/video.mp4", "/projects/deskup/2.png"]
    },
  ];

  const skills = [
    { category: "AI & Machine Learning", items: ["TensorFlow", "PyTorch", "ChatGPT/Grok", "Prompt Engineering", "ML Pipelines", "Local AI (e.g. clawdbot)"] },
    { category: "Full Stack & Automation", items: ["Python", "JavaScript/Java", "React & Next.js", "Node.js", "n8n (Gmail/APIs)", "MQL5 (trading bots)", "SQL/Excel"] },
    { category: "Business & Pedagogy", items: ["Business/Finance Models", "Tech Consulting", "Inquiry-Based Learning", "Gamification", "PBL", "Positive Discipline"] },
    { category: "Design & EdTech", items: ["Figma", "Adobe Suite", "Unity", "Google Workspace", "Moodle/Canvas", "Scratch", "Git/GitHub"] }
  ];

  const languages = [
    { name: "English", level: "Native", markets: "Global Standard" },
    { name: "Arabic", level: "Fluent", markets: "MENA Region Tech Hubs" },
    { name: "French", level: "Fluent", markets: "Europe & Canada" },
    { name: "Spanish", level: "Intermediate", markets: "LATAM Nearshoring" },
    { name: "Polish", level: "Intermediate", markets: "Eastern Europe IT" }
  ];

  const certifications = [
    {
      title: "Google AI Essentials & IBM Applied AI",
      status: "Achieved (2025)",
      description: "Foundational and applied certifications demonstrating practical ability to leverage LLMs and build intelligent automation pipelines.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "ML Specialization (DeepLearning.AI)",
      status: "Achieved (2024)",
      description: "Advanced coursework in building, training, and deploying machine learning models, neural networks, and deep learning architectures.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "AWS / Azure / GCP Cloud Certifications",
      status: "Consulting Range",
      description: "Expertise in remote IT support, server deployment, and scalable cloud infrastructure to maximize remote market ROI.",
      icon: <Globe className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Microsoft Azure AI Fundamentals",
      status: "Consulting Range",
      description: "Approachable and business-ready. Validates AI literacy for translating complex tech into actionable business strategies.",
      icon: <Briefcase className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Google Professional ML Engineer",
      status: "Consulting Range",
      description: "Specialized expertise on the data and AI side, ensuring high-performance model training and MLOps lifecycle management.",
      icon: <LineChart className="w-5 h-5 text-orange-400" />
    },
    {
      title: "AI/ML Implementation (CAIP, SAS, NVIDIA)",
      status: "Consulting Range",
      description: "Validates specialized expertise in implementing robust, secure AI solutions effectively within large-scale organizations.",
      icon: <Server className="w-5 h-5 text-pink-400" />
    },
    {
      title: "Teaching & Pastoral",
      status: "Achieved",
      description: "Advanced TEFL (120-hr), Teaching Business English, Teaching Young Learners, SEL (CASEL & UNESCO 2025), Mental Health First Aid (2025), Child Safety PD, First Aid.",
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-emerald-900/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-white cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            AJ<span className="text-emerald-500">.</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium">
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors">About</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-emerald-400 transition-colors">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-emerald-400 transition-colors">Projects</button>
            <button onClick={() => scrollToSection('certifications')} className="hover:text-emerald-400 transition-colors">Certs</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-emerald-400 transition-colors">Experience</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-800 shadow-xl py-4 flex flex-col items-center space-y-4 border-b border-slate-700">
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors">About</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-emerald-400 transition-colors">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-emerald-400 transition-colors">Projects</button>
            <button onClick={() => scrollToSection('certifications')} className="hover:text-emerald-400 transition-colors">Certs</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-emerald-400 transition-colors">Experience</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Remote Roles & Consulting</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Business Strategy</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">AI Technology.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Hi, I'm Ahmed Jouini (AJ)—Tunisian, based in Phnom Penh for 4+ years. I'm a Whole Stack Developer, AI Consultant, Business Strategist, and Educator. I build software that automates workflows, advise businesses on strategy and AI, and teach IGCSE/AS Business and Global Perspectives. I work in five languages and thrive at the intersection of tech, business, and pedagogy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => scrollToSection('projects')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center">
                View My Work <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <button onClick={() => setChatOpen(true)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all flex items-center justify-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Bot className="w-5 h-5 mr-3 text-emerald-400 group-hover:animate-bounce relative z-10" /> 
                <span className="relative z-10">Interview My AI Clone</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">More Than Just a Developer.</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  I hold a BS in Computer Science (Tunisia), an IPGCE from the University of Essex, and I'm completing a BA in Business Management. I've spent 4+ years in Cambodia—teaching at international schools and consulting 20+ businesses in Phnom Penh and Siem Reap—plus a decade of freelance tech and AI work. That mix gives me a rare view: I speak code, business, and the classroom.
                </p>
                <p>
                  I don't just build apps; I analyze bottlenecks and implement AI-driven solutions that move the needle—e.g. 30% productivity gains for consulting clients. I use inquiry-based learning, gamification, and project-based methods in the classroom, and the same rigor when designing automation (n8n, LLMs, MQL5) and full-stack products.
                </p>
                <p>
                  From IGCSE Business and Global Perspectives to custom Python/React apps and trading bots, my goal is to turn the latest tech and pedagogy into scalable, profitable outcomes—whether in education or industry.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <Code className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Whole Stack</h3>
                <p className="text-sm text-slate-400">From database architecture to pixel-perfect UI, mastering both logic and presentation.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <BrainCircuit className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI Integration</h3>
                <p className="text-sm text-slate-400">Deploying LLMs, building ML pipelines, and automating complex business processes.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <LineChart className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Business Logic</h3>
                <p className="text-sm text-slate-400">Translating market trends and data analytics into actionable software features.</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <Globe className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Global Comms</h3>
                <p className="text-sm text-slate-400">English (native-level), French, Arabic, Polish, Spanish—ready for MENA, Europe, and global teams.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-slate-400 max-w-2xl">AI automation, EdTech, desktop tools, and web platforms—each with a video walkthrough and screenshots.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="group bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full">
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900 rounded-lg">
                      {project.icon}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-900 text-slate-300 rounded-full border border-slate-700">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-1 bg-slate-900 text-emerald-300/80 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-end space-x-3">
                  {project.gallery && project.gallery.length > 0 && (
                    <button 
                      onClick={() => openGallery(project)}
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center text-sm font-medium mr-auto"
                    >
                      <ImageIcon className="w-4 h-4 mr-1" /> Media
                    </button>
                  )}
                  <a href={project.githubLink || "#"} target={project.githubLink ? "_blank" : "_self"} rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center text-sm font-medium">
                    <Github className="w-4 h-4 mr-1" /> Code
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Arsenal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The tools, languages, and frameworks I use to bring ideas to life.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup, index) => (
              <div key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">{skillGroup.category}</h3>
                <ul className="space-y-3">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="flex items-center text-slate-300 text-sm">
                      <ChevronRight className="w-4 h-4 text-emerald-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Languages Sub-section */}
          <div className="mt-20">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-full mb-4 border border-slate-700">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Global Communication Readiness</h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Remote work means borderless collaboration. My multilingual proficiency allows me to integrate seamlessly into global teams, manage emerging nearshoring projects, and communicate effectively across diverse cultural markets.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {languages.map((lang, idx) => (
                <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors text-center group flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{lang.name}</h4>
                    <div className="text-emerald-500 text-sm font-semibold mb-4">{lang.level}</div>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-800 py-2 px-2 rounded-md border border-slate-700/50">
                    <span className="block text-[10px] uppercase tracking-wider mb-1 opacity-70">Target Market</span>
                    {lang.markets}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-4 border border-slate-700">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Certifications: Technical, Teaching & Pastoral</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From Google AI and IBM Applied AI to Advanced TEFL, SEL (CASEL/UNESCO), Mental Health First Aid, and Child Safety—I combine certified tech and pedagogy for roles that need both.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-slate-900 rounded-lg shrink-0">
                    {cert.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{cert.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md mt-2 inline-block ${cert.status.includes('Achieved') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {cert.status}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Experience</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            
            {/* Experience Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-emerald-500 bg-slate-900 text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-emerald-500/20">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <h3 className="font-bold text-white text-lg">IGCSE & AS Business Teacher / Business Instructor</h3>
                <div className="text-sm text-emerald-400 mb-4">ELT Berkeley International School • July 2025 - Present</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Teach IGCSE and AS/A Levels Business; Global Perspectives (Year 8 to AS Level).</li>
                  <li>• Integrate AI/ML for assessments; apply business and finance models to case studies.</li>
                  <li>• Lead community innovation projects blending technology with business management.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500 bg-slate-900 text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Code className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <h3 className="font-bold text-white text-lg">Homeroom & English Teacher / Curriculum Developer</h3>
                <div className="text-sm text-blue-400 mb-4">Footprints International School • Aug 2023 - Jul 2025</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Built EdTech environments for curriculum delivery and analytics; pastoral care and EAL (phonics/reading).</li>
                  <li>• Ran "Student Voice" initiatives; customized AI and productivity tools for departments.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-purple-500 bg-slate-900 text-purple-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <h3 className="font-bold text-white text-lg">Homeroom Teacher (Gr 5–6) / French & ESL Cover</h3>
                <div className="text-sm text-purple-400 mb-4">Golden Gate American School, Invictus International • 2022 - 2023</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Golden Gate: Grade 5 & 6 homeroom; core subjects, social studies, daily SEL.</li>
                  <li>• Invictus: French & ESL cover teacher.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-pink-500 bg-slate-900 text-pink-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <h3 className="font-bold text-white text-lg">Business Consultant (Cambodia)</h3>
                <div className="text-sm text-pink-400 mb-4">Phnom Penh & Siem Reap • 3 years</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Consulted 20+ businesses on optimization and strategy across the two cities.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 5 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-400 bg-slate-900 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Server className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <h3 className="font-bold text-white text-lg">Freelance Full Stack & AI Consultant</h3>
                <div className="text-sm text-slate-400 mb-4">Upwork / Fiverr • 2015 - Present</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Custom apps and media (Python, React, Unity, Adobe); AI consulting with proven ~30% efficiency gains for clients.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-800/50 text-center">
        <div className="container mx-auto px-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Ahmed Jouini. Whole Stack Developer & AI Consultant.
          </p>
        </div>
      </footer>

      {/* AI Assistant Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-bold leading-none">AJ's AI Clone</h3>
                  <span className="text-xs text-emerald-400">Online | Ask me anything</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-slate-950 rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>AJ is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30">
              <form onSubmit={handleSendMessage} className="flex relative items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about my experience, skills..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !inputText.trim()}
                  className="absolute right-2 p-2 bg-emerald-500 text-slate-900 rounded-full hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
            
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {galleryOpen && currentGallery.length > 0 && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">{currentGalleryTitle}</h3>
              <button onClick={() => setGalleryOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full min-h-[400px] aspect-video bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              {currentGallery[currentImageIndex].toLowerCase().endsWith(".mp4") ? (
                <>
                  <video
                    key={currentGallery[currentImageIndex]}
                    ref={galleryVideoRef}
                    src={currentGallery[currentImageIndex]}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => galleryVideoRef.current?.requestFullscreen?.()}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-slate-950/90 text-white text-sm font-medium hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-slate-600"
                  >
                    Fullscreen
                  </button>
                </>
              ) : (
                <>
                  <img 
                    src={toDriveImageUrl(currentGallery[currentImageIndex], true)} 
                    alt={`${currentGalleryTitle} ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                    loading="eager"
                    onError={(e) => {
                      const next = toDriveImageUrl(currentGallery[currentImageIndex], false);
                      if (e.target.src !== next) {
                        e.target.onerror = null;
                        e.target.src = next;
                      } else {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/1200x675/1e293b/64748b?text=Image+unavailable";
                      }
                    }}
                  />
                  <a
                    href={getDriveViewUrl(currentGallery[currentImageIndex])}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-slate-950/90 text-white text-sm font-medium hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-slate-600"
                  >
                    Open full size
                  </a>
                </>
              )}
              {currentGallery.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 p-3 rounded-full bg-slate-950/50 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors backdrop-blur-sm border border-slate-700/50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 p-3 rounded-full bg-slate-950/50 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors backdrop-blur-sm border border-slate-700/50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {currentGallery.length > 1 && (
              <div className="flex space-x-2 mt-6">
                {currentGallery.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-emerald-500' : 'bg-slate-700 hover:bg-slate-500'}`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}