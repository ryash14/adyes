/**
 * Content Service
 * Manage ideas and projects
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  serverTimestamp,
  startAfter,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import semanticSearchService from './semanticSearch';

class ContentService {
  /**
   * Create a new idea
   */
  async createIdea(userIdOrData, dataOrUndefined) {
    try {
      const ideaData = dataOrUndefined || userIdOrData;
      const userId = dataOrUndefined ? userIdOrData : ideaData.userId;
      const finalData = { ...ideaData, userId };
      
      console.log('Creating idea in Firebase:', finalData);
      
      // 1. Save to Firebase FIRST
      const ideasRef = collection(db, 'ideas');
      
      const status = finalData.mentorId ? 'pending_mentor' : 'published';
      
      const docRef = await addDoc(ideasRef, {
        ...finalData,
        type: 'idea',
        status: status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // 2. Sync with Semantic Search backend (non-blocking)
      semanticSearchService.submitContent('idea', {
        id: docRef.id,
        title: finalData.title,
        description: finalData.description,
        tags: finalData.tags || [],
        userId: userId,
        authorName: finalData.authorName || 'Anonymous',
        category: finalData.category || ''
      }).catch(err => console.warn('Failed to index idea for search:', err));
      
      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error creating idea:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Create a new project
   */
  async createProject(userIdOrData, dataOrUndefined) {
    try {
      const projectData = dataOrUndefined || userIdOrData;
      const userId = dataOrUndefined ? userIdOrData : projectData.userId;
      const finalData = { ...projectData, userId };
      
      console.log('Creating project in Firebase:', finalData);
      
      // 1. Save to Firebase FIRST
      const projectsRef = collection(db, 'projects');
      const docRef = await addDoc(projectsRef, {
        ...finalData,
        type: 'project',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // 2. Sync with Semantic Search backend (non-blocking)
      semanticSearchService.submitContent('project', {
        id: docRef.id,
        title: finalData.title,
        description: finalData.description,
        tags: finalData.tags || [],
        userId: userId,
        authorName: finalData.authorName || 'Anonymous',
        category: finalData.category || ''
      }).catch(err => console.warn('Failed to index project for search:', err));
      
      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error creating project:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get idea by ID
   */
  async getIdea(ideaId) {
    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      const ideaSnap = await getDoc(ideaRef);

      if (ideaSnap.exists()) {
        return { data: { id: ideaSnap.id, ...ideaSnap.data() }, error: null };
      }
      return { data: null, error: 'Idea not found' };
    } catch (error) {
      console.error('Error getting idea:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get pending ideas for a specific mentor
   */
  async getPendingIdeasForMentor(mentorId, limitCount = 50) {
    try {
      const ideasRef = collection(db, 'ideas');
      const q = query(
        ideasRef,
        where('mentorId', '==', mentorId),
        where('status', '==', 'pending_mentor'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });

      return { data: ideas, error: null };
    } catch (error) {
      console.error('Error getting pending ideas:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Update an idea's status (e.g. mentor accepts/rejects)
   */
  async updateIdeaStatus(ideaId, newStatus) {
    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      await updateDoc(ideaRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating idea status:', error);
      return { error: error.message };
    }
  }

  /**
   * Get project by ID
   */
  async getProject(projectId) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        return { data: { id: projectSnap.id, ...projectSnap.data() }, error: null };
      }
      return { data: null, error: 'Project not found' };
    } catch (error) {
      console.error('Error getting project:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get user's ideas
   */
  async getUserIdeas(userId, limitCount = 50) {
    try {
      const ideasRef = collection(db, 'ideas');
      const q = query(
        ideasRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });

      return { data: ideas, error: null };
    } catch (error) {
      console.error('Error getting user ideas:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get user's projects
   */
  async getUserProjects(userId, limitCount = 50) {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });

      return { data: projects, error: null };
    } catch (error) {
      console.error('Error getting user projects:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get all ideas (for discovery) - Only returns published ideas
   */
  async getAllIdeas(limitCount = 20, lastDoc = null) {
    try {
      const ideasRef = collection(db, 'ideas');
      let q = query(
        ideasRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount * 2) // Fetch extra to account for filtered out items
      );

      if (lastDoc) {
        q = query(
          ideasRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount * 2)
        );
      }

      const querySnapshot = await getDocs(q);
      let ideas = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out pending ideas locally to avoid requiring a composite index
        if (data.status !== 'pending_mentor') {
          ideas.push({ id: doc.id, ...data });
        }
      });
      // Trim to limitCount
      ideas = ideas.slice(0, limitCount);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data: ideas, lastDoc: lastVisible, error: null };
    } catch (error) {
      console.error('Error getting all ideas:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get all projects (for discovery)
   */
  async getAllProjects(limitCount = 20, lastDoc = null) {
    try {
      const projectsRef = collection(db, 'projects');
      let q = query(
        projectsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(
          projectsRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data: projects, lastDoc: lastVisible, error: null };
    } catch (error) {
      console.error('Error getting all projects:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get multiple documents by their IDs in parallel
   */
  async getDocumentsByIds(collectionName, ids) {
    if (!ids || ids.length === 0) return { data: [], error: null };
    try {
      const promises = ids.map(id => getDoc(doc(db, collectionName, id)));
      const snapshots = await Promise.all(promises);
      const docs = snapshots.filter(snap => snap.exists()).map(snap => ({ id: snap.id, ...snap.data() }));
      return { data: docs, error: null };
    } catch (error) {
      console.error('Error getting documents by ids:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Update idea
   */
  async updateIdea(ideaId, updates) {
    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      await updateDoc(ideaRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const result = await this.getIdea(ideaId);
      
      if (result.data) {
        semanticSearchService.submitContent('idea', {
          id: ideaId,
          title: result.data.title,
          description: result.data.description,
          tags: result.data.tags || [],
          userId: result.data.userId,
          authorName: result.data.authorName || 'Anonymous',
          category: result.data.category || ''
        }).catch(err => console.warn('Failed to update idea in search index:', err));
      }
      
      return result;
    } catch (error) {
      console.error('Error updating idea:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId, updates) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const result = await this.getProject(projectId);
      
      if (result.data) {
        semanticSearchService.submitContent('project', {
          id: projectId,
          title: result.data.title,
          description: result.data.description,
          tags: result.data.tags || [],
          userId: result.data.userId,
          authorName: result.data.authorName || 'Anonymous',
          category: result.data.category || ''
        }).catch(err => console.warn('Failed to update project in search index:', err));
      }
      
      return result;
    } catch (error) {
      console.error('Error updating project:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Toggle Like
   */
  async toggleLike(collectionType, itemId, userId) {
    try {
      const docRef = doc(db, collectionType, itemId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return { data: null, error: 'Item not found' };
      }

      const itemData = docSnap.data();
      const likedBy = itemData.likedBy || [];
      const isLiked = likedBy.includes(userId);

      const newLikedBy = isLiked
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId];

      const upvotes = Math.max(0, (itemData.upvotes || itemData.saves || 0) + (isLiked ? -1 : 1));

      await updateDoc(docRef, {
        likedBy: newLikedBy,
        upvotes: upvotes,
      });

      return { data: { upvotes, likedBy: newLikedBy, isLiked: !isLiked }, error: null };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Delete idea
   */
  async deleteIdea(ideaId) {
    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      await deleteDoc(ideaRef);
      semanticSearchService.deleteContent('idea', ideaId).catch(err => console.warn('Failed to delete idea from search index', err));
      return { error: null };
    } catch (error) {
      console.error('Error deleting idea:', error);
      return { error: error.message };
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      semanticSearchService.deleteContent('project', projectId).catch(err => console.warn('Failed to delete project from search index', err));
      return { error: null };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { error: error.message };
    }
  }

  /**
   * Search ideas by tags or keywords
   */
  async searchIdeas(tags = [], limitCount = 50) {
    try {
      const ideasRef = collection(db, 'ideas');
      let q;

      if (tags.length > 0) {
        q = query(
          ideasRef,
          where('tags', 'array-contains-any', tags),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          ideasRef,
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });

      return { data: ideas, error: null };
    } catch (error) {
      console.error('Error searching ideas:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Search projects by tags or keywords
   */
  async searchProjects(tags = [], limitCount = 50) {
    try {
      const projectsRef = collection(db, 'projects');
      let q;

      if (tags.length > 0) {
        q = query(
          projectsRef,
          where('tags', 'array-contains-any', tags),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          projectsRef,
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });

      return { data: projects, error: null };
    } catch (error) {
      console.error('Error searching projects:', error);
      return { data: [], error: error.message };
    }
  }
}

export const contentService = new ContentService();
export default contentService;
