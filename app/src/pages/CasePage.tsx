import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ReleaseBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { CaseSelect } from "../components/CaseSelect";
import { CommitInfo } from "../components/CommitInfo";
import { Icon } from "../components/Icon";
import { Dialog } from "../components/Dialog";
import { EmptyState } from "../components/EmptyState";
import { FeedbackList } from "../components/FeedbackList";
import {
  PreviewStage,
  type Location,
  type StageUi,
} from "../components/PreviewStage";
import { ReviewActions } from "../components/ReviewActions";
import {
  usePageTitle,
  useRightSidebar,
  useShell,
} from "../components/ShellContext";
import { useToast } from "../components/Toast";
import { PEOPLE } from "../lib/data";
import {
  caseLabel,
  caseParts,
  firstCaseId,
  isRecheck,
  livePins,
  plural,
  visiblePins,
} from "../lib/selectors";
import { useApp, useReview } from "../lib/store";
import type { CaseItem, Pin, Review } from "../lib/types";

/** /review/:id/cases/:caseId — the case screen. Checks what the review state allows, then shows it. */
/** Whether the preview is full screen. Kept here so it survives a move to another case. */
let keepFullscreen = false;

export function CasePage() {
  const { id, caseId } = useParams();
  const review = useReview(id);
  const { state } = useApp();

  if (!review) {
    return (
      <div className="page">
        <EmptyState
          icon="alert"
          title="We cannot find this review"
          text="It may have been removed."
        >
          <Link to="/" className="btn btn-primary empty-action">
            Go to start
          </Link>
        </EmptyState>
      </div>
    );
  }

  if (review.stage === "requested" || review.cases.length === 0) {
    if (state.role === "designer")
      return <Navigate to={`/review/${review.id}/confirm`} replace />;
    return (
      <div className="page">
        <h1 className="title">{review.branch}</h1>
        <div className="ai-message">
          <p className="label">Waiting</p>
          <p>
            {PEOPLE.designer.name} has not confirmed what to check yet. You get
            a message when the review starts.
          </p>
        </div>
      </div>
    );
  }

  const caseItem = review.cases.find((c) => c.id === caseId);
  if (!caseItem)
    return (
      <Navigate
        to={`/review/${review.id}/cases/${firstCaseId(review)}`}
        replace
      />
    );

  return <CaseScreen key={caseItem.id} review={review} caseItem={caseItem} />;
}

