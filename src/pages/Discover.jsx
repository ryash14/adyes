import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { contentService } from '../services/content.service';
import { Search, Sparkles, Rocket, Plus, Filter, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageContainer';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { cn } from '../utils/cn';
import { useAuth } from '../hooks/useAuth';
import ContentModal from '../components/ContentModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import { Button } from '@/components/ui/Button';
import CustomSelect from '../components/ui/CustomSelect';

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'projects' ? 'projects' : 'ideas';
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [ideasPages, setIdeasPages] = useState([]);
  const [ideasDocs, setIdeasDocs] = useState([null]); // holds startAfter docs for each page. Index 0 is null.
  const [currentIdeaPage, setCurrentIdeaPage] = useState(0);
  const [hasMoreIdeas, setHasMoreIdeas] = useState(true);

  const [projectsPages, setProjectsPages] = useState([]);
  const [projectsDocs, setProjectsDocs] = useState([null]);
  const [currentProjectPage, setCurrentProjectPage] = useState(0);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalConfig, setViewModalConfig] = useState({ open: false, item: null, type: null });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'likes', 'liked_by_me'

  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const loadPage = useCallback(async (tab, pageIndex, refresh = false) => {
    setLoading(true);
    try {
      const isIdea = tab === 'ideas';
      const docs = isIdea ? ideasDocs : projectsDocs;
      const pages = isIdea ? ideasPages : projectsPages;
      const setPages = isIdea ? setIdeasPages : setProjectsPages;
      const setDocs = isIdea ? setIdeasDocs : setProjectsDocs;
      const setHasMore = isIdea ? setHasMoreIdeas : setHasMoreProjects;
      
      // If we already have the page cached and we aren't refreshing, just return
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
    // Reset page to 0 when search query or tab changes
    if (activeTab === 'ideas') setCurrentIdeaPage(0);
    else setCurrentProjectPage(0);

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch('http://localhost:5108/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            type: activeTab,
            top_k: searchQuery.trim() ? 20 : 100 // Fetch 100 for normal browsing, 20 for search
          })
        });
        if (response.ok) {
          const data = await response.json();
          // Fetch real firebase data for FAISS results to get accurate likes!
          const ids = data.results.map(r => r.id);
          const realDocs = await contentService.getDocumentsByIds(activeTab, ids);
          
          const realMap = {};
          if (realDocs.data) {
             realDocs.data.forEach(d => { realMap[d.id] = d; });
          }
          // Merge with FAISS but DO NOT filter out items missing from Firebase!
          // This ensures old demo items stored in FAISS are still visible.
          const merged = data.results.map(r => ({...r, ...(realMap[r.id] || {})}));
          setSemanticResults(merged);
        } else {
          setSemanticResults([]);
        }
      } catch (err) {
        console.warn('Semantic search failed, falling back to local filter:', err);
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

    if (sortBy === 'liked_by_me' && user) {
      result = result.filter(item => item.likedBy?.includes(user.uid));
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

    result = [...result]; // Clone to sort
    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'likes' || sortBy === 'liked_by_me') {
      result.sort((a, b) => {
        const scoreA = a.upvotes || a.saves || 0;
        const scoreB = b.upvotes || b.saves || 0;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [activeTab, searchQuery, ideasPages, currentIdeaPage, projectsPages, currentProjectPage, semanticResults, sortBy, user]);

  const currentPageIndex = activeTab === 'ideas' ? currentIdeaPage : currentProjectPage;

  // PAGINATION LOGIC!
  const paginatedItems = useMemo(() => {
    if (semanticResults !== null && !searchQuery.trim()) {
      // we have all 100 items from semantic search. Paginate them 20 at a time.
      const start = currentPageIndex * 20;
      return filteredItems.slice(start, start + 20);
    }
    // If we have a searchQuery, semantic search already returns top_k=20, so just show them all.
    // If semanticResults === null, we are relying on Firebase `currentPageItems` which is already just 20 items.
    return filteredItems;
  }, [filteredItems, semanticResults, searchQuery, currentPageIndex]);

  const hasNextPage = useMemo(() => {
    if (semanticResults !== null && !searchQuery.trim()) {
      return (currentPageIndex + 1) * 20 < filteredItems.length;
    }
    if (searchQuery.trim()) return false;
    return activeTab === 'ideas' ? hasMoreIdeas : hasMoreProjects;
  }, [semanticResults, searchQuery, currentPageIndex, filteredItems.length, activeTab, hasMoreIdeas, hasMoreProjects]);

  const isSearchActive = !!searchQuery.trim();

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
      <div className="flex items-center justify-between py-8 border-t border-border/50 mt-8">
        <Button 
          onClick={handlePrevPage}
          disabled={loading || currentPageIndex === 0}
          variant="outline"
          className="min-w-[120px] h-11"
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
          className="min-w-[120px] h-11"
        >
          Next
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </div>
    );
  };

  return (
    <AppShell>
      <div className="mb-10 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Global Network
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Discover</h1>
        <p className="text-muted-foreground mt-3 text-lg">Browse the latest ideas and projects from our global community.</p>
      </div>

      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto">
            <TabsList className="grid w-full grid-cols-2 md:w-[320px] p-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/50 rounded-xl shadow-sm">
              <TabsTrigger value="ideas" className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles size={16} />
                Ideas
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2 font-semibold text-sm">
                <Rocket size={16} />
                Projects
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={16} className="text-muted-foreground shrink-0" />
              <div className="w-full md:w-[160px] relative z-[45]">
                <CustomSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { label: 'Newest', value: 'newest' },
                    { label: 'Most Liked', value: 'likes' },
                    ...(user ? [{ label: 'Liked by Me', value: 'liked_by_me' }] : [])
                  ]}
                  placeholder="Sort by"
                />
              </div>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={18} />
              <input
                type="text"
                className="h-11 pl-11 pr-4 w-full bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all rounded-xl text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground shadow-sm"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {user && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                className="w-full md:w-auto h-11 px-6 shadow-none"
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
          <div className="py-24 bg-white/50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-border/50">
            <EmptyState
              icon={Search}
              title="No results found"
              text={
                sortBy === 'liked_by_me' 
                ? `You haven't liked any ${activeTab} on this page yet.`
                : `We couldn't find any ${activeTab} matching your search.`
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedItems.map((item) => {
              const isLikedByMe = user && item.likedBy?.includes(user.uid);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col h-full group cursor-pointer transition-all duration-300 hover:bg-white/80 dark:hover:bg-zinc-900/60 hover:-translate-y-1 shadow-sm hover:shadow-md"
                  onClick={() => setViewModalConfig({ open: true, item, type: activeTab })}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar size="sm" fallback={item.authorName?.[0] || '?'} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{item.authorName || 'Anonymous'}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{activeTab === 'ideas' ? 'Idea' : 'Project'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="text-[10px] font-semibold bg-black/5 dark:bg-white/5 border-border/50 text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags?.length > 2 && (
                        <span className="text-[10px] font-semibold text-muted-foreground">+{item.tags.length - 2}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                      <span className={cn("flex items-center gap-1.5 transition-colors", isLikedByMe && "text-red-400")}>
                        <Heart size={14} className={cn(isLikedByMe && "fill-current")} /> 
                        {item.upvotes || item.saves || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> 
                        {item.createdAt 
                          ? new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) 
                          : 'New'
                        }
                      </span>
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
          // Refresh the page data when modal closes to reflect like counts!
          loadPage(activeTab, currentPageIndex, true);
        }}
        item={viewModalConfig.item}
        type={viewModalConfig.type}
      />
    </AppShell>
  );
}
