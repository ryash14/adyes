import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import { Sparkles, Rocket, Clock, Heart, UserPlus, Check, Clock3, ShieldCheck, MessageSquare, Handshake, BookmarkPlus, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { contentService } from '../services/content.service';
import { connectionService } from '../services/connection.service';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Simple local debate comment structure (stored in Firestore per item if desired, for now UI only)
export default function ViewDetailsModal({ open, onClose, item, type }) {
 const navigate = useNavigate();

 const isIdea = type === 'ideas' || type === 'idea';
 const Icon = isIdea ? Sparkles : Rocket;
 const itemUserId = item?.userId || item?.authorId;
 
 // Format date safely
 let dateStr = '';
 if (item?.createdAt) {
 if (item.createdAt.seconds) {
 dateStr = new Date(item.createdAt.seconds * 1000).toLocaleDateString();
 } else {
 dateStr = new Date(item.createdAt).toLocaleDateString();
 }
 }

 const handleProfileClick = () => {
 if (!item) return;
 onClose();
 navigate(`/profile/${itemUserId}`);
 };

 const { user, profile } = useAuth();
 const [connectionStatus, setConnectionStatus] = useState(null);
 const [showConnectForm, setShowConnectForm] = useState(false);
 const [connectNote, setConnectNote] = useState('');
 const [isConnecting, setIsConnecting] = useState(false);
 const [isDeleting, setIsDeleting] = useState(false);
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
 const [isSaved, setIsSaved] = useState(false);
 const [isCollabbing, setIsCollabbing] = useState(false);

 // Debate state
 const [showDebate, setShowDebate] = useState(false);
 const [debateComments, setDebateComments] = useState([]);
 const [debateInput, setDebateInput] = useState('');
 const debateRef = useRef(null);

 useEffect(() => {
 if (item && itemUserId) {
 if (user && user.uid !== itemUserId) {
 connectionService.getConnection(user.uid, itemUserId).then((res) => {
 if (res.data) {
 setConnectionStatus(res.data.status);
 } else {
 setConnectionStatus('none');
 }
 });
 } else {
 setConnectionStatus(null);
 }
 }
 
 if (item && profile?.savedItems) {
   setIsSaved(profile.savedItems.includes(item.id));
 } else {
   setIsSaved(false);
 }

 // Reset local state on item change
 setShowDebate(false);
 setDebateComments([]);
 setDebateInput('');
 }, [item, user, profile, itemUserId]);

 useEffect(() => {
 if (showDebate && debateRef.current) {
 debateRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
 }
 }, [showDebate, debateComments.length]);

 const handleConnect = async () => {
 if (!user || isConnecting) return;
 setIsConnecting(true);
 try {
 const defaultNote = `Hi ${item.authorName || 'there'}! I saw your ${isIdea ? 'idea' : 'project'}"${item.title}" and would love to connect.`;
 const finalNote = connectNote.trim() || defaultNote;
 
 const res = await connectionService.sendRequest(user.uid, itemUserId, finalNote);
 if (!res.error) {
 setConnectionStatus('pending');
 setShowConnectForm(false);
 toast.success('Connection request sent!');
 } else {
 toast.error(res.error);
 }
 } catch (err) {
 toast.error('Failed to send request');
 } finally {
 setIsConnecting(false);
 }
 };

 const handleCollab = async () => {
 if (!user || isCollabbing) return;
 if (user.uid === itemUserId) { toast.error('This is your own item!'); return; }
 setIsCollabbing(true);
 try {
 const note = `Hi ${item.authorName || 'there'}! I'd love to collaborate on your ${isIdea ? 'idea' : 'project'}"${item.title}".`;
 const res = await connectionService.sendRequest(user.uid, itemUserId, note);
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

 const handleToggleSave = async () => {
   if (!user || !item) return;
   const currentlySaved = isSaved;
   setIsSaved(!currentlySaved);
   try {
     await userService.toggleSavedItem(user.uid, item.id);
     toast.success(currentlySaved ? 'Removed from saved' : '✓ Saved!');
   } catch (err) {
     setIsSaved(currentlySaved);
     toast.error('Failed to save item');
   }
 };

 const handleAddDebateComment = () => {
 if (!debateInput.trim()) return;
 const newComment = {
 id: Date.now(),
 text: debateInput.trim(),
 author: profile?.displayName || 'You',
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 };
 setDebateComments(prev => [...prev, newComment]);
 setDebateInput('');
 };

 const handleDeleteClick = () => {
 setShowDeleteConfirm(true);
 };

 const handleConfirmDelete = async () => {
 if (!user || !item || user.uid !== itemUserId || isDeleting) return;
 
 setIsDeleting(true);
 try {
 const deleteFn = isIdea ? contentService.deleteIdea.bind(contentService) : contentService.deleteProject.bind(contentService);
 const res = await deleteFn(item.id);
 
 if (!res.error) {
 toast.success('Successfully deleted!');
 setShowDeleteConfirm(false);
 onClose();
 window.location.reload();
 } else {
 toast.error(res.error || 'Failed to delete');
 }
 } catch (err) {
 toast.error('An error occurred during deletion');
 } finally {
 setIsDeleting(false);
 }
 };

 const isOwnItem = user && item && user.uid === itemUserId;

 const footer = (
 <div className="flex flex-col gap-3 w-full">
 {/* 3 action buttons — only for other people's items */}
 {user && !isOwnItem && (
 <div className="grid grid-cols-3 gap-2">
 <button
 onClick={handleToggleSave}
 className={cn(
"flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border transition-all duration-200",
 isSaved
 ?"bg-accent/10 border-accent/30 text-accent"
 :"bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
 )}
 >
 <BookmarkPlus size={15} />
 {isSaved ? 'Saved' : 'Add'}
 </button>
 <button
 onClick={() => setShowDebate(s => !s)}
 className={cn(
"flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border transition-all duration-200",
 showDebate
 ?"bg-blue-500/10 border-blue-500/30 text-blue-400"
 :"bg-white/5 border-white/10 text-muted-foreground hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400"
 )}
 >
 <MessageSquare size={15} />
 Debate
 {debateComments.length > 0 && (
 <span className="ml-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded-full w-4 h-4 flex items-center justify-center">
 {debateComments.length}
 </span>
 )}
 </button>
 <button
 onClick={handleCollab}
 disabled={isCollabbing || connectionStatus === 'accepted' || connectionStatus === 'pending'}
 className={cn(
"flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border transition-all duration-200",
 connectionStatus === 'accepted'
 ?"bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
 :"bg-white/5 border-white/10 text-muted-foreground hover:bg-accent/10 hover:border-accent/30 hover:text-accent disabled:opacity-50 disabled:pointer-events-none"
 )}
 >
 <Handshake size={15} />
 {isCollabbing ? '…' : connectionStatus === 'accepted' ? 'Collab\'d' : 'Collab'}
 </button>
 </div>
 )}

 <div className="flex justify-between items-center w-full">
 <div>
 {isOwnItem && (
 <button onClick={handleDeleteClick} className="btn border border-destructive text-destructive hover:bg-destructive/10 h-10 px-4 rounded-xl" disabled={isDeleting}>
 {isDeleting ? 'Deleting...' : 'Delete'}
 </button>
 )}
 </div>
 <button onClick={onClose} className="btn btn-primary">Close</button>
 </div>
 </div>
 );

 if (!item) return null;

 return (
 <Modal open={open} onClose={onClose} title={""} footer={footer}>
 <div className="space-y-6 pt-2">
 {/* Header */}
 <div>
 <div className="flex items-center gap-2 text-primary mb-3">
 <Icon size={18} />
 <span className="text-xs font-bold uppercase tracking-wider">{isIdea ? 'Idea' : 'Project'}</span>
 {isIdea && item.certified && (
 <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-0.5">
 <ShieldCheck size={12} />
 Certified Original
 </span>
 )}
 </div>
 <h2 className="text-2xl font-bold tracking-tight text-foreground">{item.title}</h2>
 </div>

 {/* Author & Date */}
 <div className="flex flex-col gap-4 border-y border-border py-4">
 <div className="flex items-center justify-between">
 <div 
 className="flex items-center gap-3 cursor-pointer group flex-1"
 onClick={handleProfileClick}
 >
 <Avatar size="sm" fallback={item.authorName?.[0] || '?'} />
 <div>
 <p className="text-sm font-semibold group-hover:text-primary transition-colors">
 {item.authorName || 'Anonymous'}
 </p>
 <p className="text-xs text-muted-foreground">Creator</p>
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 {connectionStatus === 'none' && !showConnectForm && (
 <button 
 onClick={() => setShowConnectForm(true)}
 className="btn btn-outline h-8 px-3 text-xs gap-1.5"
 >
 <UserPlus size={14} /> Connect
 </button>
 )}
 {connectionStatus === 'pending' && (
 <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
 <Clock3 size={12} /> Pending
 </span>
 )}
 {connectionStatus === 'accepted' && (
 <span className="flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
 <Check size={12} /> Connected
 </span>
 )}

 {dateStr && (
 <div className="flex items-center gap-1.5 text-muted-foreground text-sm pl-4 border-l border-border">
 <Clock size={14} />
 <span>{dateStr}</span>
 </div>
 )}
 </div>
 </div>
 
 {showConnectForm && (
 <div className="bg-secondary/20 p-3 rounded-lg border border-border/40 animate-in fade-in slide-in-from-top-2">
 <label className="block text-xs font-semibold mb-2">Add a note (optional)</label>
 <textarea
 className="input w-full min-h-[60px] text-sm py-2 mb-3 bg-background"
 placeholder={`Hi ${item.authorName || 'there'}! I saw your ${isIdea ? 'idea' : 'project'}...`}
 value={connectNote}
 onChange={(e) => setConnectNote(e.target.value)}
 />
 <div className="flex justify-end gap-2">
 <button 
 onClick={() => setShowConnectForm(false)} 
 className="btn btn-ghost h-8 px-3 text-xs"
 >
 Cancel
 </button>
 <button 
 onClick={handleConnect}
 disabled={isConnecting}
 className="btn btn-primary h-8 px-4 text-xs"
 >
 {isConnecting ? 'Sending...' : 'Send Request'}
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Description */}
 <div className="prose prose-sm dark:prose-invert">
 <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
 {item.description}
 </p>
 </div>

 {/* Tags */}
 {item.tags && item.tags.length > 0 && (
 <div className="pt-4 border-t border-border">
 <h4 className="text-sm font-semibold mb-3">Tags</h4>
 <div className="flex flex-wrap gap-2">
 {item.tags.map((tag) => (
 <Badge key={tag} className="bg-secondary/50 border-none">
 {tag}
 </Badge>
 ))}
 </div>
 </div>
 )}

 {/* Inline Debate Thread */}
 {showDebate && (
 <div ref={debateRef} className="pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-2">
 <div className="flex items-center gap-2 mb-4">
 <MessageSquare size={16} className="text-blue-400" />
 <h4 className="text-sm font-bold text-foreground">Debate Thread</h4>
 <span className="text-xs text-muted-foreground ml-auto">Share your thoughts, critiques, or counter-ideas</span>
 </div>

 {debateComments.length === 0 ? (
 <div className="text-center py-8 rounded-xl border border-dashed border-border/40 bg-white/[0.02] mb-4">
 <MessageSquare size={24} className="text-muted-foreground mx-auto mb-2 opacity-40" />
 <p className="text-xs text-muted-foreground">No debate comments yet. Be the first to spark a discussion!</p>
 </div>
 ) : (
 <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
 {debateComments.map((c) => (
 <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-border/30">
 <Avatar size="xs" fallback={c.author[0]} />
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs font-bold text-foreground">{c.author}</span>
 <span className="text-[10px] text-muted-foreground">{c.time}</span>
 </div>
 <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
 </div>
 </div>
 ))}
 </div>
 )}

 <div className="flex gap-2">
 <input
 type="text"
 className="input h-10 flex-1 text-sm"
 placeholder="Make a point or pose a counter-argument..."
 value={debateInput}
 onChange={(e) => setDebateInput(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') handleAddDebateComment(); }}
 />
 <button
 onClick={handleAddDebateComment}
 disabled={!debateInput.trim()}
 className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-40 disabled:pointer-events-none"
 >
 <Send size={15} />
 </button>
 </div>
 </div>
 )}
 </div>

 {showDeleteConfirm && (
 <DeleteConfirmationModal
 open={showDeleteConfirm}
 onClose={() => setShowDeleteConfirm(false)}
 onConfirm={handleConfirmDelete}
 itemName={item.title}
 type={isIdea ? 'idea' : 'project'}
 isDeleting={isDeleting}
 />
 )}
 </Modal>
 );
}
