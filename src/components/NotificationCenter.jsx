import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, UserPlus, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { notificationService, NOTIFICATION_TYPES } from '../services/notification.service';

const ICON_BY_TYPE = {
  [NOTIFICATION_TYPES.CONNECTION]: UserPlus,
  [NOTIFICATION_TYPES.MESSAGE]: MessageCircle,
};

function formatTimestamp(date) {
  if (!date) return '';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function NotificationCenter({ placement = 'above' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const unsubscribe = notificationService.subscribe(user.uid, (items) => {
      setNotifications(items);
    });

    return unsubscribe;
  }, [user?.uid]);

  const positionPanel = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = Math.min(352, window.innerWidth - 32);
    const panelHeight = Math.min(416, window.innerHeight - 24);
    const gap = 8;

    let top;
    let bottom;
    let left = rect.right - panelWidth;

    if (placement === 'above') {
      bottom = window.innerHeight - rect.top + gap;
    } else {
      top = Math.min(window.innerHeight - panelHeight - 12, rect.bottom + gap);
    }

    if (window.innerWidth <= 768) {
      top = Math.max(12, 56);
      setPanelStyle({
        top: `${top}px`,
        right: '16px',
        left: '16px',
        width: 'auto',
        maxHeight: `min(22rem, calc(100dvh - ${top + 16}px))`,
      });
      return;
    }

    if (left < 12) {
      left = 12; // Prevent going off-screen to the left
    }

    setPanelStyle({
      ...(placement === 'above' ? { bottom: `${bottom}px` } : { top: `${top}px` }),
      left: `${left}px`,
      width: `${panelWidth}px`,
      maxHeight: `${panelHeight}px`,
    });
  }, [placement]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onResize = () => positionPanel();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [isOpen, positionPanel]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const currentNotifications = user?.uid ? (notifications ?? []) : [];
  const isLoading = Boolean(user?.uid) && notifications === null;
  const unreadCount = currentNotifications.filter((n) => !n.read).length;

  const handleSelect = async (notification) => {
    await notificationService.markAsRead(notification);
    setIsOpen(false);
    if (notification.href) navigate(notification.href);
  };

  const handleMarkAllRead = async () => {
    if (!user?.uid) return;
    await notificationService.markAllAsRead(user.uid);
  };

  const panel = isOpen ? (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/10"
        onClick={() => setIsOpen(false)}
        aria-label="Close notifications"
      />
      <div
        className="fixed z-50 rounded-lg border border-border bg-card shadow-lg"
        style={panelStyle}
        role="dialog"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border border-border bg-secondary px-1 text-[10px] font-semibold text-muted-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={handleMarkAllRead} className="btn btn-ghost btn-sm">
              <Check size={14} strokeWidth={1.75} />
              Mark all
            </button>
          )}
        </div>
        <div className="max-h-[22rem] overflow-y-auto">
          {isLoading ? (
            <div className="p-8">
              <div className="h-6 w-6 rounded-full border-2 border-border border-t-foreground/70 animate-spin mx-auto" />
            </div>
          ) : currentNotifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted-foreground">
              <Bell size={20} strokeWidth={1.5} />
              <p>No notifications yet</p>
            </div>
          ) : (
            currentNotifications.map((notification) => {
              const Icon = ICON_BY_TYPE[notification.type] || Bell;
              return (
                <button
                  key={notification.id}
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  onClick={() => handleSelect(notification)}
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">{notification.title}</span>
                      {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{notification.message}</div>
                    <div className="text-[11px] text-muted-foreground">{formatTimestamp(notification.timestamp)}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((open) => {
            const next = !open;
            if (!open) {
              requestAnimationFrame(() => positionPanel());
            }
            return next;
          });
        }}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground${isOpen ? ' ring-2 ring-ring ring-offset-2 ring-offset-background' : ''}`}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell size={18} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span 
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent border-2 border-background text-[9px] font-bold text-white"
            aria-hidden
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {panel && createPortal(panel, document.body)}
    </>
  );
}

export default memo(NotificationCenter);
