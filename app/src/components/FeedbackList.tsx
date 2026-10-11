import { useState, type Dispatch } from "react";
import { createPortal } from "react-dom";
import { AI_SHORT, PEOPLE } from "../lib/data";
import type { Action } from "../lib/store";
import { formatRelative } from "../lib/time";
import { useMediaQuery } from "../lib/useMediaQuery";
import type { CaseItem, Pin, Review, Role } from "../lib/types";
import { pinStatusLabel, StatusBadge } from "./Badge";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { Icon } from "./Icon";
import { Menu } from "./Menu";
import { PinMark } from "./PinMark";
import { useShell } from "./ShellContext";
import { TextInput } from "./TextInput";

type Props = {
  review: Review;
  caseItem: CaseItem;
  pins: Pin[];
  role: Role;
  recheck: boolean;
  canEdit: boolean;
  selectedId: string | null;
  onSelect: (pin: Pin) => void;
  onEdit: (pin: Pin) => void;
  onDelete: (pin: Pin) => void;
  dispatch: Dispatch<Action>;
};

/** The right sidebar of the case screen: the feedback for the selected case (design system 4.22). */
export function FeedbackList(props: Props) {
  const { rightEl, closeRightPanel } = useShell();
  const isWide = useMediaQuery("(min-width: 900px)");
  const { pins, role } = props;
  if (!rightEl) return null;

  return createPortal(
    <>
      <div className="sidebar-head">
        <h2 className="sidebar-title">Comments</h2>
        {!isWide ? (
          <Button size="small" onClick={closeRightPanel}>
            Close
          </Button>
        ) : null}
      </div>
      <div className="sidebar-body">
        {pins.length === 0 ? (
          <EmptyState
            icon="message"
            title="No feedback yet"
            text={
              role === "designer" && props.canEdit
                ? "Click on the design to add a pin."
                : "There is nothing to fix in this case."
            }
          />
        ) : (
          <ul className="feedback-list">
            {[...pins]
              .sort((a, b) => a.number - b.number)
              .map((pin) =>
                pin.deleted ? (
                  <Deleted key={pin.id} pin={pin} />
                ) : (
                  <Item key={pin.id} pin={pin} {...props} />
                ),
              )}
          </ul>
        )}
      </div>
    </>,
    rightEl,
  );
}

function Deleted({ pin }: { pin: Pin }) {
  return (
    <li className="fb fb-deleted">
      <PinMark number={pin.number} status="not-checked" small />
      <span>Comment deleted by {PEOPLE.designer.name}</span>
    </li>
  );
}

function Item({
  pin,
  review,
  role,
  recheck,
  canEdit,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  dispatch,
}: Props & { pin: Pin }) {
  const selected = selectedId === pin.id;
  const [deciding, setDeciding] = useState(false);
  const [stillNote, setStillNote] = useState("");
  const [devNote, setDevNote] = useState(pin.devNote);

  const waitingOnDev = review.phase === "developer" && pin.status === "waiting";
  const needsDecision =
    role === "designer" && recheck && pin.status === "not-checked";
  const warning = pin.devFixed && pin.aiMark === "no-change";
  const showMarks = pin.sent && (pin.devFixed || pin.aiMark);

  return (
    <li
      className={`fb ${selected ? "fb-selected" : ""}`.trim()}
      id={`fb-${pin.id}`}
    >
      <div className="fb-row">
        <button
          type="button"
          className="fb-main"
          aria-pressed={selected}
          onClick={() => onSelect(pin)}
        >
          <PinMark number={pin.number} status={pin.status} small />
          <span className="fb-body">
            <span
              className={`fb-text ${selected ? "fb-text-full" : ""}`.trim()}
            >
              {pin.text}
            </span>
            <span className="fb-meta">
              {pin.author}, {formatRelative(pin.createdAt)}
              {pin.edited ? " · Edited" : ""}
            </span>
          </span>
        </button>
        {canEdit ? (
          <Menu
            label={`More options for pin ${pin.number}`}
            items={[
              { label: "Edit", icon: "pencil", onSelect: () => onEdit(pin) },
              {
                label: "Delete",
                icon: "trash",
                danger: true,
                onSelect: () => onDelete(pin),
              },
            ]}
          />
        ) : null}
      </div>

      <div className="fb-tags">
        <StatusBadge
          status={pin.status}
          label={pinStatusLabel(pin)}
          note={
            showMarks && pin.aiMark && pin.aiMark !== "no-change"
              ? AI_SHORT[pin.aiMark]
              : undefined
          }
        />
        {showMarks && pin.devFixed ? (
          <span className="fb-mark">
            <Icon name="check" size={14} />
            Marked fixed
          </span>
        ) : null}
      </div>

      {pin.devNote && (role === "designer" || !waitingOnDev) ? (
        <p className="fb-note">
          {PEOPLE.developer.name}: {pin.devNote}
        </p>
      ) : null}
      {pin.stillNote && pin.status === "needs-fix" ? (
        <p className="fb-note">Still wrong: {pin.stillNote}</p>
      ) : null}
      {warning && role === "designer" ? (
        <p className="fb-warning">
          <Icon name="alert" size={16} />
          Marked fixed, but the AI found no change. Look at this one first.
        </p>
      ) : null}

      {role === "developer" && waitingOnDev ? (
        <div className="fb-actions">
          <Button
            size="small"
            aria-pressed={pin.devFixed}
            icon={pin.devFixed ? "check" : undefined}
            onClick={() =>
              dispatch({
                type: "markFixed",
                reviewId: review.id,
                pinId: pin.id,
                fixed: !pin.devFixed,
                note: devNote,
              })
            }
          >
            {pin.devFixed ? "Marked fixed" : "Fixed"}
          </Button>
          {pin.devFixed ? (
            <TextInput
              label="Note (optional)"
              placeholder="Moved the badge up"
              value={devNote}
              onChange={(e) => setDevNote(e.target.value)}
              onBlur={() =>
                dispatch({
                  type: "markFixed",
                  reviewId: review.id,
                  pinId: pin.id,
                  fixed: true,
                  note: devNote,
                })
              }
            />
          ) : null}
        </div>
      ) : null}

      {needsDecision ? (
        deciding ? (
          <div className="fb-actions">
            <TextInput
              label="What is still wrong?"
              placeholder="The badge still covers the button"
              value={stillNote}
              onChange={(e) => setStillNote(e.target.value)}
            />
            <div className="fb-buttons">
              <Button size="small" onClick={() => setDeciding(false)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                onClick={() =>
                  dispatch({
                    type: "decidePin",
                    reviewId: review.id,
                    pinId: pin.id,
                    decision: "still",
                    note: stillNote,
                  })
                }
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="fb-buttons">
            <Button
              size="small"
              variant="primary"
              onClick={() =>
                dispatch({
                  type: "decidePin",
                  reviewId: review.id,
                  pinId: pin.id,
                  decision: "resolved",
                })
              }
            >
              Mark resolved
            </Button>
            <Button size="small" onClick={() => setDeciding(true)}>
              Still needs fix
            </Button>
          </div>
        )
      ) : null}
    </li>
  );
}
