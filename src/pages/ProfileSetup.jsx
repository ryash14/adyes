import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, Briefcase, Rocket, X, Code, MessageCircle, Link as LinkIcon } from 'lucide-react';
import AuthLayout from '../components/public/AuthLayout';
import Badge from '../components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  
  const PREDEFINED_SKILLS = [
    "React", "Node.js", "Python", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS",
    "UI/UX Design", "Figma", "Firebase", "Supabase", "MongoDB", "PostgreSQL",
    "GraphQL", "Docker", "AWS", "Machine Learning", "Data Science", "Go", "Rust",
    "C++", "Java", "Spring Boot", "DevOps", "Marketing", "Product Management",
    "SEO", "Copywriting", "Sales", "Angular", "Vue.js", "Svelte", "React Native", "Flutter",
    "iOS", "Android", "Solidity", "Web3"
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

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's an exact match or just one filtered skill, add it
      const match = filteredSkills.find(s => s.toLowerCase() === skillInput.toLowerCase()) 
                    || (filteredSkills.length > 0 ? filteredSkills[0] : null);
                    
      if (match && !formData.skills.includes(match) && formData.skills.length < 10) {
        setFormData({ ...formData, skills: [...formData.skills, match] });
        setSkillInput('');
        setShowSkillDropdown(false);
      }
    }
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill) && formData.skills.length < 10) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setSkillInput('');
      setShowSkillDropdown(false);
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

  return (
    <AuthLayout
      eyebrow="Profile setup"
      title={step === 1 ? 'Choose your path' : step === 2 ? 'Tell us about your work' : 'Add your links'}
      lead={
        step === 1
          ? 'Select a role that best describes your current focus.'
          : step === 2
            ? 'Provide context that helps others understand your background.'
            : 'Link your profiles to build trust with collaborators.'
      }
      progress={{ current: step, total: 3 }}
      progressLabel="Onboarding"
      wide={true}
      footer={error ? <span className="text-destructive font-medium bg-destructive/10 px-4 py-2 rounded-lg inline-block">{error}</span> : null}
    >
      <div className="flex flex-col gap-8">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'professional', label: 'Professional', icon: Briefcase },
              { id: 'entrepreneur', label: 'Entrepreneur', icon: Rocket },
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 px-4 py-8 text-sm font-bold uppercase tracking-wider transition-all duration-200",
                  formData.role === role.id
                    ? "border-accent bg-accent/10 text-accent shadow-[4px_4px_0_0_#CCFF00] scale-[1.02]"
                    : "border-border hover:border-accent/50 hover:bg-zinc-800 text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setFormData({ ...formData, role: role.id })}
              >
                <div className={cn(
                  "h-14 w-14 rounded-full flex items-center justify-center transition-colors",
                  formData.role === role.id ? "bg-accent text-black" : "bg-zinc-800 text-muted-foreground"
                )}>
                  <role.icon size={26} strokeWidth={2} />
                </div>
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">College or Organization</span>
              <Input
                type="text"
                placeholder="e.g. Stanford University"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills and Interests</span>
              <div className="flex flex-wrap items-center gap-2 p-3 min-h-[56px] rounded-lg border-2 border-border bg-white dark:bg-zinc-900/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all">
                {formData.skills.map((skill) => (
                  <Badge key={skill} className="flex items-center gap-1.5 pr-1.5 py-1 text-sm bg-zinc-800 border-border text-foreground rounded-md px-2">
                    {skill}
                    <button type="button" className="rounded-full hover:bg-zinc-700 p-1 transition-colors" onClick={() => removeSkill(skill)}>
                      <X size={14} strokeWidth={2.5} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full bg-transparent border-none outline-none text-base placeholder:text-muted-foreground min-w-[120px]"
                    placeholder={formData.skills.length === 0 ? "Search skills..." : ""}
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                    onKeyDown={handleSkillKeyDown}
                  />
                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-64 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl z-50 p-1 flex flex-col gap-1">
                      {filteredSkills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          className="text-left px-3 py-2 rounded-lg text-sm hover:bg-accent/10 hover:text-accent transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault(); // prevent blur
                            addSkill(skill);
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</span>
              <textarea
                className="flex w-full rounded-lg border-2 border-border bg-white dark:bg-zinc-900/50 backdrop-blur-sm px-4 py-3 text-base font-medium transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent min-h-[140px] resize-none"
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
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Code size={16} /> GitHub Username
              </label>
              <div className="flex h-12 w-full rounded-lg border-2 border-border bg-white dark:bg-zinc-900/50 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden transition-all">
                <div className="px-4 flex items-center border-r-2 border-border bg-zinc-800 text-muted-foreground text-sm font-medium">
                  github.com/
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 outline-none text-base text-foreground font-medium"
                  placeholder="username"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase size={16} /> LinkedIn Username
              </label>
              <div className="flex h-12 w-full rounded-lg border-2 border-border bg-white dark:bg-zinc-900/50 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden transition-all">
                <div className="px-4 flex items-center border-r-2 border-border bg-zinc-800 text-muted-foreground text-sm font-medium">
                  linkedin.com/in/
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 outline-none text-base text-foreground font-medium"
                  placeholder="username"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageCircle size={16} /> Twitter / X Username
              </label>
              <div className="flex h-12 w-full rounded-lg border-2 border-border bg-white dark:bg-zinc-900/50 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden transition-all">
                <div className="px-4 flex items-center border-r-2 border-border bg-zinc-800 text-muted-foreground text-sm font-medium">
                  twitter.com/
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 outline-none text-base text-foreground font-medium"
                  placeholder="username"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <LinkIcon size={16} /> Personal Portfolio
              </label>
              <Input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6 mt-8 border-t border-border">
        {step > 1 ? (
          <Button type="button" variant="secondary" className="flex-1" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div className="hidden md:block flex-1" />
        )}

        {step < 3 ? (
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleNext}
            disabled={step === 1 && !formData.role}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Finishing...' : 'Complete Setup'}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}
