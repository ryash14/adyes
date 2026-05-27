/**
 * Connection Service
 * Manage user connections and network
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  or,
  and,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

class ConnectionService {
  constructor() {
    this.collectionName = 'connections';
  }

  /**
   * Send connection request
   */
  async sendRequest(fromUserId, toUserId, note = '') {
    try {
      // Check if connection already exists
      const existing = await this.getConnection(fromUserId, toUserId);
      if (existing.data) {
        return { data: null, error: 'Connection already exists' };
      }

      const connectionsRef = collection(db, this.collectionName);
      const docRef = await addDoc(connectionsRef, {
        fromUserId,
        toUserId,
        status: 'pending',
        note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error sending connection request:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Accept connection request
   */
  async acceptRequest(connectionId) {
    try {
      console.log('Accepting connection:', connectionId);
      const connectionRef = doc(db, this.collectionName, connectionId);
      await updateDoc(connectionRef, {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });

      console.log('Connection accepted successfully');
      return { error: null };
    } catch (error) {
      console.error('Error accepting connection:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Reject connection request
   */
  async rejectRequest(connectionId) {
    try {
      console.log('Rejecting connection:', connectionId);
      const connectionRef = doc(db, this.collectionName, connectionId);
      await deleteDoc(connectionRef);
      console.log('Connection rejected successfully');
      return { error: null };
    } catch (error) {
      console.error('Error rejecting connection:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Remove connection
   */
  async removeConnection(connectionId) {
    try {
      const connectionRef = doc(db, this.collectionName, connectionId);
      await deleteDoc(connectionRef);
      return { error: null };
    } catch (error) {
      console.error('Error removing connection:', error);
      return { error: error.message };
    }
  }

  /**
   * Get connection between two users
   */
  async getConnection(userId1, userId2) {
    try {
      const connectionsRef = collection(db, this.collectionName);
      const q = query(
        connectionsRef,
        or(
          and(where('fromUserId', '==', userId1), where('toUserId', '==', userId2)),
          and(where('fromUserId', '==', userId2), where('toUserId', '==', userId1))
        )
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { data: { id: doc.id, ...doc.data() }, error: null };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Error getting connection:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get user's connections
   */
  async getUserConnections(userId) {
    try {
      const connectionsRef = collection(db, this.collectionName);
      
      // Fix: Wrap multiple filters in and()
      const q = query(
        connectionsRef,
        and(
          or(
            where('fromUserId', '==', userId),
            where('toUserId', '==', userId)
          ),
          where('status', '==', 'accepted')
        )
      );

      const querySnapshot = await getDocs(q);
      const connections = [];
      querySnapshot.forEach((doc) => {
        connections.push({ id: doc.id, ...doc.data() });
      });

      return { data: connections, error: null };
    } catch (error) {
      console.error('Error getting user connections:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get pending requests for user
   */
  async getPendingRequests(userId) {
    try {
      const connectionsRef = collection(db, this.collectionName);
      const q = query(
        connectionsRef,
        where('toUserId', '==', userId),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      return { data: requests, error: null };
    } catch (error) {
      console.error('Error getting pending requests:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Get sent requests by user
   */
  async getSentRequests(userId) {
    try {
      const connectionsRef = collection(db, this.collectionName);
      const q = query(
        connectionsRef,
        where('fromUserId', '==', userId),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      return { data: requests, error: null };
    } catch (error) {
      console.error('Error getting sent requests:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Set connection alias (nickname)
   */
  async setConnectionAlias(connectionId, userId, alias) {
    try {
      const connectionRef = doc(db, this.collectionName, connectionId);
      await updateDoc(connectionRef, {
        [`aliases.${userId}`]: alias
      });
      return { error: null };
    } catch (error) {
      console.error('Error setting alias:', error);
      return { error: error.message };
    }
  }
}

export const connectionService = new ConnectionService();
export default connectionService;
