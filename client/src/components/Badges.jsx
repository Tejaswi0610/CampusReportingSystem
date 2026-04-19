export function StatusBadge({ status }) {
  const cls = status === 'Pending' ? 'badge-pending' : status === 'In Progress' ? 'badge-progress' : 'badge-resolved';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function RoleBadge({ role }) {
  return <span className={`badge badge-${role}`}>{role}</span>;
}
