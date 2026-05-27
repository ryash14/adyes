/**
 * Message Service
 * Real-time messaging functionality
 */

import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  or,
  and,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

class MessageService {
  constructor() {
    this.collectionName = 'messages';
  }

  /**
   * Send a message
   */
  async sendMessage(fromUserId, toUserId, payload) {
    try {
      const data = typeof payload === 'string' ? { content: payload } : payload || {};
      const { content = '', attachments = [] } = data;

      const messagesRef = collection(db, this.collectionName);
      const docRef = await addDoc(messagesRef, {
        fromUserId,
        toUserId,
        content,
        attachments,
        read: false,
        createdAt: serverTimestamp(),
      });

      // Update the connection's lastMessageAt
      import('./connection.service').then(({ connectionService }) => {
        connectionService.getConnection(fromUserId, toUserId).then(({ data: connection }) => {
          if (connection) {
            updateDoc(doc(db, 'connections', connection.id), {
              lastMessageAt: serverTimestamp()
            }).catch(e => console.error('Error updating connection lastMessageAt', e));
          }
        });
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get messages between two users
   */
  async getMessages(userId1, userId2, limitCount = 100) {
    try {
      const messagesRef = collection(db, this.collectionName);
      const q = query(
        messagesRef,
        or(
          and(where('fromUserId', '==', userId1), where('toUserId', '==', userId2)),
          and(where('fromUserId', '==', userId2), where('toUserId', '==', userId1))
        ),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });

      return { data: messages, error: null };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Subscribe to messages between two users (real-time)
   */
  subscribeToMessages(userId1, userId2, callback) {
    try {
      const messagesRef = collection(db, this.collectionName);
      const q = query(
        messagesRef,
        or(
          and(where('fromUserId', '==', userId1), where('toUserId', '==', userId2)),
          and(where('fromUserId', '==', userId2), where('toUserId', '==', userId1))
        ),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return () => {};
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    try {
      const messageRef = doc(db, this.collectionName, messageId);
      await updateDoc(messageRef, {
        read: true,
      });

      return { error: null };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { error: error.message };
    }
  }

  /**
   * Mark all messages from a user as read
   */
  async markAllAsRead(fromUserId, toUserId) {
    try {
      const messagesRef = collection(db, this.collectionName);
      const q = query(
        messagesRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = [];
      
      querySnapshot.forEach((doc) => {
        updatePromises.push(
          updateDoc(doc.ref, { read: true })
        );
      });

      await Promise.all(updatePromises);
      return { error: null };
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      return { error: error.message };
    }
  }

  /**
   * Get unread message count for user
   */
  async getUnreadCount(userId) {
    try {
      const messagesRef = collection(db, this.collectionName);
      const q = query(
        messagesRef,
        where('toUserId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      return { data: querySnapshot.size, error: null };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { data: 0, error: error.message };
    }
  }

  /**
   * Get recent conversations for user
   */
  async getConversations(userId) {
    try {
      const messagesRef = collection(db, this.collectionName);
      const q = query(
        messagesRef,
        or(
          where('fromUserId', '==', userId),
          where('toUserId', '==', userId)
        ),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const conversationsMap = new Map();

      querySnapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() };
        const otherUserId = message.fromUserId === userId ? message.toUserId : message.fromUserId;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            lastMessage: message,
            unreadCount: 0,
          });
        }

        // Count unread messages
        if (message.toUserId === userId && !message.read) {
          const conv = conversationsMap.get(otherUserId);
          conv.unreadCount++;
        }
      });

      return { data: Array.from(conversationsMap.values()), error: null };
    } catch (error) {
      console.error('Error getting conversations:', error);
      return { data: [], error: error.message };
    }
  }

  async deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, this.collectionName, messageId));
      return { error: null };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { error: error.message };
    }
  }

  async editMessage(messageId, content) {
    try {
      await updateDoc(doc(db, this.collectionName, messageId), {
        content,
        editedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error editing message:', error);
      return { error: error.message };
    }
  }
}

export const messageService = new MessageService();
export default messageService;
