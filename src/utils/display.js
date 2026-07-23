const ROLE_LABELS = {
  student: 'Student',
  professional: 'Professional',
  entrepreneur: 'Entrepreneur',
  mentor: 'Mentor',
};

export function formatRole(role) {
  if (!role) return 'Member';
  return ROLE_LABELS[role] || role.charAt(0).toUpperCase() + role.slice(1);
}

export function getDisplayName(user) {
  if (!user) return 'Unknown';
  const name = user.displayName?.trim();
  if (name) return name;
  if (user.email) return user.email.split('@')[0];
  return 'Unknown';
}
