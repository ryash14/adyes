import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { contentService } from '../services/content.service';
import { connectionService } from '../services/connection.service';
import { userService } from '../services/user.service';
import { semanticSearchService } from '../services/semanticSearch';
import { Search, Sparkles, Rocket, Plus, Clock, ChevronLeft, ChevronRight, BookmarkPlus, MessageSquare, Handshake, ShieldCheck } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Avatar from '../components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { cn } from '../utils/cn';
import { useAuth } from '../hooks/useAuth';
import ContentModal from '../components/ContentModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Text3DFlip from '../components/ui/text-3d-flip';

export default function Discover() {
 const [searchParams, setSearchParams] = useSearchParams();
 const activeTab = searchParams.get('tab') === 'projects' ? 'projects' : 'ideas';
 const [searchQuery, setSearchQuery] = useState('');
 
 // Pagination State
 const [ideasPages, setIdeasPages] = useState([]);
 const [ideasDocs, setIdeasDocs] = useState([null]);
 const [currentIdeaPage, setCurrentIdeaPage] = useState(0);
 const [hasMoreIdeas, setHasMoreIdeas] = useState(true);

 const [projectsPages, setProjectsPages] = useState([]);
 const [projectsDocs, setProjectsDocs] = useState([null]);
 const [currentProjectPage, setCurrentProjectPage] = useState(0);
 const [hasMoreProjects, setHasMoreProjects] = useState(true);

 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [viewModalConfig, setViewModalConfig] = useState({ open: false, item: null, type: null });

 const navigate = useNavigate();
 const { user, profile } = useAuth();
 const [savedItems, setSavedItems] = useState(new Set());
 const [collabStatus, setCollabStatus] = useState({});

 useEffect(() => {
   if (profile?.savedItems) {
     setSavedItems(new Set(profile.savedItems));
   }
 }, [profile?.savedItems]);

 useEffect(() => {
   if (!user) {
     setCollabStatus({});
     return;
   }
   const fetchConnections = async () => {
     const [connRes, sentRes] = await Promise.all([
       connectionService.getUserConnections(user.uid),
       connectionService.getSentRequests(user.uid)
     ]);
     const statusMap = {};
     if (connRes.data) {
       connRes.data.forEach(c => {
         const otherId = c.fromUserId === user.uid ? c.toUserId : c.fromUserId;
         statusMap[otherId] = 'accepted';
       });
     }
     if (sentRes.data) {
       sentRes.data.forEach(req => {
         statusMap[req.toUserId] = 'pending';
       });
     }
     setCollabStatus(statusMap);
   };
   fetchConnections();
 }, [user]);

 const handleAddItem = async (e, item) => {
   e.stopPropagation();
   if (!user) { toast.error('Sign in to save items'); return; }
   try {
     const res = await userService.toggleSavedItem(user.uid, item.id);
     if (!res.error) {
       setSavedItems(new Set(res.data));
       if (res.isSaved) toast.success('Saved to your list!');
       else toast('Removed from saved');
     } else {
       toast.error('Failed to save');
     }
   } catch {
     toast.error('Failed to save item');
   }
 };

 const handleDebate = (e, item) => {
   e.stopPropagation();
   navigate(`/debate/${activeTab}/${item.id}`);
 };

 const handleCollab = async (e, item) => {
   e.stopPropagation();
   if (!user) { toast.error('Sign in to collaborate'); return; }
   const itemUserId = item.userId || item.authorId;
   if (!itemUserId) { toast.error('Cannot collaborate: author information missing.'); return; }
   if (user.uid === itemUserId) { toast.error('This is your own item!'); return; }
   try {
     const note = `Hi ${item.authorName || 'there'}! I'd love to collaborate on your ${activeTab === 'ideas' ? 'idea' : 'project'} "${item.title}".`;
     const res = await connectionService.sendRequest(user.uid, itemUserId, note);
     if (!res?.error) { 
       toast.success('Collaboration request sent!');
       setCollabStatus(prev => ({ ...prev, [itemUserId]: 'pending' }));
     }
     else { toast.error(res.error); }
   } catch { toast.error('Failed to send request'); }
 };

 const loadPage = useCallback(async (tab, pageIndex, refresh = false) => {
   setLoading(true);
   try {
     const isIdea = tab === 'ideas';
     const docs = isIdea ? ideasDocs : projectsDocs;
     const pages = isIdea ? ideasPages : projectsPages;
     const setPages = isIdea ? setIdeasPages : setProjectsPages;
     const setDocs = isIdea ? setIdeasDocs : setProjectsDocs;
     const setHasMore = isIdea ? setHasMoreIdeas : setHasMoreProjects;
     
     if (!refresh && pages[pageIndex]) {
       setLoading(false);
       return;
     }

     const lastDoc = docs[pageIndex];
     const fetchFn = isIdea ? contentService.getAllIdeas.bind(contentService) : contentService.getAllProjects.bind(contentService);
     
     const res = await fetchFn(20, lastDoc);
     const newItems = res.data || [];
     
     setPages(prev => {
       const next = [...prev];
       next[pageIndex] = newItems;
       return next;
     });
     
     if (res.lastDoc && newItems.length === 20) {
       setDocs(prev => {
         const next = [...prev];
         next[pageIndex + 1] = res.lastDoc;
         return next;
       });
       setHasMore(true);
     } else {
       setHasMore(false);
     }
   } catch (err) {
     console.error(`Failed to load ${tab} page:`, err);
   } finally {
     setLoading(false);
   }
 }, [ideasDocs, projectsDocs, ideasPages, projectsPages]);

 useEffect(() => {
   loadPage('ideas', currentIdeaPage);
 }, [currentIdeaPage, loadPage]);

 useEffect(() => {
   loadPage('projects', currentProjectPage);
 }, [currentProjectPage, loadPage]);

 const [semanticResults, setSemanticResults] = useState(null);
 const [isSearching, setIsSearching] = useState(false);

 useEffect(() => {
   if (activeTab === 'ideas') setCurrentIdeaPage(0);
   else setCurrentProjectPage(0);

   if (!searchQuery.trim()) {
     setSemanticResults(null);
     return;
   }

   const timer = setTimeout(async () => {
     setIsSearching(true);
     try {
       const searchFn = activeTab === 'ideas'
         ? semanticSearchService.searchIdeas.bind(semanticSearchService)
         : semanticSearchService.searchProjects.bind(semanticSearchService);
       
       const results = await searchFn(searchQuery, 20);
       setSemanticResults(results);
     } catch (err) {
       console.warn('Search failed, falling back to local filter:', err);
       setSemanticResults(null);
     } finally {
       setIsSearching(false);
     }
   }, 400);

   return () => clearTimeout(timer);
 }, [searchQuery, activeTab]);

 const handleTabChange = (nextTab) => {
   const nextParams = new URLSearchParams(searchParams);
   nextParams.set('tab', nextTab);
   setSearchParams(nextParams, { replace: true });
   setSearchQuery('');
 };

 const filteredItems = useMemo(() => {
   let result;
   if (semanticResults !== null) {
     result = semanticResults;
   } else {
     result = activeTab === 'ideas' 
       ? (ideasPages[currentIdeaPage] || [])
       : (projectsPages[currentProjectPage] || []);
   }

   if (searchQuery.trim() && semanticResults === null) {
     const query = searchQuery.toLowerCase();
     result = result.filter((item) => {
       const matchTitle = item.title?.toLowerCase().includes(query);
       const matchDesc = item.description?.toLowerCase().includes(query);
       const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(query));
       return matchTitle || matchDesc || matchTags;
     });
   }

   result = [...result]; 
   
   if (!searchQuery.trim()) {
     result.sort((a, b) => {
       const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
       const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
       return dateB - dateA;
     });
   }

   return result;
 }, [activeTab, searchQuery, ideasPages, currentIdeaPage, projectsPages, currentProjectPage, semanticResults]);

 const currentPageIndex = activeTab === 'ideas' ? currentIdeaPage : currentProjectPage;

 const paginatedItems = useMemo(() => {
   if (semanticResults !== null && !searchQuery.trim()) {
     const start = currentPageIndex * 20;
     return filteredItems.slice(start, start + 20);
   }
   return filteredItems;
 }, [filteredItems, semanticResults, searchQuery, currentPageIndex]);

 const hasNextPage = useMemo(() => {
   if (semanticResults !== null && !searchQuery.trim()) {
     return (currentPageIndex + 1) * 20 < filteredItems.length;
   }
   if (searchQuery.trim()) return false;
   return activeTab === 'ideas' ? hasMoreIdeas : hasMoreProjects;
 }, [semanticResults, searchQuery, currentPageIndex, filteredItems.length, activeTab, hasMoreIdeas, hasMoreProjects]);

 const handlePrevPage = () => {
   if (activeTab === 'ideas') setCurrentIdeaPage(p => Math.max(0, p - 1));
   else setCurrentProjectPage(p => Math.max(0, p - 1));
   window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleNextPage = () => {
   if (activeTab === 'ideas') setCurrentIdeaPage(p => p + 1);
   else setCurrentProjectPage(p => p + 1);
   window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const renderPagination = () => {
   if (searchQuery.trim() || (!hasNextPage && currentPageIndex === 0)) return null;
   return (
     <div className="flex items-center justify-between py-8 border-t border-border mt-8">
       <Button 
         onClick={handlePrevPage}
         disabled={loading || currentPageIndex === 0}
         variant="outline"
         className="min-w-[120px] h-11 rounded-xl"
       >
         <ChevronLeft size={16} className="mr-2" />
         Previous
       </Button>
       <span className="text-sm font-semibold text-muted-foreground">
         Page {currentPageIndex + 1}
       </span>
       <Button 
         onClick={handleNextPage}
         disabled={loading || (!hasNextPage && currentPageIndex > 0 && (!activeTab === 'ideas' ? !ideasPages[currentPageIndex+1] : !projectsPages[currentPageIndex+1]))}
         variant="outline"
         className="min-w-[120px] h-11 rounded-xl"
       >
         Next
         <ChevronRight size={16} className="ml-2" />
       </Button>
     </div>
   );
 };

 return (
   <AppShell>
     <div className="mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground text-xs font-semibold mb-4 tracking-wide shadow-sm">
         <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
         Global Network
       </div>
       <div className="text-3xl md:text-4xl font-black tracking-tight text-foreground -ml-1">
         <Text3DFlip text="Discover" />
       </div>
       <p className="text-muted-foreground mt-2 text-base">Browse the latest ideas and projects from the community.</p>
     </div>

     <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-border">
         <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto">
           <TabsList className="grid w-full grid-cols-2 md:w-[320px] p-1 bg-secondary border border-border rounded-xl">
             <TabsTrigger value="ideas" className="flex items-center gap-2 font-semibold text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
               <Sparkles size={16} />
               Ideas
             </TabsTrigger>
             <TabsTrigger value="projects" className="flex items-center gap-2 font-semibold text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
               <Rocket size={16} />
               Projects
             </TabsTrigger>
           </TabsList>
         </Tabs>

         <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
           <div className="relative w-full md:w-[320px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={18} />
             <input
               type="text"
               className="h-11 pl-11 pr-4 w-full bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all rounded-xl text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
               placeholder={`Search ${activeTab}...`}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           
           {user && (
             <Button 
               onClick={() => setIsModalOpen(true)}
               variant="primary"
               className="w-full md:w-auto h-11 px-6 shadow-none rounded-xl bg-foreground text-background hover:bg-foreground/90"
             >
               <Plus size={18} className="mr-2" />
               New {activeTab === 'ideas' ? 'Idea' : 'Project'}
             </Button>
           )}
         </div>
       </div>

       {loading || isSearching ? (
         <LoadingState />
       ) : paginatedItems.length === 0 ? (
         <div className="py-24 bg-card/50 rounded-3xl border border-dashed border-border">
           <EmptyState
             icon={Search}
             title="No results found"
             text={`We couldn't find any ${activeTab} matching your search.`}
           />
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {paginatedItems.map((item) => {
             const isIdea = activeTab === 'ideas';
             const borderHoverClass = isIdea ? 'hover:border-accent/50' : 'hover:border-blue-500/50';
             const textHoverClass = isIdea ? 'group-hover:text-accent' : 'group-hover:text-blue-500';
             return (
               <div
                 key={item.id}
                 className={cn("group relative bg-card border border-border rounded-xl flex flex-col h-full cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:border-foreground/20")}
                 onClick={() => setViewModalConfig({ open: true, item, type: activeTab })}
               >
                 <div className="p-6 flex flex-col gap-4 flex-1">
                   {/* Author row */}
                   <div className="flex items-center gap-3">
                     <Avatar size="sm" fallback={item.authorName?.[0] || '?'} />
                     <div className="flex-1 min-w-0">
                       <span className={cn("text-sm font-bold text-foreground truncate block transition-colors", textHoverClass)}>
                         {item.authorName || 'Anonymous'}
                       </span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                         {isIdea ? 'Idea' : 'Project'}
                       </span>
                     </div>
                     {isIdea && item.certified && (
                       <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 rounded-full px-2 py-1 shrink-0 shadow-sm border border-emerald-500/20">
                         <ShieldCheck size={12} />
                         Certified
                       </span>
                     )}
                   </div>

                   {/* Title + description */}
                   <div className="flex-1 space-y-2 mt-2">
                     <h3 className={cn("text-[18px] font-bold tracking-tight leading-snug line-clamp-2 transition-colors", textHoverClass)}>
                       {item.title}
                     </h3>
                     <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                       {item.description}
                     </p>
                   </div>

                   {/* Footer */}
                   <div className="pt-4 border-t border-border mt-4 space-y-4">
                     <div className="flex items-center justify-between">
                       <div className="flex flex-wrap gap-2">
                         {item.tags?.slice(0, 2).map((tag) => (
                           <span
                             key={tag}
                             className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-secondary/50 border-border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-colors"
                           >
                             {tag}
                           </span>
                         ))}
                         {item.tags?.length > 2 && (
                           <span className="text-[10px] font-semibold text-muted-foreground mt-1.5">+{item.tags.length - 2}</span>
                         )}
                       </div>
                       <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground shrink-0 bg-secondary/50 px-2 py-1 rounded-md">
                         <Clock size={12} />
                         {item.createdAt
                           ? new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                           : 'New'
                         }
                       </div>
                     </div>

                     {/* Action buttons */}
                     {user && user.uid !== (item.userId || item.authorId) && (
                       <div className="grid grid-cols-3 gap-2">
                         <button
                           onClick={(e) => handleAddItem(e, item)}
                           className={cn(
                             "flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold border transition-all duration-200",
                             savedItems.has(item.id)
                               ? "bg-foreground text-background border-transparent"
                               : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                           )}
                         >
                           <BookmarkPlus size={14} /> Add
                         </button>
                         <button
                           onClick={(e) => handleDebate(e, item)}
                           className="flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold border bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                         >
                           <MessageSquare size={14} /> Debate
                         </button>
                         <button
                           onClick={(e) => handleCollab(e, item)}
                           disabled={collabStatus[item.userId || item.authorId] === 'accepted' || collabStatus[item.userId || item.authorId] === 'pending'}
                           className={cn(
                             "flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold border transition-all duration-200",
                             collabStatus[item.userId || item.authorId] === 'accepted'
                               ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                               : collabStatus[item.userId || item.authorId] === 'pending'
                               ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                               : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                           )}
                         >
                           <Handshake size={14} /> {collabStatus[item.userId || item.authorId] === 'accepted' ? "Collab'd" : collabStatus[item.userId || item.authorId] === 'pending' ? 'Pending' : 'Collab'}
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
       )}

       {renderPagination()}
     </div>

     {user && (
       <ContentModal 
         open={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         type={activeTab === 'ideas' ? 'idea' : 'project'}
         userId={user.uid}
         authorName={profile?.displayName || user.displayName}
         onSaved={() => {
           loadPage(activeTab, currentPageIndex, true);
         }}
       />
     )}

     <ViewDetailsModal 
       open={viewModalConfig.open}
       onClose={() => {
         setViewModalConfig({ ...viewModalConfig, open: false });
         loadPage(activeTab, currentPageIndex, true);
       }}
       item={viewModalConfig.item}
       type={viewModalConfig.type}
     />
   </AppShell>
 );
}
