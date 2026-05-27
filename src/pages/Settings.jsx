import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storageService } from '../services/storage.service';
import { Upload, X, Save, AlertCircle, FileText } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageContainer';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

import CustomSelect from '../components/ui/CustomSelect';

export default function Settings() {
  const { profile, updateProfile, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    role: '',
    college: '',
    location: '',
    pronouns: '',
    experienceLevel: '',
    availability: '',
    bio: '',
    skills: [],
    github: '',
    linkedin: '',
    twitter: '',
    portfolio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        role: profile.role || '',
        college: profile.college || '',
        location: profile.location || '',
        pronouns: profile.pronouns || '',
        experienceLevel: profile.experienceLevel || '',
        availability: profile.availability || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        portfolio: profile.socialLinks?.portfolio || '',
      });
    }
  }, [profile]);

  const photoPreview = useMemo(() => (
    photoFile ? URL.createObjectURL(photoFile) : ''
  ), [photoFile]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const skill = skillInput.trim();
      if (skill && !formData.skills.includes(skill) && formData.skills.length < 15) {
        setFormData({ ...formData, skills: [...formData.skills, skill] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let photoURL;
    if (photoFile && user) {
      setPhotoUploadProgress(0);
      const upload = await storageService.uploadProfilePhoto(
        user.uid, 
        photoFile,
        (pct) => setPhotoUploadProgress(pct)
      );
      if (upload.error) {
        setError(upload.error);
        setLoading(false);
        toast.error(`Photo upload failed: ${upload.error}`);
        return;
      }
      photoURL = upload.url;
      setPhotoUploadProgress(100);
    }

    let resumeURL;
    let resumeName;
    if (resumeFile && user) {
      setResumeUploadProgress(0);
      const upload = await storageService.uploadResume(
        user.uid,
        resumeFile,
        (pct) => setResumeUploadProgress(pct)
      );
      if (upload.error) {
        setError(upload.error);
        setLoading(false);
        toast.error(`Resume upload failed: ${upload.error}`);
        return;
      }
      resumeURL = upload.url;
      resumeName = upload.name;
      setResumeUploadProgress(100);
    }

    const updates = {
      displayName: formData.displayName,
      role: formData.role,
      college: formData.college,
      location: formData.location,
      pronouns: formData.pronouns,
      experienceLevel: formData.experienceLevel,
      availability: formData.availability,
      bio: formData.bio,
      skills: formData.skills,
      ...(photoURL ? { photoURL } : {}),
      ...(resumeURL ? { resumeURL, resumeName } : {}),
      socialLinks: {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        portfolio: formData.portfolio,
      }
    };

    const { error: updateErr } = await updateProfile(updates);
    setLoading(false);
    
    if (updateErr) {
      setError(updateErr);
      toast.error('Failed to save profile');
    } else {
      setPhotoFile(null);
      setResumeFile(null);
      setPhotoUploadProgress(0);
      setResumeUploadProgress(0);
      toast.success('Profile updated successfully');
    }
  };

  const initials = profile?.displayName?.charAt(0).toUpperCase() || '?';

  return (
    <AppShell>
      <div className="mb-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Workspace
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-3 text-lg">Manage your identity, professional details, and links.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-32">
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-medium text-sm shadow-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* Profile Picture Section */}
        <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden relative group/section transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          <div className="p-6 md:p-8 border-b border-white/5 bg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-900/30">
            <h2 className="text-lg font-bold text-foreground">Profile Picture</h2>
            <p className="text-sm text-muted-foreground mt-1">This will be displayed on your profile and across the network.</p>
          </div>
          <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8">
            <div className="relative group shrink-0">
              <Avatar
                size="lg"
                src={photoPreview || profile?.photoURL}
                fallback={initials}
                className="w-24 h-24 text-3xl font-bold border-4 border-zinc-950 shadow-xl"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { setPhotoFile(e.target.files?.[0] || null); setPhotoUploadProgress(0); }}
                />
                <Upload size={24} className="text-white drop-shadow-md" />
              </label>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">Click avatar to change</p>
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG · Max 5MB</p>
              {photoFile && (
                <div className="w-full sm:w-56 space-y-2 mt-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span className="truncate max-w-[120px]">{photoFile.name}</span>
                    <span className="text-accent">{photoUploadProgress > 0 ? `${photoUploadProgress}%` : 'Ready'}</span>
                  </div>
                  {photoUploadProgress > 0 && (
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${photoUploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info Section */}
        <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden relative group/section transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          <div className="p-6 md:p-8 border-b border-white/5 bg-zinc-50 dark:bg-zinc-50 dark:bg-zinc-900/30">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Update your name, role, and organization.</p>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Full Name</label>
                <input
                  type="text"
                  className="h-11 px-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Primary Role</label>
                <CustomSelect
                  value={formData.role}
                  onChange={(val) => setFormData({ ...formData, role: val })}
                  placeholder="Select your role..."
                  options={[
                    { label: 'Student', value: 'student' },
                    { label: 'Professional', value: 'professional' },
                    { label: 'Entrepreneur', value: 'entrepreneur' }
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">College or Organization</label>
                <input
                  type="text"
                  className="h-11 px-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Where do you work or study?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Location</label>
                <input
                  type="text"
                  className="h-11 px-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Pronouns</label>
                <CustomSelect
                  value={formData.pronouns}
                  onChange={(val) => setFormData({ ...formData, pronouns: val })}
                  placeholder="Select pronouns..."
                  options={[
                    { label: 'she/her', value: 'she/her' },
                    { label: 'he/him', value: 'he/him' },
                    { label: 'they/them', value: 'they/them' },
                    { label: 'she/they', value: 'she/they' },
                    { label: 'he/they', value: 'he/they' },
                    { label: 'Prefer not to say', value: 'unspecified' }
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Experience Level</label>
                <CustomSelect
                  value={formData.experienceLevel}
                  onChange={(val) => setFormData({ ...formData, experienceLevel: val })}
                  placeholder="Select level..."
                  options={[
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Junior (1-3 yrs)', value: 'junior' },
                    { label: 'Mid-level (3-5 yrs)', value: 'mid' },
                    { label: 'Senior (5+ yrs)', value: 'senior' },
                    { label: 'Lead / Staff', value: 'lead' }
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Availability</label>
                <CustomSelect
                  value={formData.availability}
                  onChange={(val) => setFormData({ ...formData, availability: val })}
                  placeholder="Select availability..."
                  options={[
                    { label: 'Open to roles', value: 'open' },
                    { label: 'Available for freelance', value: 'freelance' },
                    { label: 'Looking to collaborate', value: 'collaborating' },
                    { label: 'Not looking right now', value: 'unavailable' }
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bio & Skills Section */}
        <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-border/50 dark:border-white/10 shadow-lg overflow-hidden relative group/section transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          <div className="p-6 md:p-8 border-b border-white/5 bg-zinc-50 dark:bg-zinc-900/30">
            <h2 className="text-lg font-bold text-foreground">Professional Summary</h2>
            <p className="text-sm text-muted-foreground mt-1">Tell the community about yourself and your expertise.</p>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Bio</label>
              <textarea
                className="w-full min-h-[140px] p-4 bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-y rounded-xl text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 shadow-sm"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write a short introduction about your background, interests, and what you're looking for..."
              />
              <p className="text-xs text-muted-foreground text-right">{formData.bio.length} characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Skills</label>
              <p className="text-xs text-muted-foreground/80 mb-2 ml-1">Add tags for languages, frameworks, or domains you excel in. Press Enter to add.</p>
              <div className="flex flex-wrap items-center gap-2 p-3 min-h-[56px] rounded-xl border border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
                {formData.skills.map((skill) => (
                  <Badge key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-foreground border border-border/50 dark:border-white/10 font-medium text-xs">
                    {skill}
                    <button type="button" className="rounded-full hover:text-destructive hover:bg-destructive/10 p-0.5 transition-colors" onClick={() => removeSkill(skill)}>
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  placeholder={formData.skills.length === 0 ? "e.g. React, Python, UI Design..." : "Add more..."}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/50 min-w-[150px] px-1"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>
            </div>
            
            {/* Resume Upload Section */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Resume</label>
                {profile?.resumeName && !resumeFile && (
                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Uploaded
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="inline-flex h-11 items-center justify-center rounded-xl border border-border/50 dark:border-white/10 bg-white/5 px-6 text-sm font-medium text-foreground hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden shadow-sm">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => { setResumeFile(e.target.files?.[0] || null); setResumeUploadProgress(0); }}
                    />
                    <Upload size={16} className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                    {resumeFile ? 'Change Resume' : 'Upload Resume'}
                  </label>
                  {(resumeFile || profile?.resumeName) && (
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-white/5 shadow-sm">
                      <FileText size={18} className="text-accent shrink-0 opacity-80" />
                      <span className="truncate max-w-[200px]">{resumeFile ? resumeFile.name : profile.resumeName}</span>
                      {resumeFile && <Badge className="bg-accent/20 text-accent border-none ml-2 text-[10px] font-bold">New</Badge>}
                    </div>
                  )}
                  {!resumeFile && !profile?.resumeName && (
                    <p className="text-xs text-muted-foreground">PDF or DOC · Max 5MB</p>
                  )}
                </div>
                {resumeFile && resumeUploadProgress > 0 && (
                  <div className="w-full sm:w-72 space-y-2 mt-1">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Uploading resume...</span>
                      <span className="text-accent">{resumeUploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${resumeUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-border/50 dark:border-white/10 shadow-lg overflow-hidden relative group/section transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          <div className="p-6 md:p-8 border-b border-white/5 bg-zinc-50 dark:bg-zinc-900/30">
            <h2 className="text-lg font-bold text-foreground">Social Links</h2>
            <p className="text-sm text-muted-foreground mt-1">Connect your other platforms to verify your identity and show your work.</p>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">GitHub</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
                  <span className="flex items-center px-4 bg-white/5 text-muted-foreground text-sm font-medium border-r border-border/50 dark:border-white/10">
                    github.com/
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent h-11 px-4 text-sm font-medium outline-none min-w-0 placeholder:text-muted-foreground/50"
                    value={formData.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/\/$/, '')}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value ? `https://github.com/${e.target.value.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')}` : '' })}
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">LinkedIn</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
                  <span className="flex items-center px-4 bg-white/5 text-muted-foreground text-sm font-medium border-r border-border/50 dark:border-white/10">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent h-11 px-4 text-sm font-medium outline-none min-w-0 placeholder:text-muted-foreground/50"
                    value={formData.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '')}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value ? `https://linkedin.com/in/${e.target.value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '')}` : '' })}
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Twitter / X</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
                  <span className="flex items-center px-4 bg-white/5 text-muted-foreground text-sm font-medium border-r border-border/50 dark:border-white/10">
                    x.com/
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent h-11 px-4 text-sm font-medium outline-none min-w-0 placeholder:text-muted-foreground/50"
                    value={formData.twitter.replace(/^(https?:\/\/)?(www\.)?(twitter|x)\.com\//i, '').replace(/\/$/, '')}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value ? `https://x.com/${e.target.value.replace(/^(https?:\/\/)?(www\.)?(twitter|x)\.com\//i, '')}` : '' })}
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Portfolio</label>
                <input
                  type="url"
                  className="h-11 px-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 md:left-72 right-0 p-4 md:p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-end gap-3 md:gap-4 z-40">
          <Button 
            type="button" 
            onClick={() => window.history.back()} 
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            className="min-w-[140px] md:min-w-[160px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save size={18} />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
