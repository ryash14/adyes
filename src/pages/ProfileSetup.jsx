import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, Briefcase, Rocket, X, Code, MessageCircle, Link as LinkIcon, CheckCircle2, ArrowRight, ArrowLeft, Users } from 'lucide-react';
import AuthLayout from '../components/public/AuthLayout';
import Badge from '../components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_TITLES = [
 { title: 'Choose your path', lead: 'Select a role that best describes your current focus.' },
 { title: 'Tell us about your work', lead: 'Provide context that helps others understand your background.' },
 { title: 'Add your links', lead: 'Link your profiles to build trust with collaborators.' },
];

const stepVariants = {
 enter: (direction) => ({
 x: direction > 0 ? 80 : -80,
 opacity: 0,
 }),
 center: {
 x: 0,
 opacity: 1,
 },
 exit: (direction) => ({
 x: direction > 0 ? -80 : 80,
 opacity: 0,
 }),
};

export default function ProfileSetup() {
 const [step, setStep] = useState(1);
 const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [skillInput, setSkillInput] = useState('');
 const [showSkillDropdown, setShowSkillDropdown] = useState(false);
 const [highlightedIndex, setHighlightedIndex] = useState(0);
 const inputRef = useRef(null);
 
 const PREDEFINED_SKILLS = [
"React","Node.js","Python","TypeScript","JavaScript","Next.js","Tailwind CSS",
"UI/UX Design","Figma","Firebase","Supabase","MongoDB","PostgreSQL",
"GraphQL","Docker","AWS","Machine Learning","Data Science","Go","Rust",
"C++","Java","Spring Boot","DevOps","Marketing","Product Management",
"SEO","Copywriting","Sales","Angular","Vue.js","Svelte","React Native","Flutter",
"iOS","Android","Solidity","Web3","Blockchain","Smart Contracts",
"C#",".NET","PHP","Laravel","Ruby","Ruby on Rails","Django","Flask",
"FastAPI","Express.js","NestJS","Vuex","Redux","Zustand","Apollo",
"Redis","Elasticsearch","Cassandra","MySQL","SQLite",
"Kubernetes","Terraform","Ansible","Jenkins","GitHub Actions",
"Azure","Google Cloud","DigitalOcean","Vercel","Netlify","Heroku",
"Framer","Adobe XD","Sketch","InVision","Photoshop","Illustrator",
"3D Modeling","Blender","Unity","Unreal Engine","Game Development",
"Cybersecurity","Penetration Testing","Cryptography","Ethical Hacking",
"Computer Vision","NLP","Deep Learning","TensorFlow","PyTorch",
"Data Engineering","Big Data","Spark","Hadoop","Kafka",
"Business Development","Growth Hacking","Social Media Marketing","Content Creation",
"Video Editing","Premiere Pro","After Effects","Final Cut Pro"
 ];

 const [formData, setFormData] = useState({
 role: '',
 college: '',
 skills: [],
 bio: '',
 github: '',
 linkedin: '',
 twitter: '',
 portfolio: '',
 });

 const filteredSkills = PREDEFINED_SKILLS.filter(s => 
 s.toLowerCase().includes(skillInput.toLowerCase()) && 
 !formData.skills.includes(s)
 );

 const { completeProfile, user } = useAuth();
 const navigate = useNavigate();

 const canProceed = () => {
 if (step === 1) return !!formData.role;
 if (step === 2) return true; // Skills and bio are optional
 return true;
 };

 const handleNext = () => {
 if (!canProceed()) return;
 setDirection(1);
 setStep((s) => Math.min(s + 1, 3));
 };

 const handleBack = () => {
 setDirection(-1);
 setStep((s) => Math.max(s - 1, 1));
 };

 const handleSkillKeyDown = (e) => {
 if (!showSkillDropdown) return;

 if (e.key === 'ArrowDown') {
 e.preventDefault();
 setHighlightedIndex(prev => Math.min(prev + 1, filteredSkills.length - 1));
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 setHighlightedIndex(prev => Math.max(prev - 1, 0));
 } else if (e.key === 'Enter') {
 e.preventDefault();
 if (filteredSkills.length > 0) {
 addSkill(filteredSkills[highlightedIndex] || filteredSkills[0]);
 } else if (skillInput.trim()) {
 addSkill(skillInput.trim());
 }
 } else if (e.key === 'Escape') {
 setShowSkillDropdown(false);
 }
 };

 const addSkill = (skill) => {
 if (!formData.skills.includes(skill) && formData.skills.length < 10) {
 setFormData({ ...formData, skills: [...formData.skills, skill] });
 setSkillInput('');
 setShowSkillDropdown(false);
 setHighlightedIndex(0);
 }
 };

 const removeSkill = (skillToRemove) => {
 setFormData({
 ...formData,
 skills: formData.skills.filter((s) => s !== skillToRemove),
 });
 };

 const handleSubmit = async () => {
 setLoading(true);
 setError('');

 const finalPayload = {
 ...formData,
 github: formData.github ? `https://github.com/${formData.github.replace('https://github.com/', '')}` : '',
 linkedin: formData.linkedin ? `https://linkedin.com/in/${formData.linkedin.replace('https://linkedin.com/in/', '')}` : '',
 twitter: formData.twitter ? `https://twitter.com/${formData.twitter.replace('https://twitter.com/', '')}` : '',
 };

 const result = await completeProfile(finalPayload);
 setLoading(false);
 if (!result.error) {
 navigate('/dashboard');
 } else {
 setError(result.error);
 }
 };

 const handleSkip = async () => {
 setLoading(true);
 setError('');
 const finalPayload = {
 ...formData,
 role: formData.role || 'student',
 github: '',
 linkedin: '',
 twitter: '',
 portfolio: '',
 };
 const result = await completeProfile(finalPayload);
 setLoading(false);
 if (!result.error) {
 navigate('/dashboard');
 } else {
 setError(result.error);
 }
 };

 const footerContent = (
 <div className="flex flex-col items-center gap-4 mt-2">
 {error && <span className="text-red-500 dark:text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg inline-block">{error}</span>}
 <button 
 type="button"
 onClick={handleSkip}
 className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
 >
 Skip for now
 </button>
 </div>
 );

 return (
 <AuthLayout
 eyebrow="Profile setup"
 title={STEP_TITLES[step - 1].title}
 lead={STEP_TITLES[step - 1].lead}
 progress={{ current: step, total: 3 }}
 progressLabel="Onboarding"
 wide={true}
 footer={footerContent}
 >
 {/* Step indicators */}
 <div className="flex items-center justify-center gap-2 mb-8">
 {[1, 2, 3].map((s) => (
 <div key={s} className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300",
          s < step ? "bg-white text-black" :
          s === step ? "bg-white text-black ring-4 ring-white/20" :
          "bg-[#1c1c1c] text-[#888888] border-transparent"
        )}>
          {s < step ? <CheckCircle2 size={16} /> : s}
        </div>
        {s < 3 && (
          <div className={cn(
            "w-12 h-0.5 rounded-full transition-all duration-500",
            s < step ? "bg-white" : "bg-[#1c1c1c]"
          )} />
 )}
 </div>
 ))}
 </div>

 <AnimatePresence mode="wait" custom={direction}>
 <motion.div
 key={step}
 custom={direction}
 variants={stepVariants}
 initial="enter"
 animate="center"
 exit="exit"
 transition={{ duration: 0.3, ease: "easeInOut" }}
 className="flex flex-col gap-8"
 >
  {step === 1 && (
  <div className="flex flex-col gap-3 pt-2">
  {[
  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Learning & building' },
  { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Working in industry' },
  { id: 'entrepreneur', label: 'Entrepreneur', icon: Rocket, desc: 'Building a startup' },
  { id: 'mentor', label: 'Mentor', icon: Users, desc: 'Guiding others' },
  ].map((role) => (
  <button
  key={role.id}
  type="button"
  className={cn(
    "flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
    formData.role === role.id
    ? "border-white bg-white/10 shadow-sm"
    : "border-transparent bg-[#1c1c1c] hover:border-white/20 hover:bg-white/5"
  )}
  onClick={() => setFormData({ ...formData, role: role.id })}
  >
  <div className={cn(
    "h-12 w-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
    formData.role === role.id ? "bg-white text-black" : "bg-[#222222] text-[#888888]"
  )}>
  <role.icon size={24} strokeWidth={1.5} />
  </div>
  <div>
    <div className={cn(
      "font-semibold text-[15px]",
      formData.role === role.id ? "text-white" : "text-[#dddddd]"
    )}>
      {role.label}
    </div>
    <div className="text-[13px] text-zinc-400 mt-0.5">{role.desc}</div>
  </div>
  </button>
  ))}
  </div>
  )}

 {step === 2 && (
  <div className="flex flex-col gap-8">
  <label className="flex flex-col gap-2 relative">
  <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">College or Organization</span>
  <Input
  type="text"
  placeholder="e.g. Stanford University"
  value={formData.college}
  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
  className="h-11 bg-[#1c1c1c] border-transparent text-white placeholder:text-[#666666] focus-visible:ring-1 focus-visible:ring-white rounded-xl text-[14px] px-4"
  />
  </label>

  <div className="flex flex-col gap-2 relative">
  <div className="flex items-center justify-between">
  <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Skills and Interests</span>
  {formData.skills.length > 0 && (
  <span className="text-[10px] font-bold text-[#888888]">{formData.skills.length}/10</span>
  )}
  </div>
  <div 
  className="flex flex-wrap items-center gap-2 p-2 min-h-[44px] rounded-xl bg-[#1c1c1c] focus-within:ring-1 focus-within:ring-white transition-all cursor-text"
  onClick={() => inputRef.current?.focus()}
  >
 <AnimatePresence>
 {formData.skills.map((skill) => (
  <motion.div
  key={skill}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ duration: 0.15 }}
  >
  <Badge className="flex items-center gap-1.5 pr-1.5 py-1 text-xs bg-[#2a2a2a] border-transparent text-white rounded-md px-2 hover:bg-[#333333]">
  {skill}
  <button type="button" className="rounded-full hover:bg-white/10 p-1 transition-colors" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}>
  <X size={12} strokeWidth={2.5} className="text-[#888888] hover:text-white" />
  </button>
  </Badge>
  </motion.div>
 ))}
 </AnimatePresence>
  <div className="flex-1 min-w-[120px] px-2">
  <input
  ref={inputRef}
  type="text"
  className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder:text-[#666666]"
  placeholder={formData.skills.length === 0 ?"Search skills..." :""}
 value={skillInput}
 onChange={(e) => {
 setSkillInput(e.target.value);
 setShowSkillDropdown(true);
 setHighlightedIndex(0);
 }}
 onFocus={() => setShowSkillDropdown(true)}
 onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
 onKeyDown={handleSkillKeyDown}
 />
 </div>
 </div>

 {showSkillDropdown && (skillInput.trim() || filteredSkills.length > 0) && (
 <div className="absolute top-full left-0 mt-1 w-full max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50 p-1 flex flex-col gap-1">
 {filteredSkills.length > 0 ? (
 filteredSkills.slice(0, 15).map((skill, index) => (
 <button
 key={skill}
 type="button"
 className={cn(
"text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
 highlightedIndex === index 
 ?"bg-accent/20 text-accent font-medium" 
 :"hover:bg-accent/10 hover:text-accent"
 )}
 onMouseEnter={() => setHighlightedIndex(index)}
 onMouseDown={(e) => {
 e.preventDefault();
 addSkill(skill);
 }}
 >
 {skill}
 </button>
 ))
 ) : (
 skillInput.trim() && (
 <button
 type="button"
 className="text-left px-3 py-2.5 rounded-lg text-sm bg-accent/20 text-accent font-medium transition-colors"
 onMouseDown={(e) => {
 e.preventDefault();
 addSkill(skillInput.trim());
 }}
 >
 Add "{skillInput.trim()}"
 </button>
 )
 )}
 </div>
 )}
 </div>

  <label className="flex flex-col gap-2">
  <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Bio</span>
  <textarea
  className="flex w-full rounded-xl bg-[#1c1c1c] px-4 py-3 text-[14px] text-white transition-all duration-200 placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white min-h-[120px] resize-none"
  placeholder="Briefly describe what you're building, your background, or what kind of co-founders you're looking for."
  value={formData.bio}
  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
  />
  </label>
 </div>
 )}

  {step === 3 && (
  <div className="flex flex-col gap-6">
  <div className="flex flex-col gap-2">
  <label className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-2">
  <Code size={16} /> GitHub Username
  </label>
  <div className="flex h-11 w-full rounded-xl bg-[#1c1c1c] focus-within:ring-1 focus-within:ring-white overflow-hidden transition-all">
  <div className="px-4 flex items-center border-r border-[#2a2a2a] bg-[#111111] text-[#888888] text-[14px]">
  github.com/
  </div>
  <input
  type="text"
  className="flex-1 bg-transparent px-4 outline-none text-[14px] text-white"
  placeholder="username"
 value={formData.github}
 onChange={(e) => setFormData({ ...formData, github: e.target.value })}
 />
 </div>
 </div>

  <div className="flex flex-col gap-2">
  <label className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-2">
  <Briefcase size={16} /> LinkedIn Username
  </label>
  <div className="flex h-11 w-full rounded-xl bg-[#1c1c1c] focus-within:ring-1 focus-within:ring-white overflow-hidden transition-all">
  <div className="px-4 flex items-center border-r border-[#2a2a2a] bg-[#111111] text-[#888888] text-[14px]">
  linkedin.com/in/
  </div>
  <input
  type="text"
  className="flex-1 bg-transparent px-4 outline-none text-[14px] text-white"
  placeholder="username"
  value={formData.linkedin}
  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
  />
  </div>
  </div>

  <div className="flex flex-col gap-2">
  <label className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-2">
  <MessageCircle size={16} /> Twitter / X Username
  </label>
  <div className="flex h-11 w-full rounded-xl bg-[#1c1c1c] focus-within:ring-1 focus-within:ring-white overflow-hidden transition-all">
  <div className="px-4 flex items-center border-r border-[#2a2a2a] bg-[#111111] text-[#888888] text-[14px]">
  twitter.com/
  </div>
  <input
  type="text"
  className="flex-1 bg-transparent px-4 outline-none text-[14px] text-white"
  placeholder="username"
  value={formData.twitter}
  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
  />
  </div>
  </div>

  <div className="flex flex-col gap-2">
  <label className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-2">
  <LinkIcon size={16} /> Personal Portfolio
  </label>
  <Input
  type="url"
  placeholder="https://yourwebsite.com"
  value={formData.portfolio}
  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
  className="h-11 bg-[#1c1c1c] border-transparent text-white placeholder:text-[#666666] focus-visible:ring-1 focus-visible:ring-white rounded-xl text-[14px] px-4"
  />
  </div>
 </div>
 )}
 </motion.div>
 </AnimatePresence>

  <div className="flex gap-4 pt-6 mt-8 border-t border-[#2a2a2a]">
  {step > 1 ? (
  <button 
    type="button" 
    className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full border border-[#2a2a2a] text-white bg-transparent hover:bg-white/5 transition-colors text-[14px] font-semibold" 
    onClick={handleBack}
  >
  <ArrowLeft size={16} />
  Back
  </button>
  ) : (
  <div className="hidden md:block flex-1" />
  )}

  {step < 3 ? (
  <button
  type="button"
  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-[14px] font-semibold disabled:opacity-50 disabled:pointer-events-none"
  onClick={handleNext}
  disabled={!canProceed()}
  >
  Continue
  <ArrowRight size={16} />
  </button>
  ) : (
  <button
  type="button"
  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-[14px] font-semibold disabled:opacity-50 disabled:pointer-events-none"
  onClick={handleSubmit}
  disabled={loading}
  >
  {loading ? (
  <span className="flex items-center gap-2">
  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  Finishing...
  </span>
  ) : (
  <>
  <CheckCircle2 size={16} />
  Complete Setup
  </>
  )}
  </button>
  )}
 </div>
 </AuthLayout>
 );
}
