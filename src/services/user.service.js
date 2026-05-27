/**
 * User Service
 * Clean abstraction over Firestore user operations
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

class UserService {
  constructor() {
    this.collectionName = 'users';
  }

  /**
   * Create a new user document
   */
  async createUser(userId, userData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await setDoc(userRef, {
        ...userData,
        isProfileComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: error.message };
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { data: { id: userSnap.id, ...userSnap.data() }, error: null };
      }
      return { data: null, error: 'User not found' };
    } catch (error) {
      console.error('Error getting user:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId, updates) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      // Fetch updated user
      const result = await this.getUser(userId);
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Complete user profile setup
   */
  async completeProfile(userId, profileData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        ...profileData,
        isProfileComplete: true,
        updatedAt: serverTimestamp(),
      });
      
      const result = await this.getUser(userId);
      return result;
    } catch (error) {
      console.error('Error completing profile:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update user presence status
   */
  async updatePresence(userId, status) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        status,
        lastActive: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating presence:', error);
      return { error: error.message };
    }
  }

  /**
   * Search users by various criteria
   */
  async searchUsers(searchTerm, filters = {}) {
    try {
      const usersRef = collection(db, this.collectionName);
      let q = query(usersRef, where('isProfileComplete', '==', true));

      // Apply filters
      if (filters.role) {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters.college) {
        q = query(q, where('college', '==', filters.college));
      }
      if (filters.skills && filters.skills.length > 0) {
        q = query(q, where('skills', 'array-contains-any', filters.skills));
      }

      q = query(q, limit(50));

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      // Client-side filtering for name search
      let filteredUsers = users;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = users.filter(user => 
          user.displayName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.bio?.toLowerCase().includes(term)
        );
      }

      return { data: filteredUsers, error: null };
    } catch (error) {
      console.error('Error searching users:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role, limitCount = 20) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where('role', '==', role),
        where('isProfileComplete', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return { data: users, error: null };
    } catch (error) {
      console.error('Error getting users by role:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get recent users
   */
  async getRecentUsers(limitCount = 20) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where('isProfileComplete', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return { data: users, error: null };
    } catch (error) {
      console.error('Error getting recent users:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get all users (for discovery)
   */
  async getAllUsers(limitCount = 50) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where('isProfileComplete', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return { data: users, error: null };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { data: [], error: error.message };
    }
  }
}

export const userService = new UserService();
export default userService;