function CaseScreen({
  review,
  caseItem,
}: {
  review: Review;
  caseItem: CaseItem;
}) {
  const { state, dispatch } = useApp();
  const role = state.role;
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const showToast = useToast();
  const { closeRightPanel } = useShell();

  const [ui, setUi] = useState<StageUi>({
    selectedPinId: null,
    editing: false,
    draft: null,
  });
  const [confirmDelete, setConfirmDelete] = useState<Pin | null>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const [inspect, setInspect] = useState(false);
  const [fullscreen, setFullscreenState] = useState(keepFullscreen);
  const setFullscreen = (value: boolean) => {
    keepFullscreen = value;
    setFullscreenState(value);
  };

  // Full screen stays on when the designer moves to another case. Leaving the cases ends it.
  useEffect(
    () => () => {
      setTimeout(() => {
        if (!window.location.pathname.includes("/cases/"))
          keepFullscreen = false;
      }, 0);
    },
    [],
  );

  // Esc leaves full screen.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const recheck = isRecheck(review);
  const approved = review.stage === "approved";
  const designer = role === "designer";
  const canPin = designer && review.phase === "designer" && !approved;
  const canEdit = designer && !approved;
  const caseId = caseItem.id;

  const hasEarlier = review.pins.some((p) => p.earlier && !p.deleted);
  const pins = visiblePins(review, caseId).filter(
    (p) => showEarlier || !p.earlier,
  );
  const livePinCount = livePins(review, caseId).length;
  useRightSidebar(livePinCount, "feedback");
  usePageTitle(`${review.branch} · asked by ${review.requestedBy}`);

  const goTo = (id: string) =>
    navigate(
      `/review/${review.id}/cases/${id}${search.toString() ? `?${search.toString()}` : ""}`,
    );

  const deletePin = (pin: Pin) => {
    if (pin.sent) {
      setConfirmDelete(pin);
      return;
    }
    removePin(pin);
  };

  const removePin = (pin: Pin) => {
    dispatch({ type: "deletePin", reviewId: review.id, pinId: pin.id });
    setUi({ selectedPinId: null, editing: false, draft: null });
    showToast("Feedback deleted", {
      action: {
        label: "Undo",
        onSelect: () =>
          dispatch({ type: "restorePin", reviewId: review.id, pinId: pin.id }),
      },
    });
  };

  const waitingCount = review.pins.filter(
    (p) => !p.deleted && p.status === "waiting",
  ).length;

  return (
    <div className="case-page">
      <div className="case">
        <FeedbackList
          review={review}
          caseItem={caseItem}
          pins={pins}
          role={role}
          recheck={recheck}
          canEdit={canEdit}
          selectedId={ui.selectedPinId}
          onSelect={(pin) =>
            setUi({ selectedPinId: pin.id, editing: false, draft: null })
          }
          onEdit={(pin) => {
            setUi({ selectedPinId: pin.id, editing: true, draft: null });
            closeRightPanel();
          }}
          onDelete={deletePin}
          dispatch={dispatch}
        />

        <div className="case-head">
          <div className="case-head-text">
            <div className="case-head-title">
              <h1 className="title">{review.branch}</h1>
              <CommitInfo
                name={review.requestedBy}
                branch={review.branch}
                revision={review.revision}
              />
            </div>
            {approved ? (
              <p className="confirm-meta">
                <ReleaseBadge release={review.release} />
              </p>
            ) : null}
          </div>
          <div className="case-head-pick">
            {hasEarlier ? (
              <button
                type="button"
                role="switch"
                aria-checked={showEarlier}
                className="switch-row"
                onClick={() => setShowEarlier((v) => !v)}
              >
                <span className="switch-track" aria-hidden="true">
                  <span className="switch-thumb" />
                </span>
                Show earlier comments
              </button>
            ) : null}
            <button
              type="button"
              className="inspect-toggle"
              aria-pressed={inspect}
              onClick={() => setInspect((v) => !v)}
            >
              <Icon name="inspect" size={16} />
              Inspect
            </button>
            <button
              type="button"
              className="inspect-toggle"
              onClick={() => setFullscreen(true)}
            >
              <Icon name="fullscreen" size={16} />
              Full screen
            </button>
          </div>
        </div>

        <Banner
          review={review}
          role={role}
          recheck={recheck}
          waitingCount={waitingCount}
        />

        <PreviewStage
          review={review}
          caseItem={caseItem}
          pins={pins}
          canPin={canPin}
          canEdit={canEdit}
          ui={ui}
          setUi={setUi}
          nextNumber={(review.pinCounter[caseId] ?? 0) + 1}
          onAddPin={(loc: Location, text) =>
            dispatch({
              type: "addPin",
              reviewId: review.id,
              caseId,
              target: loc.target,
              x: loc.x,
              y: loc.y,
              text,
            })
          }
          onEditPin={(pin, text) =>
            dispatch({
              type: "editPin",
              reviewId: review.id,
              pinId: pin.id,
              text,
            })
          }
          onDeletePin={deletePin}
          onMovePin={(pin, loc) =>
            dispatch({
              type: "movePin",
              reviewId: review.id,
              pinId: pin.id,
              target: loc.target,
              x: loc.x,
              y: loc.y,
            })
          }
          panelId="case-panel"
          inspect={inspect}
          fullscreen={fullscreen}
          onToggleInspect={() => setInspect((v) => !v)}
          onExitFullscreen={() => setFullscreen(false)}
        />

        {canPin && inspect ? (
          <p className="case-hint">
            Inspect is on. Hover to see sizes. Click to start a comment with the
            numbers.
          </p>
        ) : null}

        <Dialog
          open={confirmDelete !== null}
          title="Delete this comment?"
          onClose={() => setConfirmDelete(null)}
        >
          <p className="dialog-text">
            {PEOPLE.developer.name} already got it. He will see that it was
            deleted.
          </p>
          <div className="dialog-actions">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) removePin(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Delete comment
            </Button>
          </div>
        </Dialog>
      </div>

      <div className={`mark-row ${fullscreen ? "mark-row-full" : ""}`.trim()}>
        <div className="mark-left">
          <CaseSelect
            label="Cases"
            items={review.cases.map((c) => ({
              id: c.id,
              label: caseLabel(review, c),
              ...caseParts(review, c),
              status: c.status,
            }))}
            selectedId={caseId}
            onSelect={goTo}
            panelId="case-panel"
          />
        </div>
        <ReviewActions review={review} onSent={() => setFullscreen(false)} />
      </div>
    </div>
  );
}

function Banner({
  review,
  role,
  recheck,
  waitingCount,
}: {
  review: Review;
  role: "designer" | "developer";
  recheck: boolean;
  waitingCount: number;
}) {
  let text = "";
  let tone: "info" | "success" | "warning" = "info";
  let icon = false;
  if (review.stage === "approved") {
    tone = "success";
    text =
      role === "developer"
        ? "Approved. You can merge."
        : `Approved. ${PEOPLE.developer.name} can merge.`;
  } else if (role === "designer" && review.phase === "developer") {
    text = `Waiting on ${PEOPLE.developer.name}. You can still edit or delete your comments.`;
  } else if (role === "designer" && recheck) {
    tone = "warning";
    text =
      "AI found 1 comment that does not look fully fixed. Please take a look.";
    icon = true;
  } else if (role === "developer" && review.phase === "developer") {
    text = `${PEOPLE.designer.name} sent ${plural(waitingCount, "comment")}. Fix them, push, then click Ready for re-check.`;
  } else if (role === "developer") {
    text = `Waiting on ${PEOPLE.designer.name} to check the cases.`;
  }
  if (!text) return null;
  return (
    <p className={`banner banner-${tone}`} role="status">
      {icon ? <Icon name="sparkles" size={16} /> : null}
      {text}
    </p>
  );
}
