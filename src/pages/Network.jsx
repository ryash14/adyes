import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/user.service';
import { connectionService } from '../services/connection.service';
import { Search, UserPlus, MessageSquare, Check, X, Users, Handshake, Mail, Globe } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageContainer';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { formatRole } from '../utils/display';
import { cn } from '../utils/cn';
import { Button } from '@/components/ui/Button';

export default function Network() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [linkStatus, setLinkStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const loadNetwork = useCallback(async () => {
    if (!user) return;
    try {
      const [usersRes, connRes, reqRes, sentRes] = await Promise.all([
        userService.getAllUsers(),
        connectionService.getUserConnections(user.uid),
        connectionService.getPendingRequests(user.uid),
        connectionService.getSentRequests(user.uid)
      ]);

      const allUsers = (usersRes.data || []).filter(u => u.id !== user.uid);
      setPeople(allUsers);
      setConnections(connRes.data || []);
      setRequests(reqRes.data || []);

      const statusMap = {};
      (connRes.data || []).forEach(c => {
        const otherId = c.fromUserId === user.uid ? c.toUserId : c.fromUserId;
        statusMap[otherId] = { type: 'connected', id: c.id };
      });
      (reqRes.data || []).forEach(r => {
        statusMap[r.fromUserId] = { type: 'received', id: r.id };
      });
      (sentRes.data || []).forEach(r => {
        statusMap[r.toUserId] = { type: 'sent', id: r.id };
      });
      
      setLinkStatus(statusMap);
    } catch (err) {
      console.error('Failed to load network:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    Promise.resolve().then(loadNetwork);
  }, [loadNetwork]);

  const handleSendRequest = async (e, toUserId) => {
    e.stopPropagation();
    try {
      setLinkStatus(prev => ({ ...prev, [toUserId]: { type: 'sent', id: 'temp' } }));
      await connectionService.sendRequest(user.uid, toUserId);
      loadNetwork();
    } catch (err) {
      console.error('Send request error:', err);
      loadNetwork();
    }
  };

  const handleAcceptRequest = async (e, connectionId, userId) => {
    e.stopPropagation();
    try {
      setLinkStatus(prev => ({ ...prev, [userId]: { type: 'connected', id: connectionId } }));
      await connectionService.acceptRequest(connectionId);
      loadNetwork();
    } catch (err) {
      console.error('Accept request error:', err);
      loadNetwork();
    }
  };

  const handleRejectRequest = async (e, connectionId, userId) => {
    e.stopPropagation();
    try {
      setLinkStatus(prev => {
        const newMap = { ...prev };
        delete newMap[userId];
        return newMap;
      });
      await connectionService.rejectRequest(connectionId);
      loadNetwork();
    } catch (err) {
      console.error('Reject request error:', err);
      loadNetwork();
    }
  };

  const filteredPeople = useMemo(() => {
    const list = activeTab === 'discover' ? people : 
                activeTab === 'connections' ? connections.map(c => {
                  const otherId = c.fromUserId === user?.uid ? c.toUserId : c.fromUserId;
                  return people.find(p => p.id === otherId);
                }).filter(Boolean) :
                requests.map(r => people.find(p => p.id === r.fromUserId)).filter(Boolean);

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(p => 
      p.displayName?.toLowerCase().includes(query) || 
      p.college?.toLowerCase().includes(query) ||
      p.role?.toLowerCase().includes(query)
    );
  }, [activeTab, people, connections, requests, searchQuery, user]);

  return (
    <AppShell>
      <div className="mb-10 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Global Community
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Network</h1>
        <p className="text-muted-foreground mt-3 text-lg">Expand your circle, find co-founders, and manage your relationships.</p>
      </div>

      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:w-[450px] p-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-xl shadow-sm">
              <TabsTrigger value="discover" className="flex items-center gap-2 font-semibold text-xs">
                <Users size={16} />
                Discover
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-2 font-semibold text-xs">
                <Handshake size={16} />
                My Circle
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2 relative font-semibold text-xs">
                <Mail size={16} />
                Requests
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-black text-[10px] font-bold">
                    {requests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-[420px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={18} />
            <input
              type="text"
              className="h-11 pl-11 pr-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all rounded-xl text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground shadow-sm"
              placeholder="Search by name, role, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredPeople.length === 0 ? (
          <div className="py-24 bg-white/50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-border/50 dark:border-white/10">
            <EmptyState
              icon={Users}
              title="No innovators found"
              text={activeTab === 'discover' ? "Try a different search or check back later." : "Start connecting with people to build your circle."}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPeople.map((p) => {
              const status = linkStatus[p.id];
              const initials = p.displayName?.charAt(0).toUpperCase() || '?';
              
              return (
                <div 
                  key={p.id} 
                  className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center group cursor-pointer transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:-translate-y-1 shadow-sm hover:shadow-md relative overflow-hidden"
                  onClick={() => navigate(`/profile/${p.id}`)}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative mb-6 mt-2">
                    <Avatar 
                      src={p.photoURL} 
                      fallback={initials} 
                      size="lg" 
                      className="shadow-xl ring-4 ring-zinc-950"
                    />
                    {status?.type === 'connected' && (
                      <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1.5 border-2 border-zinc-950 text-black">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-8 flex-1 w-full">
                    <h3 className="text-xl font-bold tracking-tight">{p.displayName}</h3>
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">{formatRole(p.role)}</p>
                    <p className="text-sm text-muted-foreground">{p.college || 'Independent builder'}</p>
                    
                    {activeTab === 'requests' && requests.find(r => r.fromUserId === p.id)?.note && (
                      <div className="mt-4 p-4 bg-black/20 rounded-xl text-left border border-white/5">
                        <p className="text-xs text-muted-foreground italic line-clamp-3">
                          "{requests.find(r => r.fromUserId === p.id).note}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto w-full pt-4 border-t border-white/5 flex gap-3">
                    {activeTab === 'requests' ? (
                      <>
                        <Button 
                          variant="outline"
                          className="flex-1 h-10 flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive" 
                          onClick={(e) => {
                            const req = requests.find(r => r.fromUserId === p.id);
                            handleRejectRequest(e, req?.id, p.id);
                          }}
                        >
                          <X size={16} strokeWidth={2.5} />
                        </Button>
                        <Button 
                          variant="primary"
                          className="flex-1 h-10 flex items-center justify-center" 
                          onClick={(e) => {
                            const req = requests.find(r => r.fromUserId === p.id);
                            handleAcceptRequest(e, req?.id, p.id);
                          }}
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </Button>
                      </>
                    ) : (
                      <>
                        {!status && (
                          <Button 
                            variant="primary"
                            className="w-full h-10 text-xs flex items-center justify-center gap-2" 
                            onClick={(e) => handleSendRequest(e, p.id)}
                          >
                            <UserPlus size={16} /> Connect
                          </Button>
                        )}
                        {status?.type === 'sent' && (
                          <Button 
                            variant="outline"
                            className="w-full h-10 text-xs opacity-70" 
                            disabled
                          >
                            Request Sent
                          </Button>
                        )}
                        {status?.type === 'connected' && (
                          <Button 
                            variant="outline"
                            className="w-full h-10 text-xs flex items-center justify-center gap-2" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/messages/${p.id}`); }}
                          >
                            <MessageSquare size={16} /> Message
                          </Button>
                        )}
                        {status?.type === 'received' && (
                          <Button 
                            variant="primary"
                            className="w-full h-10 text-xs" 
                            onClick={(e) => handleAcceptRequest(e, status.id, p.id)}
                          >
                            Accept Request
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
