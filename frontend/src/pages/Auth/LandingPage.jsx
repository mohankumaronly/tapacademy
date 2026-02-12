import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Camera, 
  ArrowRight, 
  Linkedin,
  Github,
  Zap,
  Star,
  Sparkles,
  Rocket,
  FileText,
  Briefcase,
  Database,
  Layers,
  Code2,
  Share2,
  Globe,
  Heart,
  Play
} from 'lucide-react';

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// ============ LAYOUT COMPONENT ============
const Container = ({ children, className = '' }) => (
  <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Section = ({ children, className = '', bgWhite = false }) => (
  <section className={`relative z-10 ${bgWhite ? 'bg-white' : ''} ${className}`}>
    <Container>{children}</Container>
  </section>
);

// ============ CONSTANTS ============
const BRAND = {
  name: 'TAP ACADEMY',
  tagline: 'Experiences',
  color: '#0a66c2',
  icon: Zap
};

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/mohan-kumar-3151a1308',
  github: 'https://github.com/mohankumaronly'
};

const CREATOR = {
  name: 'Mohan Kumaronly',
  role: 'Full Stack Developer',
  initials: 'MK'
};

// ============ COMPONENTS ============
const BackgroundElements = () => (
  <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
  </div>
);

const BrandBar = () => (
  <Container className="relative z-50 py-4 sm:py-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 sm:gap-3"
      >
        <div className="bg-[#0a66c2] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg shadow-blue-200">
          <Zap className="text-white w-5 h-5 sm:w-6 sm:h-6 fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {BRAND.name}
          </span>
          <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-[#0a66c2] uppercase leading-none">
            {BRAND.tagline}
          </span>
        </div>
      </motion.div>

      {/* Open Source Project Badge */}
      <motion.a
        href="https://github.com/mohankumaronly/tapacademy"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {/* GitHub Icon */}
        <Github size={16} className="text-white" />
        
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold flex items-center gap-1">
            Get Full Stack Project
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[8px] opacity-80">
            Open Source • Free • Tap Academy
          </span>
        </div>

        {/* Live Indicator */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
      </motion.a>
    </div>
  </Container>
);

const HeroSection = ({ onGetStarted }) => {
  const activityFeed = [
    { user: 'Priya S.', avatar: 'P', activity: 'completed Spring Boot Microservices', time: '2m ago', color: 'from-blue-500 to-[#0a66c2]' },
    { user: 'Rahul M.', avatar: 'R', activity: 'shared React portfolio', time: '15m ago', color: 'from-purple-500 to-pink-500' },
    { user: 'Anjali K.', avatar: 'A', activity: 'got hired at Google', time: '1h ago', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <section className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-[#0a66c2]/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left space-y-5 sm:space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a66c2]/10 to-blue-400/10 backdrop-blur-md border border-[#0a66c2]/20 px-3 py-1.5 rounded-full">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 bg-[#0a66c2] rounded-full" />
              <span className="text-[10px] sm:text-xs font-bold text-[#0a66c2] uppercase tracking-wider">Tap Academy Exclusive</span>
              <Sparkles size={12} className="text-[#0a66c2]" />
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.2] tracking-tight">
              <span className="text-slate-900">Connect.</span><br />
              <span className="text-slate-900">Share.</span><br />
              <motion.span className="relative inline-block mt-1">
                <span className="relative z-10 bg-gradient-to-r from-[#0a66c2] to-blue-500 bg-clip-text text-transparent italic">Get Hired.</span>
                <motion.div className="absolute -bottom-1.5 left-0 w-full h-2 bg-[#0a66c2]/20 rounded-full" 
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
              </motion.span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The exclusive social hub where <span className="font-bold text-[#0a66c2]">Tap Academy students</span>{' '}
              transform their learning journey into career opportunities. Document your progress, connect with peers, and get noticed by top employers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center lg:items-start gap-3 pt-3">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="group relative w-full sm:w-auto bg-gradient-to-r from-[#0a66c2] to-blue-500 text-white text-sm sm:text-base font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-200/50 hover:shadow-2xl transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Join the Intern Network
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={16} />
                  </motion.span>
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0a66c2]" initial={{ x: '100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-slate-700 text-sm sm:text-base font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-lg transition-all"
              >
                <Play size={16} /> See Success Stories
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="User" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold shadow-md">+2.5k</div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">2,500+ Active Interns</p>
                <p className="text-[10px] text-slate-500">Joined this month</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }} className="relative bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xl">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a66c2] to-blue-500 flex items-center justify-center">
                      <Zap className="text-white w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">Tap Academy Feed</h3>
                      <p className="text-[10px] text-slate-400">Live Activity</p>
                    </div>
                  </div>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                </div>

                <div className="space-y-3">
                  {activityFeed.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (idx * 0.1) }}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xs`}>
                        {item.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">{item.user}</span>
                          <span className="text-[8px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-600">{item.activity}</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={10} className="text-red-400" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button className="text-[10px] font-bold text-[#0a66c2] hover:text-blue-600 flex items-center gap-1 group">
                    View all activity
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div animate={{ rotate: [0, 5, 0], y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-5 -right-5 bg-white rounded-xl border-2 border-slate-200 p-3 shadow-xl w-36">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Code2 size={12} className="text-[#0a66c2]" />
                  <span className="text-[8px] font-bold text-slate-400">JAVA</span>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full mb-1">
                  <div className="w-3/4 h-full bg-[#0a66c2] rounded-full" />
                </div>
                <p className="text-[7px] text-slate-500">75% completed</p>
              </motion.div>

              <motion.div animate={{ rotate: [0, -5, 0], y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity }}
                className="absolute -bottom-5 -left-5 bg-white rounded-xl border-2 border-slate-200 p-3 shadow-xl w-36">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Globe size={12} className="text-blue-500" />
                  <span className="text-[8px] font-bold text-slate-400">MERN</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-slate-400" />
                  <span className="text-[8px] text-slate-600">24 peers online</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center">
          <div className="w-1 h-1.5 bg-slate-400 rounded-full mt-1.5" />
        </div>
      </motion.div>
    </section>
  );
};

const ConnectivityCard = ({ feature }) => (
  <motion.div whileHover={{ x: 8 }} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-md transition-all">
    <div className="shrink-0 bg-blue-50 p-1.5 sm:p-2 rounded-lg">{feature.icon}</div>
    <div className="flex-1">
      <h4 className="font-bold text-base sm:text-lg text-slate-800 mb-0.5">{feature.title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
    </div>
  </motion.div>
);

const NetworkVisual = () => (
  <div className="relative max-w-md mx-auto lg:mx-0">
    <div className="absolute inset-0 bg-[#0a66c2]/10 blur-[100px] -z-10 rounded-[2.5rem]" />
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-xl">
      
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 overflow-hidden ring-2 ring-[#0a66c2]/20">
            <img src="https://i.pravatar.cc/150?u=tech" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h5 className="font-black text-sm sm:text-base text-slate-900">Mohan Kumaronly</h5>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Java Fullstack Intern</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.1 }} className="bg-blue-50 p-1.5 sm:p-2 rounded-lg cursor-pointer text-[#0a66c2]">
          <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
        </motion.div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-600 mb-2 sm:mb-3 leading-relaxed">
            "Just finished building my first Microservice using Spring Boot at Tap Academy! Check out my logic below."
          </p>
          <div className="aspect-video bg-slate-200 rounded-lg sm:rounded-xl overflow-hidden border border-slate-300 relative">
            <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2062" className="object-cover w-full h-full grayscale opacity-70" alt="Code" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg">
                <Code2 className="text-[#0a66c2]" size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-1 sm:px-2">
          <div className="flex -space-x-2 sm:-space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Peer" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-[#0a66c2] text-white flex items-center justify-center text-[8px] sm:text-[9px] lg:text-[10px] font-bold shadow-sm">+12</div>
          </div>
          <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peer Endorsements</span>
        </div>
        
        <button className="w-full bg-[#0a66c2] text-white text-xs sm:text-sm font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl mt-2 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-100 hover:bg-[#0a66c2]/90 transition-colors">
          <Briefcase size={14} className="sm:w-4 sm:h-4" /> Showcase in Resume
        </button>
      </div>
    </div>
  </div>
);

const ConnectivitySection = () => {
  const features = [
    { icon: <Globe className="text-[#0a66c2]" size={18} />, title: "Network with Peer Interns", desc: "Follow fellow Tap Academy students. See what they're building in their MERN or Java Fullstack modules." },
    { icon: <Share2 className="text-[#0a66c2]" size={18} />, title: "Share Daily Progress", desc: "Don't just code in silence. Post snippets of your Spring Boot APIs or React components to get community feedback." },
    { icon: <FileText className="text-[#0a66c2]" size={18} />, title: "Automatic Resume Building", desc: "Our platform aggregates your documented learning into a job-ready resume highlighting actual project history." },
    { icon: <Briefcase className="text-[#0a66c2]" size={18} />, title: "Get Noticed by Partners", desc: "Showcase your database schemas and code logic directly to hiring partners associated with Tap Academy." }
  ];

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 leading-tight text-slate-900">
            Turn Your Learning into <br className="hidden sm:block" />
            <span className="text-[#0a66c2]">Proof of Work.</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {features.map((feature, idx) => (
              <ConnectivityCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <NetworkVisual />
        </div>
      </motion.div>
    </Section>
  );
};

const JourneyStepCard = ({ step }) => (
  <motion.div variants={fadeInUp} className="bg-[#f4f2ee] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-slate-200 relative group hover:bg-white hover:shadow-xl transition-all h-full">
    <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
      {step.step}
    </div>
    <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 text-[#0a66c2] shadow-sm border border-slate-100">
      {step.icon}
    </div>
    <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-slate-900">{step.title}</h3>
    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
  </motion.div>
);

const JourneySteps = () => {
  const steps = [
    { icon: <Camera size={24} />, step: "1", title: "Document Tech Journey", desc: "Take snapshots of your progress as you master MERN or Java Fullstack at Tap Academy." },
    { icon: <Share2 size={24} />, step: "2", title: "Network with Peers", desc: "Connect with fellow students, share solutions, and build your professional community." },
    { icon: <Rocket size={24} />, step: "3", title: "Get Noticed by Recruiters", desc: "Let your live portfolio do the talking. Turn your intern activity into a job-ready profile." }
  ];

  return (
    <Section bgWhite className="py-12 sm:py-16 lg:py-20 border-y border-slate-200">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 text-slate-900">Connect. Grow. Succeed.</h2>
        <div className="h-1 w-16 sm:w-20 bg-[#0a66c2] mx-auto rounded-full" />
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 font-medium italic">
          Learning happens at the Academy. Success happens here.
        </p>
      </div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {steps.map((step, idx) => (
          <JourneyStepCard key={idx} step={step} />
        ))}
      </motion.div>
    </Section>
  );
};

const CTASection = ({ onGetStarted }) => {
  const stats = [
    { icon: <Briefcase size={16} className="text-green-600" />, value: "85%", label: "Hire Rate", bgColor: "bg-green-100" },
    { icon: <Users size={16} className="text-blue-600" />, value: "500+", label: "Companies", bgColor: "bg-blue-100" },
    { icon: <Star size={16} className="text-purple-600" />, value: "4.9/5", label: "Rating", bgColor: "bg-purple-100" }
  ];

  const placements = [
    { name: 'Priya S.', role: 'Full Stack Developer', company: 'Amazon', delay: 0.1 },
    { name: 'Rahul M.', role: 'Java Backend', company: 'Microsoft', delay: 0.2 },
    { name: 'Anjali K.', role: 'MERN Stack', company: 'Google', delay: 0.3 }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#0a66c2] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
      </div>
      
      <Container>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <motion.div variants={fadeInUp} className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0a66c2]/10 px-4 py-2 rounded-full">
              <Sparkles size={16} className="text-[#0a66c2]" />
              <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider">Limited Access</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-900">
              Ready to Launch{' '}
              <span className="text-[#0a66c2] relative inline-block">
                Your Career?
                <motion.div className="absolute -bottom-2 left-0 w-full h-2 bg-[#0a66c2]/20 rounded-full"
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Join <span className="font-bold text-[#0a66c2]">2,500+</span> Tap Academy interns who've already transformed their learning into dream jobs at top tech companies.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center lg:items-start gap-4 pt-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGetStarted}
                className="group relative bg-[#0a66c2] text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200 hover:shadow-2xl transition-all overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Access Intern Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#0a66c2]" 
                  initial={{ x: '100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
              </motion.button>
              
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full" />
                No credit card required • Free for Tap Academy students
              </p>
            </div>
          </motion.div>
          
          {/* Right Content */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/20 to-blue-400/20 rounded-3xl blur-2xl transform rotate-6" />
            
            <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900">Recent Placements</h4>
                <span className="text-xs text-[#0a66c2] font-bold bg-blue-50 px-3 py-1 rounded-full">This Month</span>
              </div>
              
              <div className="space-y-4">
                {placements.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: item.delay }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a66c2] to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.role} • {item.company}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 rounded-full">
                      <span className="text-[10px] font-bold text-green-700">Hired</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="my-6 border-t border-slate-200" />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Trusted by</p>
                <div className="flex items-center gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-6 bg-slate-200 rounded opacity-50" />
                  ))}
                </div>
              </div>
            </div>
            
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
              <span className="text-xs font-bold flex items-center gap-1">
                <Zap size={12} className="fill-white" /> Limited Time
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

const Footer = () => {
  const quickLinks = [
    'About Tap Academy',
    'Internship Programs',
    'Success Stories',
    'Hiring Partners',
    'FAQs'
  ];

  return (
    <footer className="relative z-10 bg-white border-t border-slate-200">
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-[#0a66c2] p-2 rounded-xl shadow-md">
                <Zap className="text-white w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{BRAND.name}</span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#0a66c2] uppercase leading-none">{BRAND.tagline}</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              The exclusive professional network built for Tap Academy students. 
              Connect with peers, showcase your projects, and launch your tech career.
            </p>
            
            {/* Creator Credit */}
            <div className="pt-4">
              <p className="text-xs text-slate-400 font-medium mb-3">Created by</p>
              <div className="flex items-center gap-4">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a66c2] to-blue-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <span className="text-white font-black text-sm">{CREATOR.initials}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#0a66c2] transition-colors">{CREATOR.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{CREATOR.role}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#0a66c2] font-medium transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Connect With Creator</h4>
            
            <div className="space-y-4">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#f4f2ee] rounded-xl hover:bg-[#0a66c2]/5 transition-all group border border-slate-200">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-[#0a66c2] transition-colors">
                  <Linkedin className="w-4 h-4 text-[#0a66c2] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-[#0a66c2] transition-colors">LinkedIn Profile</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[200px]">/in/mohan-kumar-3151a1308</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-[#0a66c2] group-hover:translate-x-1 transition-all" />
              </a>

              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#f4f2ee] rounded-xl hover:bg-slate-800/5 transition-all group border border-slate-200">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-slate-800 transition-colors">
                  <Github className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">GitHub Profile</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[200px]">/mohankumaronly</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] sm:text-xs text-slate-400 order-2 sm:order-1">
            © 2026 Tap Academy Experiences. All rights reserved.
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5">
              Built with 
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} className="inline-flex">
                <Heart size={12} className="text-red-500 fill-red-500" />
              </motion.span>
              by
            </span>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
              className="text-[10px] sm:text-xs font-bold text-slate-700 hover:text-[#0a66c2] transition-colors flex items-center gap-1">
              {CREATOR.name}
              <motion.span whileHover={{ x: 2 }} className="inline-flex">
                <ArrowRight size={10} />
              </motion.span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// ============ MAIN COMPONENT ============
const LandingPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth/register');

  return (
    <div className="min-h-screen bg-[#f4f2ee] font-sans text-slate-900 overflow-x-hidden relative">
      <BackgroundElements />
      <BrandBar />
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <HeroSection onGetStarted={handleGetStarted} />
        <ConnectivitySection />
        <JourneySteps />
        <CTASection onGetStarted={handleGetStarted} />
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;