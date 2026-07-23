import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { messageService } from '../services/message.service';
import { connectionService } from '../services/connection.service';
import { userService } from '../services/user.service';
import { storageService } from '../services/storage.service';
import { 
 Send, 
 Search, 
 ArrowLeft, 
 MessageSquare, 
 MoreHorizontal, 
 Smile, 
 Paperclip,
 X,
 Edit3,
 Trash2
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Avatar from '../components/ui/Avatar';
import LoadingState from '../components/LoadingState';
import { formatMessageTimestamp, buildMessageTimeline } from '../utils/datetime';
import { cn } from '../utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const EMOJIS = ['👍', '🙌', '🎯', '🔥', '✅', '👏', '😊', '🚀', '💡', '✨', '🧠', '📌'];

// Derive a human-readable presence label from Firestore lastActive timestamp
function getPresenceLabel(userData) {
 if (!userData) return 'Member';
 const lastActive = userData.lastActive;
 if (!lastActive) return 'Member';

 // Handle Firestore Timestamp object or plain object with seconds
 let ms;
 if (lastActive.toMillis) {
 ms = lastActive.toMillis();
 } else if (lastActive.seconds) {
 ms = lastActive.seconds * 1000;
 } else {
 ms = Number(lastActive);
 }

 const diffMs = Date.now() - ms;
 const diffMins = Math.floor(diffMs / 60000);

 if (diffMins < 5) return 'Active now';
 if (diffMins < 60) return `Active ${diffMins}m ago`;
 const diffHours = Math.floor(diffMins / 60);
 if (diffHours < 24) return `Active ${diffHours}h ago`;
 const diffDays = Math.floor(diffHours / 24);
 if (diffDays < 7) return `Active ${diffDays}d ago`;
 return 'Member';
}

function isActiveNow(userData) {
 if (!userData?.lastActive) return false;
 const lastActive = userData.lastActive;
 let ms;
 if (lastActive.toMillis) ms = lastActive.toMillis();
 else if (lastActive.seconds) ms = lastActive.seconds * 1000;
 else ms = Number(lastActive);
 return Date.now() - ms < 5 * 60 * 1000;
}

export default function Messages() {
 const { userId } = useParams();
 const navigate = useNavigate();
 const { user } = useAuth();
 
 const [connections, setConnections] = useState([]);
 const [messages, setMessages] = useState([]);
 const [newMessage, setNewMessage] = useState('');
 const [attachments, setAttachments] = useState([]);
 const [uploading, setUploading] = useState(false);
 const [uploadError, setUploadError] = useState('');
 const [emojiOpen, setEmojiOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [loading, setLoading] = useState(true);
 const [lightboxImage, setLightboxImage] = useState(null);

 const messagesEndRef = useRef(null);
 const unsubscribeRef = useRef(null);
 const fileInputRef = useRef(null);

 const loadConnections = useCallback(async () => {
 try {
 const res = await connectionService.getUserConnections(user.uid);
 const conns = res.data || [];
 
 const enriched = await Promise.all(
 conns.map(async (c) => {
 const otherId = c.fromUserId === user.uid ? c.toUserId : c.fromUserId;
 const userRes = await userService.getUser(otherId).catch(() => ({ data: null }));
 const alias = c.aliases?.[user.uid] || null;
 return {
 id: c.id,
 userId: otherId,
 user: userRes?.data || { displayName: 'User', photoURL: null },
 alias: alias,
 lastMessageAt: c.lastMessageAt?.toMillis ? c.lastMessageAt.toMillis() : (c.createdAt?.toMillis ? c.createdAt.toMillis() : 0),
 unreadCount: 0
 };
 })
 );
 enriched.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
 setConnections(enriched);
 } catch (err) {
 console.error('Failed to load connections:', err);
 } finally {
 setLoading(false);
 }
 }, [user]);

 useEffect(() => {
 if (!user) return;
 Promise.resolve().then(loadConnections);
 }, [user, loadConnections]);

 const selectedConnection = useMemo(() => {
 if (!userId) return null;
 return connections.find(c => c.userId === userId) || null;
 }, [connections, userId]);

 useEffect(() => {
 if (!loading && userId && !selectedConnection) {
 // Security guard: trying to access chat with non-connection
 navigate('/messages', { replace: true });
 }
 }, [loading, userId, selectedConnection, navigate]);

 useEffect(() => {
 if (!user || !userId || !selectedConnection) return;

 if (unsubscribeRef.current) {
 unsubscribeRef.current();
 }
 
 // Subscribe
 const unsubscribe = messageService.subscribeToMessages(user.uid, userId, (msgs) => {
 setMessages(Array.isArray(msgs) ? msgs : []);
 messageService.markAllAsRead(userId, user.uid);
 });

 unsubscribeRef.current = unsubscribe;

 return () => {
 if (unsubscribeRef.current) unsubscribeRef.current();
 };
 }, [userId, user, selectedConnection]);

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
 }, [messages]);

 const handleSendMessage = async (e) => {
 e.preventDefault();
 if ((!newMessage.trim() && attachments.length === 0) || !userId || !user) return;

 const content = newMessage.trim();
 setNewMessage('');
 setEmojiOpen(false);
 
 await messageService.sendMessage(user.uid, userId, {
 content,
 attachments,
 });
 setAttachments([]);
 };

 const handleFileChange = async (event) => {
 const files = Array.from(event.target.files || []);
 if (!files.length || !user) return;

 setUploading(true);
 setUploadError('');

 const uploads = await Promise.all(
 files.map((file) => storageService.uploadMessageAttachment(user.uid, file))
 );

 const errors = uploads.filter((res) => res.error).map((res) => res.error);
 if (errors.length > 0) {
 setUploadError(errors[0]);
 }

 const uploaded = uploads.filter((res) => res.data).map((res) => res.data);
 if (uploaded.length > 0) {
 setAttachments((prev) => [...prev, ...uploaded]);
 }

 setUploading(false);
 event.target.value = '';
 };

 const removeAttachment = (index) => {
 setAttachments((prev) => prev.filter((_, i) => i !== index));
 };

 const addEmoji = (emoji) => {
 setNewMessage((prev) => `${prev}${emoji}`);
 setEmojiOpen(false);
 };

 const formatBytes = (bytes = 0) => {
 if (bytes === 0) return '0 B';
 const sizes = ['B', 'KB', 'MB', 'GB'];
 const i = Math.floor(Math.log(bytes) / Math.log(1024));
 return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
 };

 const filteredConnections = connections.filter(c => 
 !searchQuery || c.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const timeline = buildMessageTimeline(messages);
 const safeTimeline = Array.isArray(timeline) ? timeline : [];

 return (
 <AppShell fullBleed>
 {/* Lightbox Modal */}
 {lightboxImage && (
 <div 
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
 onClick={() => setLightboxImage(null)}
 >
 <button 
 className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
 onClick={() => setLightboxImage(null)}
 >
 <X size={24} />
 </button>
 <img 
 src={lightboxImage} 
 alt="Fullscreen attachment" 
 className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
 onClick={(e) => e.stopPropagation()} 
 />
 </div>
 )}

 <div className="flex h-full w-full flex-col md:flex-row overflow-hidden bg-background">
 
 {/* Sidebar */}
 <div className={cn(
"w-full md:w-72 lg:w-80 border-r border-border/60 flex flex-col bg-card/40 backdrop-blur-md",
 userId ?"hidden md:flex" :"flex"
 )}>
 <div className="px-4 py-4 border-b border-border">
 <h2 className="text-lg font-bold tracking-tight text-foreground mb-3 px-2">Messages</h2>
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={16} />
 <input
 type="text"
 className="h-11 pl-11 pr-4 w-full bg-card/40 backdrop-blur-md border border-border/60 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all rounded-xl font-medium text-sm text-foreground outline-none placeholder:text-muted-foreground shadow-sm"
 placeholder="Search conversations..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>
 
 <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
 {loading ? (
 <div className="p-8"><LoadingState /></div>
 ) : filteredConnections.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
 <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center text-muted-foreground border border-border">
 <MessageSquare size={28} />
 </div>
 <p className="text-sm font-semibold text-muted-foreground">No conversations</p>
 </div>
 ) : (
 <div className="space-y-1">
 {filteredConnections.map((conn) => {
 const isActive = userId === conn.userId;
 const initials = conn.user?.displayName?.charAt(0).toUpperCase() || '?';
 return (
 <button
 key={conn.userId}
 className={cn(
"flex w-full items-center gap-4 p-3 transition-all duration-200 rounded-xl text-left",
 isActive 
 ?"bg-secondary shadow-[inset_2px_0_0_0_var(--foreground)]" 
 :"hover:bg-secondary/50"
 )}
 onClick={() => navigate(`/messages/${conn.userId}`)}
 >
 <div className="relative shrink-0">
 <Avatar src={conn.user?.photoURL} fallback={initials} size="sm" />
 {isActiveNow(conn.user) && (
 <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between">
 <span className={cn("text-sm font-bold truncate transition-colors", isActive ?"text-accent" :"text-foreground group-hover:text-accent")}>
 {conn.alias || conn.user?.displayName}
 </span>
 </div>
 <p className="text-[11px] font-medium text-muted-foreground truncate uppercase tracking-wider">
 {getPresenceLabel(conn.user)}
 </p>
 </div>
 </button>
 );
 })}
 </div>
 )}
 </div>
 </div>

 {/* Thread */}
 <div className={cn(
"flex-1 flex flex-col bg-background relative",
 !userId ?"hidden md:flex items-center justify-center bg-secondary/50" :"flex"
 )}>
 {userId && selectedConnection ? (
 <>
 {/* Thread Header */}
 <div className="h-20 border-b border-border/60 flex items-center justify-between px-6 bg-card/40 backdrop-blur-md sticky top-0 z-10">
 <div className="flex items-center gap-4">
 <button
 type="button"
 className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 hover:text-accent transition-colors"
 onClick={() => navigate('/messages')}
 >
 <ArrowLeft size={18} />
 </button>
 <div className="relative">
 <Avatar src={selectedConnection.user?.photoURL} fallback={selectedConnection.user?.displayName?.charAt(0)} size="sm" />
 {isActiveNow(selectedConnection.user) && (
 <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
 )}
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-foreground">{selectedConnection.alias || selectedConnection.user?.displayName}</span>
 <span className="text-xs font-semibold text-muted-foreground">
 {getPresenceLabel(selectedConnection.user)}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-2 relative">
 <div 
 className="p-2 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground group relative cursor-pointer"
 tabIndex="0"
 >
 <MoreHorizontal size={20} />
 <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card backdrop-blur-xl text-foreground shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
 <div className="p-1 flex flex-col">
 <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-white/10 hover:text-accent transition-colors" onClick={async () => {
 const newAlias = prompt("Enter a nickname for this connection:", selectedConnection.alias || selectedConnection.user?.displayName);
 if (newAlias !== null) {
 await connectionService.setConnectionAlias(selectedConnection.id, user.uid, newAlias);
 loadConnections();
 }
 }}>
 Rename connection
 </button>
 <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-white/10 hover:text-accent transition-colors" onClick={() => alert("Clear messages coming soon")}>
 Clear messages
 </button>
 <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-white/10 hover:text-accent transition-colors" onClick={() => alert("Export chat coming soon")}>
 Export chat
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 
 {/* Thread Feed */}
 <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-6">
 {safeTimeline.map((group) => {
 const groupMessages = Array.isArray(group?.messages) ? group.messages : [];
 return (
 <div key={group.date} className="space-y-6">
 <div className="flex items-center gap-4">
 <div className="h-px flex-1 bg-white/5" />
 <span className="text-[10px] font-semibold text-muted-foreground">{group.dateLabel}</span>
 <div className="h-px flex-1 bg-white/5" />
 </div>
 {groupMessages.map((msg) => {
 const isOwn = msg.fromUserId === user?.uid;
 const msgAttachments = Array.isArray(msg.attachments) ? msg.attachments : [];
 const { timeStr } = formatMessageTimestamp(msg.createdAt);
 return (
 <div
 key={msg.id}
 className={cn(
"flex w-full flex-col",
 isOwn ?"items-end" :"items-start"
 )}
 >
 <div
 className={cn(
"max-w-[85%] sm:max-w-[70%] rounded-2xl text-[13px] md:text-sm font-medium leading-relaxed relative group/msg shadow-sm",
 (!msg.content && msgAttachments.length > 0) ?"" :"px-4 py-2.5",
 isOwn && (msg.content || msgAttachments.length === 0)
 ?"bg-accent text-accent-foreground rounded-br-sm" 
 :"",
 !isOwn && (msg.content || msgAttachments.length === 0)
 ?"bg-secondary text-foreground rounded-bl-sm"
 :""
 )}
 >
 {isOwn && (
 <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 opacity-0 group-hover/msg:opacity-100 flex items-center gap-1 transition-opacity">
 <button className="p-1.5 hover:bg-secondary hover:text-accent text-muted-foreground rounded-lg transition-colors" title="Edit message" onClick={() => alert("Edit coming soon")}>
 <Edit3 size={14} />
 </button>
 <button className="p-1.5 hover:bg-destructive hover:text-white text-muted-foreground rounded-lg transition-colors" title="Delete message" onClick={() => messageService.deleteMessage(msg.id)}>
 <Trash2 size={14} />
 </button>
 </div>
 )}
 {msg.content && <p className="mb-2 whitespace-pre-wrap">{msg.content}</p>}
 {msgAttachments.length > 0 && (
 <div className={cn(
"grid gap-2",
 msgAttachments.length > 1 ?"grid-cols-2" :"grid-cols-1",
 !msg.content &&"mt-0"
 )}>
 {msgAttachments.map((file, idx) => {
 const isImage = file.type?.startsWith('image/');
 
 if (isImage) {
 return (
 <button
 key={`${file.url}-${idx}`}
 onClick={() => setLightboxImage(file.url)}
 className="rounded-xl overflow-hidden block border border-border hover:border-accent transition-colors cursor-zoom-in"
 >
 <img
 src={file.url}
 alt={file.name || 'Attachment'}
 className="max-h-64 w-full object-cover"
 />
 </button>
 );
 }

 return (
 <a
 key={`${file.url}-${idx}`}
 href={file.url}
 target="_blank"
 rel="noreferrer"
 className="rounded-xl overflow-hidden block border border-border hover:border-accent transition-colors bg-background"
 >
 <div className="p-3 space-y-1">
 <p className="text-xs font-semibold truncate text-foreground">{file.name || 'Attachment'}</p>
 <p className="text-[10px] text-muted-foreground">
 {formatBytes(file.size)}
 </p>
 </div>
 </a>
 );
 })}
 </div>
 )}
 </div>
 <span className="text-[10px] font-semibold text-muted-foreground mt-1.5 px-1">{timeStr}</span>
 </div>
 );
 })}
 </div>
 );
 })}
 <div ref={messagesEndRef} />
 </div>
 
 {/* Thread Composer */}
 <div className="p-3 md:p-4 border-t border-border/60 bg-card/40 backdrop-blur-md">
 <div className="max-w-4xl mx-auto space-y-2">
 {attachments.length > 0 && (
 <div className="flex flex-wrap gap-2 mb-3">
 {attachments.map((file, index) => (
 <div
 key={`${file.url}-${index}`}
 className="inline-flex items-center gap-2 rounded-xl border border-border bg-card backdrop-blur-md px-3 py-1.5 text-xs font-medium shadow-sm"
 >
 <span className="max-w-[160px] truncate">{file.name || 'Attachment'}</span>
 <button
 type="button"
 className="text-muted-foreground hover:text-destructive transition-colors"
 onClick={() => removeAttachment(index)}
 >
 <X size={14} />
 </button>
 </div>
 ))}
 </div>
 )}
 {uploadError && (
 <div className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 inline-block mb-2">{uploadError}</div>
 )}
 <form className="flex items-center gap-2 bg-background/50 backdrop-blur-md border border-border/60 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 rounded-2xl p-1.5 transition-all shadow-sm" onSubmit={handleSendMessage}>
 <button
 type="button"
 className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-colors"
 onClick={() => fileInputRef.current?.click()}
 disabled={uploading}
 >
 <Paperclip size={18} />
 </button>
 <input
 ref={fileInputRef}
 type="file"
 className="hidden"
 multiple
 onChange={handleFileChange}
 />
 <input
 type="text"
 className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium placeholder:text-muted-foreground text-foreground"
 placeholder={uploading ?"Uploading files..." :"Message..."}
 value={newMessage}
 onChange={(e) => setNewMessage(e.target.value)}
 />
 <div className="relative">
 <button
 type="button"
 className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-colors"
 onClick={() => setEmojiOpen((prev) => !prev)}
 >
 <Smile size={18} />
 </button>
 {emojiOpen && (
 <div className="absolute bottom-[120%] right-0 z-50 w-64 rounded-2xl border border-border bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4 shadow-2xl">
 <p className="text-[10px] font-semibold text-muted-foreground mb-3">
 Quick reactions
 </p>
 <div className="grid grid-cols-4 gap-1">
 {EMOJIS.map((emoji) => (
 <button
 key={emoji}
 type="button"
 className="h-10 w-10 rounded-xl hover:bg-white/10 text-xl transition-colors flex items-center justify-center"
 onClick={() => addEmoji(emoji)}
 >
 {emoji}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 <Button
 type="submit"
 variant="primary"
 className="h-9 w-9 p-0 flex items-center justify-center rounded-lg shadow-none"
 disabled={!newMessage.trim() && attachments.length === 0}
 >
 <Send size={16} />
 </Button>
 </form>
 </div>
 </div>
 </>
 ) : (
 <div className="flex flex-col items-center justify-center p-10 text-center space-y-4 bg-secondary/50 w-full h-full">
 <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center text-muted-foreground border border-border shadow-sm">
 <MessageSquare size={28} />
 </div>
 <div className="space-y-1">
 <h3 className="text-xl font-bold tracking-tight text-foreground">Select a conversation</h3>
 <p className="text-muted-foreground max-w-sm text-[13px] md:text-sm leading-relaxed">
 Choose a connection from the sidebar to view messages and collaborate.
 </p>
 </div>
 </div>
 )}
 </div>

 </div>
 </AppShell>
 );
}
