import {
  format,
  isToday,
  isYesterday,
  isSameYear,
  isValid,
} from 'date-fns';

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value.toDate === 'function') {
    const d = value.toDate();
    return isValid(d) ? d : null;
  }
  const d = new Date(value);
  return isValid(d) ? d : null;
}

export function formatDateDivider(date) {
  if (!date) return 'Earlier';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isSameYear(date, new Date())) return format(date, 'MMMM d');
  return format(date, 'MMMM d, yyyy');
}

export function formatMessageTimestamp(dateValue) {
  const date = toDate(dateValue);
  if (!date) {
    return { timeStr: 'Just now', iso: '' };
  }
  const iso = date.toISOString();
  if (isToday(date)) {
    return { timeStr: format(date, 'h:mm a'), iso };
  }
  if (isYesterday(date)) {
    return { timeStr: `Yesterday · ${format(date, 'h:mm a')}`, iso };
  }
  if (isSameYear(date, new Date())) {
    return { timeStr: format(date, 'MMM d · h:mm a'), iso };
  }
  return { timeStr: format(date, 'MMM d, yyyy · h:mm a'), iso };
}

export function buildMessageTimeline(messages) {
  if (!Array.isArray(messages)) return [];
  const groups = [];
  let currentGroup = null;

  for (const message of messages) {
    const date = toDate(message.createdAt);
    const dayKey = date ? format(date, 'yyyy-MM-dd') : 'unknown';

    if (!currentGroup || currentGroup.dayKey !== dayKey) {
      currentGroup = {
        dayKey,
        date: dayKey, // Used for the key prop
        dateLabel: formatDateDivider(date),
        messages: []
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  }

  return groups;
}
