import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/user.service';
import { contentService } from '../services/content.service';
import { connectionService } from '../services/connection.service';
import { UserPlus, MessageSquare, Edit3, Trash2, Briefcase, GraduationCap, MapPin, Lightbulb, Rocket, Plus, Globe, FileText } from 'lucide-react';
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import AppShell from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ContentModal from '../components/ContentModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { formatRole } from '../utils/display';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ open: false, type: 'idea', item: null });
  const [deleteModalConfig, setDeleteModalConfig] = useState({ open: false, type: '', item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnProfile = user?.uid === userId;

  const loadProfile = useCallback(async () => {
    try {
      const [profileRes, ideasRes, projectsRes] = await Promise.all([
        userService.getUser(userId),
        contentService.getUserIdeas(userId),
        contentService.getUserProjects(userId),
      ]);
      setProfile(profileRes.data);
      setIdeas(ideasRes.data || []);
      setProjects(projectsRes.data || []);

      if (user && !isOwnProfile) {
        const connRes = await connectionService.getConnection(user.uid, userId);
        if (connRes.data) {
          setConnectionStatus(connRes.data);
        } else {
          setConnectionStatus(null);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, user, isOwnProfile]);

  useEffect(() => {
    if (!userId) return;
    Promise.resolve().then(loadProfile);
  }, [userId, loadProfile]);

  const handleConnect = async () => {
    if (!user) return;
    try {
      setConnectionStatus({ status: 'pending', fromUserId: user.uid });
      await connectionService.sendRequest(user.uid, userId);
      loadProfile();
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const openModal = (type, item = null) => {
    setModalConfig({ open: true, type, item });
  };

  const handleDeleteConfirm = async () => {
    const { type, item } = deleteModalConfig;
    if (!item) return;

    setIsDeleting(true);
    try {
      const deleteFn = type === 'idea' ? contentService.deleteIdea.bind(contentService) : contentService.deleteProject.bind(contentService);
      const res = await deleteFn(item.id);
      
      if (!res.error) {
        toast.success('Successfully deleted!');
        setDeleteModalConfig({ open: false, type: '', item: null });
        loadProfile();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <PageContainer><LoadingState /></PageContainer>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <PageContainer>
          <div className="bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 dark:border-white/10 py-24 rounded-3xl shadow-sm">
            <EmptyState icon={MapPin} title="Profile not found" text="This profile may have been removed or is unavailable." />
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  const initials = profile.displayName?.charAt(0).toUpperCase() || '?';

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto pb-20 pt-10">
        {/* Next.js-style Hero Header */}
        <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-12 border border-border/50 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors duration-500" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 justify-between relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-8">
              <Avatar 
                src={profile.photoURL} 
                fallback={initials} 
                size="xl" 
                className="w-28 h-28 md:w-32 md:h-32 ring-4 ring-zinc-950 border border-white/10 shadow-2xl" 
              />
              <div className="space-y-4 text-center sm:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{profile.displayName}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 text-foreground shadow-sm">
                    <Briefcase size={16} className="text-accent" />
                    <span>{formatRole(profile.role)}</span>
                  </div>
                  {profile.college && (
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 text-foreground shadow-sm">
                      <GraduationCap size={16} className="text-accent" />
                      <span>{profile.college}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/50 dark:border-white/10 text-foreground shadow-sm">
                      <MapPin size={16} className="text-accent" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto mt-6 md:mt-0">
              <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent transition-colors shadow-sm" title="GitHub">
                    <GitHubLogoIcon width={20} height={20} />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent transition-colors shadow-sm" title="LinkedIn">
                    <LinkedInLogoIcon width={20} height={20} />
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent transition-colors shadow-sm" title="Twitter">
                    <TwitterLogoIcon width={20} height={20} />
                  </a>
                )}
                {(profile.portfolio || profile.socialLinks?.portfolio) && (
                  <a href={profile.portfolio || profile.socialLinks?.portfolio} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent transition-colors shadow-sm" title="Portfolio">
                    <Globe width={20} height={20} />
                  </a>
                )}
                {profile.resumeURL && (
                  <a href={profile.resumeURL} target="_blank" rel="noreferrer" className="inline-flex h-11 px-4 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent transition-colors font-semibold text-xs shadow-sm" title="View Resume">
                    <FileText width={16} height={16} className="mr-2" />
                    Resume
                  </a>
                )}
              </div>

              {isOwnProfile ? (
                <Button 
                  variant="primary"
                  className="h-11 px-5 rounded-xl group flex items-center justify-center overflow-hidden transition-all duration-300 w-full sm:w-auto" 
                  onClick={() => navigate('/settings')}
                  title="Edit Profile"
                >
                  <Edit3 size={16} className="mr-2 shrink-0" />
                  <span className="whitespace-nowrap font-semibold">
                    Edit Profile
                  </span>
                </Button>
              ) : (
                <>
                  {!connectionStatus && (
                    <Button variant="primary" className="h-11 w-full sm:w-auto" onClick={handleConnect}>
                      <UserPlus size={16} className="mr-2" /> Connect
                    </Button>
                  )}
                  {connectionStatus?.status === 'pending' && (
                    <Button variant="outline" className="h-11 w-full sm:w-auto opacity-70" disabled>
                      Request Sent
                    </Button>
                  )}
                  {connectionStatus?.status === 'accepted' && (
                    <Button variant="outline" className="h-11 w-full sm:w-auto hover:bg-white/10" onClick={() => navigate(`/messages/${userId}`)}>
                      <MessageSquare size={16} className="mr-2" /> Message
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {profile.bio && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">About</h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed p-6 bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-border/50 dark:border-white/10 shadow-sm">{profile.bio}</p>
              </section>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">Ideas</h3>
                  <Lightbulb size={20} className="text-accent" />
                </div>
                {isOwnProfile && (
                  <Button variant="outline" className="h-10 px-4 text-xs" onClick={() => openModal('idea')}>
                    <Plus size={16} className="mr-2" /> New Idea
                  </Button>
                )}
              </div>
              
              <div className="grid gap-6">
                {ideas.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900/30 p-12 rounded-2xl border border-border/50 dark:border-white/10 border-dashed text-center text-sm font-semibold text-muted-foreground flex flex-col items-center justify-center gap-4">
                    <Lightbulb size={32} className="text-muted-foreground/50" />
                    No ideas shared yet.
                  </div>
                ) : (
                  ideas.map((idea) => (
                    <div key={idea.id} className="bg-white dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 dark:border-white/10 shadow-sm space-y-4 relative group transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-xl font-bold tracking-tight text-foreground">{idea.title}</h4>
                        {isOwnProfile && (
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-2 bg-white/5 text-muted-foreground hover:text-accent hover:bg-white/10 rounded-xl shrink-0 border border-white/10" 
                              title="Edit idea"
                              onClick={() => openModal('idea', idea)}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              className="p-2 bg-white/5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0 border border-white/10" 
                              title="Delete idea"
                              onClick={() => setDeleteModalConfig({ open: true, type: 'idea', item: idea })}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{idea.description}</p>
                      {idea.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {idea.tags.map((t) => (
                            <Badge key={t} className="text-[10px] font-semibold bg-white/5 border-white/10 text-muted-foreground">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">Projects</h3>
                  <Rocket size={20} className="text-accent" />
                </div>
                {isOwnProfile && (
                  <Button variant="outline" className="h-10 px-4 text-xs" onClick={() => openModal('project')}>
                    <Plus size={16} className="mr-2" /> New Project
                  </Button>
                )}
              </div>
              
              <div className="grid gap-6">
                {projects.length === 0 ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900/30 p-12 rounded-2xl border border-border/50 dark:border-white/10 border-dashed text-center text-sm font-semibold text-muted-foreground flex flex-col items-center justify-center gap-4">
                    <Rocket size={32} className="text-muted-foreground/50" />
                    No active projects.
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 dark:border-white/10 shadow-sm space-y-4 relative group transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-xl font-bold tracking-tight text-foreground">{project.title}</h4>
                        {isOwnProfile && (
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-2 bg-white/5 text-muted-foreground hover:text-accent hover:bg-white/10 rounded-xl shrink-0 border border-white/10" 
                              title="Edit project"
                              onClick={() => openModal('project', project)}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              className="p-2 bg-white/5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0 border border-white/10" 
                              title="Delete project"
                              onClick={() => setDeleteModalConfig({ open: true, type: 'project', item: project })}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{project.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {profile.skills?.length > 0 && (
              <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-border/50 dark:border-white/10 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-foreground border-b border-white/10 pb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} className="text-xs font-semibold bg-white/5 border-white/10 text-foreground py-1.5 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-border/50 dark:border-white/10 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-foreground border-b border-border/50 dark:border-white/10 pb-3">Activity Snapshot</h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-muted-foreground flex items-center gap-3"><Lightbulb size={16} className="text-accent" /> Ideas</span>
                  <span className="font-bold text-xl text-foreground">{ideas.length}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-muted-foreground flex items-center gap-3"><Rocket size={16} className="text-accent" /> Projects</span>
                  <span className="font-bold text-xl text-foreground">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-3"><Briefcase size={16} className="text-accent" /> Collabs</span>
                  <span className="font-bold text-xl text-foreground">{projects.length + ideas.length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {modalConfig.open && (
          <ContentModal
            open={modalConfig.open}
            onClose={() => setModalConfig({ ...modalConfig, open: false })}
            type={modalConfig.type}
            item={modalConfig.item}
            userId={profile?.id}
            onSaved={loadProfile}
          />
        )}

        {deleteModalConfig.open && (
          <DeleteConfirmationModal
            open={deleteModalConfig.open}
            onClose={() => setDeleteModalConfig({ ...deleteModalConfig, open: false })}
            onConfirm={handleDeleteConfirm}
            itemName={deleteModalConfig.item?.title}
            type={deleteModalConfig.type}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </AppShell>
  );
}
