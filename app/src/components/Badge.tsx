import type { ReviewStatus } from "../lib/types";
import type { Release, Review } from "../lib/types";

const LABELS: Record<ReviewStatus, string> = {
  "not-checked": "Not checked",
  waiting: "Waiting",
  "needs-fix": "Needs fix",
  approved: "Approved",
};

/** The word shown on a comment's badge. After the developer fixed it, the designer sees Resolved or Not resolved. */
export function pinStatusLabel(pin: {
  status: ReviewStatus;
  earlier?: boolean;
  sent: boolean;
}): string | undefined {
  if (pin.earlier || pin.status === "approved") return "Resolved";
  if (pin.status === "not-checked" && pin.sent) return "Not resolved";
  return undefined;
}

/** Review status badge. The word is the information. Color is extra. */
export function StatusBadge({
  status,
  label,
  note,
}: {
  status: ReviewStatus;
  label?: string;
  note?: string;
}) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {label ?? LABELS[status]}
      {note ? <span className="badge-note">· {note}</span> : null}
    </span>
  );
}

const RELEASE_LABELS: Record<Release, string> = {
  "not-merged": "Not merged",
  merged: "Merged",
  deployed: "Deployed",
};

/** Where approved work is in release. Outlined, no color, so it is never mixed up with review status. */
export function ReleaseBadge({ release }: { release: Release }) {
  return (
    <span className={`badge badge-release badge-release-${release}`}>
      {RELEASE_LABELS[release]}
    </span>
  );
}

/** Who the review waits on. Shown on the right of a feature row in the left sidebar. */
export function PhaseBadge({ review }: { review: Review }) {
  const done = review.stage === "approved";
  const label = done
    ? "Approved"
    : review.phase === "designer"
      ? "Waiting"
      : "In development";
  const kind = done
    ? "approved"
    : review.phase === "designer"
      ? "not-checked"
      : "waiting";
  return <span className={`badge badge-${kind}`}>{label}</span>;
}
