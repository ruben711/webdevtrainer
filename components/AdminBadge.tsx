import { Icon } from "@/components/Icon";

/* Clean glossy gold "ADMIN" badge with a crown + a periodic shine sweep.
   Pure CSS (styles-extras: .admin-badge), no emoji. */
export function AdminBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="admin-badge" title="Beheerder">
      <Icon name="crown" size={compact ? 10 : 11} fill />
      {!compact && <span>ADMIN</span>}
    </span>
  );
}
