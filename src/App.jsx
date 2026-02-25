import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Server, BrainCircuit, Briefcase, 
  Mail, Phone, MapPin, ChevronRight, Github, ExternalLink, 
  Menu, X, LineChart, Globe, Database, MessageSquare, BookOpen, GraduationCap, Award, ShieldCheck,
  Send, Bot, User, Loader2, Monitor, ImageIcon, ChevronLeft
} from 'lucide-react';

// API key from env (set VITE_GEMINI_API_KEY in Vercel dashboard / .env)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

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

  // Google Drive blocks old /uc?export=view links when embedded. Thumbnail URL works if file is shared "anyone with link".
  const toDriveThumbnail = (url) => {
    const match = typeof url === 'string' && url.includes('drive.google.com') && url.match(/[?&]id=([^&]+)/);
    return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200` : url;
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

  const systemPrompt = `You are the AI clone and professional representative of Ahmed Jouini (AJ). 
Your goal is to answer questions from recruiters, hiring managers, and potential clients as if you are AJ himself. 
Be confident, professional, concise, and enthusiastic. 

BACKGROUND & IDENTITY:
- Name: Ahmed Jouini (AJ)
- Location: Phnom Penh, Cambodia (Open to Remote Worldwide)
- Role: Whole Stack Developer, AI Consultant, Business Strategist, Educator.
- Email: Coldbalouba@gmail.com
- Phone: +855061292510

SKILLS:
- AI & ML: TensorFlow, PyTorch, OpenAI/LLMs, Prompt Engineering, Data Automation.
- Full Stack: Python, JavaScript/TypeScript, React & Next.js, Node.js, Java, SQL/NoSQL.
- Business & Strategy: Agile Management, Data Analysis (Excel/SQL), Tech Consulting, Product Strategy, Market Trading/MQL5.
- Languages: English (Native), Arabic (Fluent), French (Fluent), Spanish (Intermediate), Polish (Intermediate). This makes you perfect for MENA, LATAM, European, and Global markets.

EXPERIENCE:
- Freelance Full Stack & AI Consultant (Upwork/Fiverr, 2015-Present): Engineered custom apps using Python/React/Unity. Provided AI consulting for businesses, integrating automation tools that boosted operational efficiency by 30%.
- ELT Berkeley (July 2025-Present): Business & Tech Educator. Applied complex business/finance models to drive insights.
- Footprints Int'l School (Aug 2023-Jul 2025): Tech Integration Specialist & Teacher. Architected EdTech environments and customized AI tools to optimize productivity.

EDUCATION:
- BA Business Management - London School of International Business (Expected 2026)
- IPGCE (International Postgraduate Certificate in Education) - University of Essex, UK (2024-2025)
- BS Computer Science - Faculty of Science & Technology, Tunisia (2012-2015)

CERTIFICATIONS:
- Google AI Essentials & IBM Applied AI (Achieved 2025)
- ML Specialization via DeepLearning.AI (Achieved 2024)
- Mental Health First Aid & SEL Certifications (2025)
- Currently targeting/consulting range: AWS/Azure/GCP Cloud Certs, Microsoft Azure AI Fundamentals.

PROJECTS:
- BizOps-AI Enterprise Suite: An enterprise-grade AI automation suite designed to streamline business operations, integrate predictive analytics, and optimize organizational workflows.
- MyBot: Headless server and desktop dock for automating web tasks via natural language using Ollama and Gemini vision models.
- SchoAi Platform: Comprehensive AI-driven educational platform for responsible school use, featuring intelligent tutoring and a secure central hub.
- DeskUp: Advanced desktop environment manager and productivity suite for remote workflows.
- TeachHelp AI Generator: AI tool using Gemini API that helps teachers create complete HTML lesson packages in minutes.

RULES:
- Always answer in the first person ("I am...", "My experience...", "I built...").
- Tone: Professional, highly competent, but slightly witty and approachable. Show that AJ is a serious engineer and consultant who is also a fun, dynamic person to work with.
- Keep responses under 3-4 short paragraphs. Recruiters skim.
- If asked something outside your knowledge base, say: "That's a great question! I'd love to discuss that further in an interview. Feel free to email me at Coldbalouba@gmail.com."
- Highlight the intersection of your Business knowledge, Tech skills, and AI expertise.`;

  const fetchWithRetry = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (!apiKey || apiKey.trim() === "") {
      setMessages(prev => [...prev, { role: "ai", text: "The chat isn't configured yet (missing API key). Please add VITE_GEMINI_API_KEY in Vercel → Project → Settings → Environment Variables, then redeploy. Until then, reach out at Coldbalouba@gmail.com!" }]);
      return;
    }

    const userMsg = { role: "user", text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Format history for Gemini
      const chatHistory = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      chatHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const payload = {
        contents: chatHistory,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      // Use gemini-2.0-flash (current model; gemini-1.5-flash IDs were deprecated and return 404)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.error?.code || res.statusText;
        console.error("Gemini API error:", res.status, data);
        setMessages(prev => [...prev, { role: "ai", text: `The AI service returned an error (${res.status}). If you added the API key recently, redeploy the site so the new key is used. Otherwise check your key at Google AI Studio. You can always email me at Coldbalouba@gmail.com!` }]);
        return;
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't get a reply from the model. Try again or email me at Coldbalouba@gmail.com!";
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "Network or server error. If you just set the API key, redeploy the project on Vercel (env vars are applied at build time). Otherwise reach out at Coldbalouba@gmail.com!" }]);
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
      gallery: [
        "https://drive.google.com/uc?export=view&id=16C7Nhz7m0WJHVqUVcfVvdZNr4jVMT2M1",
        "https://drive.google.com/uc?export=view&id=1a4DzcZvrY9EK1bVC6AR2RfrqdsCIhoEN"
      ]
    },
    {
      title: "MyBot - AI Web Automator",
      category: "AI Desktop/Server App",
      description: "A headless server and dock for controlling browsers using natural language. Automates web tasks with vision-capable AI models (Local Ollama or Cloud APIs like Gemini). Features a FastAPI server for VPS hosting.",
      tech: ["Python", "FastAPI", "Ollama", "AI Vision", "Chromium"],
      icon: <img src="/image_439cb4.jpg" alt="MyBot Logo" className="w-7 h-7 rounded-md object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=MB&background=0f172a&color=34d399"; }} />,
      githubLink: "https://github.com/Coldbalouba/MyBot.git",
      gallery: [
        "https://drive.google.com/uc?export=view&id=1WTltQgdBRm9qi8EC3r4cNEwcWrx_Xyof",
        "https://drive.google.com/uc?export=view&id=1VTwVnFkeOGsLuZlj0vmCcioLxFN9GLl4"
      ]
    },
    {
      title: "SchoAi Platform",
      category: "EdTech & AI System",
      description: "A comprehensive AI-driven educational platform designed for responsible use in schools. It features intelligent tutoring, automated administrative tools, and a centralized hub to connect students, teachers, and stakeholders securely.",
      tech: ["React", "Python", "Node.js", "AI Integration", "PostgreSQL"],
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
      githubLink: "https://github.com/Coldbalouba/SchoAi",
      gallery: [
        "https://drive.google.com/uc?export=view&id=1cUW9yf6A538Yrla7HBwTDsplVEOiIpDN",
        "https://drive.google.com/uc?export=view&id=1OXsP6fCntOmyLua0S2InZ9d8YQgVRqKo"
      ]
    },
    {
      title: "DeskUp - Workspace Automator",
      category: "Desktop Productivity App",
      description: "An advanced desktop environment manager and productivity suite. Integrates system-level automation, smart task prioritization, and cross-platform syncing to optimize daily workflows for remote professionals.",
      tech: ["Electron", "React", "TypeScript", "Node.js", "System APIs"],
      icon: <Monitor className="w-6 h-6 text-indigo-400" />,
      githubLink: "https://github.com/Coldbalouba/DeskUp.git",
      gallery: [
        "https://drive.google.com/uc?export=view&id=1evnxNNaPwcPm150YkqwfV3UAUBKpUFGl",
        "https://drive.google.com/uc?export=view&id=1wP0LW9DKCasZjckUyDndLJIQY8d04-vA"
      ]
    },
  ];

  const skills = [
    { category: "AI & Machine Learning", items: ["TensorFlow", "PyTorch", "OpenAI/LLMs", "Prompt Engineering", "Data Automation"] },
    { category: "Full Stack Development", items: ["Python", "JavaScript/TypeScript", "React & Next.js", "Node.js", "Java", "SQL/NoSQL"] },
    { category: "Business & Strategy", items: ["Agile Management", "Data Analysis (Excel/SQL)", "Tech Consulting", "Product Strategy", "Market Trading/MQL5"] },
    { category: "Design & Tools", items: ["Figma", "Adobe Suite", "Unity", "Git/GitHub", "Cloud Deployment"] }
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
              Hi, I'm Ahmed Jouini (AJ). I am a Whole Stack Developer, AI Consultant, and Business Strategist. I build software that automates workflows, optimizes data decisions, and elevates business productivity.
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
                  With a unique foundation encompassing a BS in Computer Science, ongoing studies in Business Management, and over 5 years of professional experience across EdTech and freelance consulting, I bring a holistic view to problem-solving.
                </p>
                <p>
                  I don't just write code; I analyze business bottlenecks and implement AI-driven solutions that yield tangible results—like increasing workflow efficiency by 30% for my consulting clients. 
                </p>
                <p>
                  Whether it's building a full-stack web application from scratch, deploying a localized LLM server, or integrating intelligent automation into existing business systems, my goal is to leverage the latest breakthroughs to create scalable, profitable tech.
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
                <p className="text-sm text-slate-400">Multilingual (English, French, Arabic) with extensive cross-cultural leadership experience.</p>
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
            <p className="text-slate-400 max-w-2xl">A selection of my recent work spanning AI infrastructure, web platforms, and mobile applications.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Certifications That Signal Consulting + Technical Range</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A blend of achieved technical certifications and targeted enterprise-grade benchmarks that validate my expertise in implementing scalable tech and AI solutions within organizations.
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">Freelance Full Stack & AI Consultant</h3>
                </div>
                <div className="text-sm text-emerald-400 mb-4">Upwork / Fiverr • 2015 - Present</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Engineered custom applications and media platforms using Python, React, and Unity.</li>
                  <li>• Provided AI consulting for businesses, integrating automation tools that boosted operational efficiency by 30%.</li>
                  <li>• Managed end-to-end agile project lifecycles, ensuring timely and under-budget delivery for international clients.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500 bg-slate-900 text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Server className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">Business & Tech Educator</h3>
                </div>
                <div className="text-sm text-blue-400 mb-4">ELT Berkeley • July 2025 - Present</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Applying complex business and finance models to drive data-driven insights.</li>
                  <li>• Integrating AI and Machine Learning tools for automated assessments and administrative efficiency.</li>
                  <li>• Leading community innovation projects, merging technology with practical business management strategies.</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-purple-500 bg-slate-900 text-purple-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Code className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">Tech Integration Specialist & Teacher</h3>
                </div>
                <div className="text-sm text-purple-400 mb-4">Footprints Int'l School • Aug 2023 - Jul 2025</div>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>• Architected EdTech environments for enhanced curriculum delivery and data analytics.</li>
                  <li>• Customized financial and AI tools to optimize productivity across teaching departments.</li>
                  <li>• Collaborated with administrative stakeholders to implement tech-driven business programs.</li>
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

            <div className="relative w-full aspect-video bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              <img 
                src={toDriveThumbnail(currentGallery[currentImageIndex])} 
                alt={`${currentGalleryTitle} Screenshot ${currentImageIndex + 1}`} 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450/1e293b/64748b?text=Image+not+available"; }}
              />
              
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