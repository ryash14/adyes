import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import { Sparkles, Rocket, Clock, Heart, UserPlus, Check, Clock3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { contentService } from '../services/content.service';
import { connectionService } from '../services/connection.service';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function ViewDetailsModal({ open, onClose, item, type }) {
  const navigate = useNavigate();

  const isIdea = type === 'ideas' || type === 'idea';
  const Icon = isIdea ? Sparkles : Rocket;
  
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
    navigate(`/profile/${item.userId}`);
  };

  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connectNote, setConnectNote] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (item) {
      if (user && user.uid !== item.userId) {
        connectionService.getConnection(user.uid, item.userId).then((res) => {
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
  }, [item, user]);

  const handleConnect = async () => {
    if (!user || isConnecting) return;
    setIsConnecting(true);
    try {
      const defaultNote = `Hi ${item.authorName || 'there'}! I saw your ${isIdea ? 'idea' : 'project'} "${item.title}" and would love to connect.`;
      const finalNote = connectNote.trim() || defaultNote;
      
      const res = await connectionService.sendRequest(user.uid, item.userId, finalNote);
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

  const footer = (
    <div className="flex justify-end items-center w-full">
      <button onClick={onClose} className="btn btn-primary">Close</button>
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
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{item.title}</h2>
        </div>

        {/* Author & Date */}
        <div className="flex flex-col gap-4 border-y border-border/50 py-4">
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
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm pl-4 border-l border-border/50">
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
          <div className="pt-4 border-t border-border/50">
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
      </div>
    </Modal>
  );
}
