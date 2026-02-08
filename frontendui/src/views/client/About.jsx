import { 
    Code, 
    Target, 
    MapPin, 
    Terminal,
    Cpu,
    BookOpen,
    Github,
    Linkedin,
    Facebook,
} from "lucide-react";

export default function About() {
    return (
        <div className="relative min-h-screen pb-10 font-sans scroll-smooth">
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 max-w-6xl">
                
                {/* 🟢 BENTO GRID LAYOUT (Glass) */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                    
                    {/* BOX 1: HERO */}
                    <div className="md:col-span-2 md:row-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50 flex flex-col justify-between overflow-hidden relative group">
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-4">HELLO WORLD</span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">I'm Rithisak.</h1>
                            <p className="text-lg text-gray-600 max-w-md">
                                A 20-year-old tech enthusiast based in <span className="text-gray-900 font-bold">Phnom Penh</span>. 
                                I don't just write code; I build solutions.
                            </p>
                        </div>
                        <Terminal className="absolute -bottom-10 -right-10 text-gray-100 w-64 h-64 group-hover:text-amber-50 group-hover:rotate-12 transition-all duration-500" />
                        <div className="relative z-10 mt-6 flex gap-3">
                            <a href="https://github.com/rithisak165" className="bg-gray-900 text-white p-3 rounded-full hover:bg-black transition"><Github size={20}/></a>
                            <a href="https://www.facebook.com/share/174Xr2kMZS/?mibextid=wwXIfr" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"><Facebook size={20}/></a>
                        </div>
                    </div>

                    {/* BOX 2: EDUCATION */}
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 flex items-center gap-6 hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0"><BookOpen size={32} /></div>
                        <div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Current Studies</h3>
                            <h2 className="text-2xl font-bold text-gray-900">Norton University</h2>
                            <p className="text-gray-500 text-sm mt-1">Pursuing Bachelor's Degree</p>
                        </div>
                    </div>

                    {/* BOX 3: SKILLS */}
                    <div className="md:col-span-1 bg-amber-500 text-white p-6 rounded-3xl shadow-lg border border-amber-400/50 flex flex-col justify-center relative overflow-hidden">
                        <Cpu className="mb-4 text-amber-200" size={40} />
                        <h2 className="text-2xl font-bold relative z-10">Etec Center</h2>
                        <p className="text-amber-100 relative z-10">Technical Training Ground</p>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -mr-5 -mt-5"></div>
                    </div>

                    {/* BOX 4: INFO */}
                    <div className="md:col-span-1 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 mb-3 overflow-hidden border-2 border-white shadow-sm">
                             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" alt="Rithisak" />
                        </div>
                        <h3 className="font-bold text-gray-900">20 Years Old</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1"><MapPin size={12} /> Cambodia</div>
                    </div>

                    {/* BOX 5: GOAL */}
                    <div className="md:col-span-2 bg-gray-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-amber-400">
                                <Target size={20} />
                                <span className="font-bold tracking-widest text-xs uppercase">The Goal</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Full Stack Developer</h2>
                            <p className="text-gray-400 text-sm max-w-xs">Bridging the gap between Front-end beauty and Back-end logic.</p>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end max-w-[200px]">
                            {['React', 'Node', 'Laravel', 'SQL', 'Git'].map(tech => (
                                <span key={tech} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono border border-white/10">{tech}</span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}