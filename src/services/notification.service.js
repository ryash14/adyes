/**
 * Notification Service
 * Aggregates real-time notifications from Firestore (connections + messages)
 */

import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { userService } from './user.service';

export const NOTIFICATION_TYPES = {
  CONNECTION: 'connection_request',
  MESSAGE: 'message',
};

class NotificationService {
  constructor() {
    this.userNameCache = new Map();
  }

  async resolveDisplayName(userId) {
    if (this.userNameCache.has(userId)) {
      return this.userNameCache.get(userId);
    }
    const { data } = await userService.getUser(userId);
    const name = data?.displayName || 'Someone';
    this.userNameCache.set(userId, name);
    return name;
  }

  /**
   * Subscribe to live notifications for a user
   */
  subscribe(userId, callback) {
    if (!userId) {
      callback([]);
      return () => {};
    }

    let connectionItems = [];
    let messageItems = [];

    const emit = () => {
      const merged = [...connectionItems, ...messageItems].sort(
        (a, b) => (b.timestamp?.getTime?.() ?? 0) - (a.timestamp?.getTime?.() ?? 0)
      );
      callback(merged);
    };

    const connectionsQuery = query(
      collection(db, 'connections'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending')
    );

    const unsubscribeConnections = onSnapshot(
      connectionsQuery,
      async (snapshot) => {
        connectionItems = await Promise.all(
          snapshot.docs.map(async (connectionDoc) => {
            const data = connectionDoc.data();
            const name = await this.resolveDisplayName(data.fromUserId);
            return {
              id: `conn-${connectionDoc.id}`,
              sourceId: connectionDoc.id,
              type: NOTIFICATION_TYPES.CONNECTION,
              title: 'Connection request',
              message: `${name} wants to connect with you`,
              timestamp: data.createdAt?.toDate?.() ?? new Date(),
              read: false,
              href: '/network',
            };
          })
        );
        emit();
      },
      (error) => {
        console.error('Notification connection subscription error:', error);
        connectionItems = [];
        emit();
      }
    );

    const messagesQuery = query(
      collection(db, 'messages'),
      where('toUserId', '==', userId),
      where('read', '==', false),
      limit(30)
    );

    const unsubscribeMessages = onSnapshot(
      messagesQuery,
      async (snapshot) => {
        const docs = snapshot.docs
          .map((messageDoc) => ({ id: messageDoc.id, ...messageDoc.data() }))
          .sort(
            (a, b) =>
              (b.createdAt?.toDate?.()?.getTime?.() ?? 0) -
              (a.createdAt?.toDate?.()?.getTime?.() ?? 0)
          );

        messageItems = await Promise.all(
          docs.map(async (message) => {
            const name = await this.resolveDisplayName(message.fromUserId);
            const preview = (message.content || '').trim();
            return {
              id: `msg-${message.id}`,
              sourceId: message.id,
              type: NOTIFICATION_TYPES.MESSAGE,
              title: 'New message',
              message: preview ? `${name}: ${preview}` : `New message from ${name}`,
              timestamp: message.createdAt?.toDate?.() ?? new Date(),
              read: false,
              href: `/messages/${message.fromUserId}`,
            };
          })
        );
        emit();
      },
      (error) => {
        console.error('Notification message subscription error:', error);
        messageItems = [];
        emit();
      }
    );

    return () => {
      unsubscribeConnections();
      unsubscribeMessages();
      this.userNameCache.clear();
    };
  }

  async markAsRead(notification) {
    if (!notification) return { error: null };
    try {
      if (notification.type === NOTIFICATION_TYPES.MESSAGE) {
        await updateDoc(doc(db, 'messages', notification.sourceId), { read: true });
      }
      return { error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error: error.message };
    }
  }

  async markAllAsRead(userId) {
    try {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('toUserId', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(messagesQuery);
      await Promise.all(snapshot.docs.map((d) => updateDoc(d.ref, { read: true })));
      return { error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { error: error.message };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
