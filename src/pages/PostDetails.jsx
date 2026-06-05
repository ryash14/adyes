import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { contentService } from '../services/content.service';
import { connectionService } from '../services/connection.service';
import userService from '../services/user.service';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import LoadingState from '../components/LoadingState';
import { Sparkles, Rocket, Clock, MessageSquare, Handshake, BookmarkPlus, ArrowLeft, Send, ShieldCheck, UserPlus, Check, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function PostDetails() {
 const { type, id } = useParams();
 const navigate = useNavigate();
 const { user, profile } = useAuth();
 
 const [item, setItem] = useState(null);
 const [loading, setLoading] = useState(true);
 const [connectionStatus, setConnectionStatus] = useState(null);
 const [isSaved, setIsSaved] = useState(false);
 const [isCollabbing, setIsCollabbing] = useState(false);
 
 const [debateComments, setDebateComments] = useState([]);
 const [debateInput, setDebateInput] = useState('');
 const debateRef = useRef(null);

 const isIdea = type === 'ideas' || type === 'idea';
 const Icon = isIdea ? Sparkles : Rocket;

 useEffect(() => {
 const loadItem = async () => {
 try {
 const fetchFn = isIdea ? contentService.getIdea.bind(contentService) : contentService.getProject.bind(contentService);
 const res = await fetchFn(id);
 if (res.data) {
 setItem(res.data);
 } else {
 toast.error('Item not found');
 navigate('/discover');
 }
 } catch (err) {
 toast.error('Failed to load details');
 } finally {
 setLoading(false);
 }
 };
 loadItem();
 }, [id, isIdea, navigate]);

  useEffect(() => {
    if (item && item.userId && user && user.uid !== item.userId) {
      connectionService.getConnection(user.uid, item.userId).then((res) => {
        if (res.data) setConnectionStatus(res.data.status);
        else setConnectionStatus('none');
      });
    } else {
      setConnectionStatus(null);
    }
  }, [item, user]);

  useEffect(() => {
    if (item && profile?.savedItems) {
      setIsSaved(profile.savedItems.includes(item.id));
    }
  }, [item, profile]);

  const handleSaveItem = async () => {
    if (!user) { toast.error('Sign in to save'); return; }
    try {
      const res = await userService.toggleSavedItem(user.uid, item.id);
      if (!res.error) {
        setIsSaved(res.isSaved);
        toast(res.isSaved ? 'Saved to your list!' : 'Removed from saved');
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error('Failed to save item');
    }
  };

 const handleCollab = async () => {
 if (!user || isCollabbing) return;
 if (user.uid === item.userId) { toast.error('This is your own item!'); return; }
 setIsCollabbing(true);
 try {
 const note = `Hi ${item.authorName || 'there'}! I'd love to collaborate on your ${isIdea ? 'idea' : 'project'}"${item.title}".`;
 const res = await connectionService.sendRequest(user.uid, item.userId || item.authorId, note);
 if (!res?.error) {
 toast.success('Collaboration request sent!');
 } else {
 toast.error(res.error);
 }
 } catch {
 toast.error('Failed to send collab request');
 } finally {
 setIsCollabbing(false);
 }
 };

 const handleAddDebateComment = () => {
 if (!debateInput.trim() || !user) {
 if (!user) toast.error("Sign in to debate");
 return;
 }
 const newComment = {
 id: Date.now(),
 text: debateInput.trim(),
 author: profile?.displayName || 'You',
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 };
 setDebateComments(prev => [...prev, newComment]);
 setDebateInput('');
 setTimeout(() => {
 debateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
 }, 100);
 };

 let dateStr = '';
 if (item?.createdAt) {
 if (item.createdAt.seconds) {
 dateStr = new Date(item.createdAt.seconds * 1000).toLocaleDateString();
 } else {
 dateStr = new Date(item.createdAt).toLocaleDateString();
 }
 }

 if (loading) {
 return (
 <AppShell>
 <div className="flex justify-center items-center h-[50vh]">
 <LoadingState />
 </div>
 </AppShell>
 );
 }

 if (!item) return null;

 const isOwnItem = user && user.uid === item.userId;

 return (
 <AppShell>
      <div className="max-w-7xl mx-auto mb-12 px-4 md:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8 md:p-10 space-y-8">
 
                {/* Header Area */}
                <div>
                  <div className="flex items-center gap-2 text-accent mb-4">
                    <Icon size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">{isIdea ? 'Idea' : 'Project'}</span>
                    {isIdea && item.certified && (
                      <span className="ml-4 flex items-center gap-1.5 text-xs font-bold text-foreground bg-secondary border border-border rounded-full px-3 py-1">
                        <ShieldCheck size={14} />
                        Certified Original
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    {item.title}
                  </h1>
                </div>

                {/* Author details */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-5">
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate(`/profile/${item.userId}`)}
                  >
                    <Avatar size="md" fallback={item.authorName?.[0] || '?'} />
                    <div>
                      <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                        {item.authorName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Creator</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {connectionStatus === 'none' && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                        <UserPlus size={14} /> Connect
                      </button>
                    )}
                    {connectionStatus === 'pending' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                        <Clock3 size={14} /> Pending
                      </span>
                    )}
                    {connectionStatus === 'accepted' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                        <Check size={14} /> Connected
                      </span>
                    )}

                    {dateStr && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm pl-4 border-l border-border font-medium">
                        <Clock size={14} />
                        <span>{dateStr}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} className="bg-secondary text-foreground border-border text-xs py-1 px-3">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                {user && !isOwnItem && (
                  <div className="flex gap-3 pt-6 border-t border-border">
                    <button
                      onClick={handleSaveItem}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold border transition-all duration-200",
                        isSaved
                          ? "bg-foreground text-background border-transparent"
                          : "bg-transparent border-border text-foreground hover:bg-secondary"
                      )}
                    >
                      <BookmarkPlus size={18} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={handleCollab}
                      disabled={isCollabbing || connectionStatus === 'accepted' || connectionStatus === 'pending'}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold border transition-all duration-200",
                        connectionStatus === 'accepted'
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-transparent border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none"
                      )}
                    >
                      <Handshake size={18} />
                      {isCollabbing ? '...' : connectionStatus === 'accepted' ? 'Collab\'d' : 'Collab'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Debate Thread */}
          <div className="lg:col-span-5 flex flex-col h-[calc(100vh-160px)] sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare size={24} className="text-accent" />
              <h2 className="text-2xl font-black tracking-tight text-foreground">Debate Thread</h2>
              <span className="text-sm font-semibold text-muted-foreground ml-auto bg-secondary px-3 py-1 rounded-full">
                {debateComments.length} Comments
              </span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm flex-1 flex flex-col overflow-hidden">
              {debateComments.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center text-center py-12 rounded-xl border border-dashed border-border bg-secondary/30 mb-8">
                  <MessageSquare size={32} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">No debate comments yet. Be the first to spark a discussion!</p>
                </div>
              ) : (
                <div className="flex-1 space-y-6 mb-8 overflow-y-auto pr-2">
                  {debateComments.map((c) => (
                    <div key={c.id} className="flex gap-4">
                      <Avatar size="sm" fallback={c.author[0]} />
                      <div className="flex-1 min-w-0 bg-secondary/50 p-4 rounded-2xl rounded-tl-sm border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-foreground">{c.author}</span>
                          <span className="text-xs font-semibold text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={debateRef} />
                </div>
              )}

              <div className="flex gap-3 shrink-0">
                <input
                  type="text"
                  className="flex-1 bg-transparent border border-border rounded-xl px-4 text-sm font-medium focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-muted-foreground shadow-sm"
                  placeholder="Make a point or counter-argument..."
                  value={debateInput}
                  onChange={(e) => setDebateInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddDebateComment(); }}
                />
                <button
                  onClick={handleAddDebateComment}
                  disabled={!debateInput.trim()}
                  className="h-12 w-12 flex items-center justify-center rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-sm shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
 </AppShell>
 );
}
