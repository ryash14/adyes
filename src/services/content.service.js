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
import { semanticSearchService } from './semanticSearch';

class ContentService {
  /**
   * Create a new idea
   */
  async createIdea(userIdOrData, dataOrUndefined) {
    try {
      const ideaData = dataOrUndefined || userIdOrData;
      const userId = dataOrUndefined ? userIdOrData : ideaData.userId;
      const finalData = { ...ideaData, userId };
      
      console.log('Creating idea with data:', finalData);
      
      try {
        const res = await semanticSearchService.submitContent('ideas', finalData);
        return { data: { id: res.id }, error: null };
      } catch (err) {
        console.warn('Semantic search API failed, falling back to Firebase', err);
        const ideasRef = collection(db, 'ideas');
        const docRef = await addDoc(ideasRef, {
          ...finalData,
          type: 'idea',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { data: { id: docRef.id }, error: null };
      }
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
      
      console.log('Creating project with data:', finalData);
      
      try {
        const res = await semanticSearchService.submitContent('projects', finalData);
        return { data: { id: res.id }, error: null };
      } catch (err) {
        console.warn('Semantic search API failed, falling back to Firebase', err);
        const projectsRef = collection(db, 'projects');
        const docRef = await addDoc(projectsRef, {
          ...finalData,
          type: 'project',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { data: { id: docRef.id }, error: null };
      }
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
   * Get all ideas (for discovery)
   */
  async getAllIdeas(limitCount = 20, lastDoc = null) {
    try {
      const ideasRef = collection(db, 'ideas');
      let q = query(
        ideasRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(
          ideasRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });

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
