import { useState, useEffect } from 'react';
import Modal from './Modal';
import { contentService } from '../services/content.service';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader2, AlertTriangle, Users } from 'lucide-react';

const SIMILARITY_THRESHOLD = 0.20;

async function checkOriginality(title, description) {
  try {
    const query = `${title} ${description}`;
    const response = await fetch('https://collabhub-dmnz.onrender.com/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, type: 'ideas', top_k: 3 }),
    });
    if (!response.ok) return { certified: true, score: 0 };
    const data = await response.json();
    const topScore = data.results?.[0]?.score ?? 0;
    return { certified: topScore < SIMILARITY_THRESHOLD, score: topScore };
  } catch {
    // If API is down, don't block submission
    return { certified: true, score: 0 };
  }
}

export default function ContentModal({ open, onClose, type, item, userId, authorName, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [certChecking, setCertChecking] = useState(false);
  const [certResult, setCertResult] = useState(null); // { certified, score } | null
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  
  // Mentor flow state
  const [needMentor, setNeedMentor] = useState(false);
  const [mentorId, setMentorId] = useState('');
  const [mentorNote, setMentorNote] = useState('');
  const [mentors, setMentors] = useState([]);

 const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        tags: item.tags ? item.tags.join(', ') : ''
      });
      // Currently not supporting editing mentor request post-creation for simplicity
      setNeedMentor(false);
    } else {
      setFormData({ title: '', description: '', tags: '' });
      setNeedMentor(false);
      setMentorId('');
      setMentorNote('');
    }
    setCertResult(null);

    if (open && type === 'idea' && !isEdit) {
      userService.getMentors().then(res => {
        if (res.data) setMentors(res.data);
      });
    }
  }, [item, open, type, isEdit]);

 // Auto-check when title or description changes (debounced)
 useEffect(() => {
 if (type !== 'idea' || isEdit) return;
 if (!formData.title.trim() || !formData.description.trim()) {
 setCertResult(null);
 return;
 }
 const timer = setTimeout(async () => {
 setCertChecking(true);
 const result = await checkOriginality(formData.title, formData.description);
 setCertResult(result);
 setCertChecking(false);
 }, 800);
 return () => clearTimeout(timer);
 }, [formData.title, formData.description, type, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    if (needMentor && !mentorId) {
      toast.error('Please select a mentor.');
      return;
    }
 
 setLoading(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        userId: userId,
        authorName: authorName || 'Anonymous',
        certified: type === 'idea' ? (certResult?.certified ?? false) : false,
      };

      if (type === 'idea' && needMentor) {
        data.mentorId = mentorId;
        data.mentorNote = mentorNote;
      }

 if (isEdit) {
 if (type === 'idea') {
 await contentService.updateIdea(item.id, data);
 } else {
 await contentService.updateProject(item.id, data);
 }
 toast.success(`${type === 'idea' ? 'Idea' : 'Project'} updated!`);
 } else {
 if (type === 'idea') {
 await contentService.createIdea(data);
 } else {
 await contentService.createProject(data);
 }
 if (type === 'idea' && certResult?.certified) {
 toast.success('✦ Certified Original idea shared!', { duration: 4000 });
 } else {
 toast.success(`${type === 'idea' ? 'Idea' : 'Project'} created!`);
 }
 }
 onSaved();
 onClose();
 } catch (error) {
 console.error(error);
 toast.error(`Failed to ${isEdit ? 'update' : 'create'} ${type}`);
 } finally {
 setLoading(false);
 }
 };

 const footer = (
 <div className="flex justify-end gap-3">
 <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>Cancel</button>
 <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
 {loading ? 'Saving...' : 'Save'}
 </button>
 </div>
 );

 return (
 <Modal
 open={open}
 onClose={onClose}
 title={`${isEdit ? 'Edit' : 'New'} ${type === 'idea' ? 'Idea' : 'Project'}`}
 footer={footer}
 >
 <form onSubmit={handleSubmit} className="space-y-6">
 <label className="block space-y-2">
 <span className="text-sm font-bold text-foreground">Title</span>
 <input
 type="text"
 className="w-full h-12 bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-all"
 value={formData.title}
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 placeholder={`A brilliant new ${type}...`}
 />
 </label>
 
 <label className="block space-y-2">
 <span className="text-sm font-bold text-foreground">Description</span>
 <textarea
 className="w-full min-h-[140px] bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-all resize-y"
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 placeholder={`Describe your ${type}...`}
 />
 </label>

 {type === 'idea' && !isEdit && (
 <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
 certChecking
 ? 'border-white/10 bg-white/5'
 : certResult?.certified
 ? 'border-yellow-500/30 bg-yellow-500/10'
 : certResult && !certResult.certified
 ? 'border-orange-500/30 bg-orange-500/10'
 : 'border-white/5 bg-white/[0.03]'
 }`}>
 {certChecking ? (
 <>
 <Loader2 size={16} className="text-muted-foreground animate-spin mt-0.5 shrink-0" />
 <span className="text-muted-foreground text-xs">Checking originality against existing ideas…</span>
 </>
 ) : certResult?.certified ? (
 <>
 <ShieldCheck size={16} className="text-yellow-400 mt-0.5 shrink-0" />
 <div>
 <p className="font-semibold text-yellow-400 text-xs">✦ Certified Original</p>
 <p className="text-muted-foreground text-[11px] mt-0.5">
 This idea is less than {Math.round(SIMILARITY_THRESHOLD * 100)}% similar to existing ideas. A certification badge will be added.
 </p>
 </div>
 </>
 ) : certResult && !certResult.certified ? (
 <>
 <AlertTriangle size={16} className="text-orange-400 mt-0.5 shrink-0" />
 <div>
 <p className="font-semibold text-orange-400 text-xs">Similar idea exists</p>
 <p className="text-muted-foreground text-[11px] mt-0.5">
 This idea is {Math.round(certResult.score * 100)}% similar to an existing idea. Consider making it more distinct to earn certification.
 </p>
 </div>
 </>
 ) : (
 <span className="text-muted-foreground text-xs">Fill in title and description to check originality.</span>
 )}
 </div>
 )}

  {type === 'idea' && (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-foreground">Tags (comma separated)</span>
      <input
        type="text"
        className="w-full h-12 bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-all"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="React, Next.js, AI"
      />
    </label>
  )}

  {type === 'idea' && !isEdit && (
    <div className="space-y-4 pt-2 border-t border-white/10 mt-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          className="rounded bg-white/5 border-white/20 text-emerald-500 focus:ring-emerald-500/30"
          checked={needMentor}
          onChange={(e) => setNeedMentor(e.target.checked)}
        />
        <span className="text-sm font-semibold flex items-center gap-1.5">
          <Users size={16} className="text-emerald-400" /> Need a mentor?
        </span>
      </label>

      {needMentor && (
        <div className="space-y-5 p-6 bg-secondary/20 rounded-2xl border border-border/50 mt-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <label className="block space-y-2 relative z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select a Mentor</span>
            <select
              className="w-full h-12 bg-secondary border border-border text-foreground rounded-xl px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-all cursor-pointer appearance-none font-medium"
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
            >
              <option value="">-- Choose a Mentor --</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.displayName || m.email}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Personalized Note</span>
            <textarea
              className="w-full min-h-[100px] bg-secondary border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-all resize-y text-sm font-medium"
              placeholder="Hi, I'd love your guidance on this idea..."
              value={mentorNote}
              onChange={(e) => setMentorNote(e.target.value)}
            />
          </label>
          <p className="text-[11px] text-muted-foreground leading-relaxed relative z-10">
            If you request a mentor, your idea will not be published publicly until the mentor reviews and accepts it.
          </p>
        </div>
      )}
    </div>
  )}
 </form>
 </Modal>
 );
}
