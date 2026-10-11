# User journey

This file describes how two people move through the product, step by step.
It follows the user needs in [product-brief.md](product-brief.md).
Words and colors follow [design-system.md](design-system.md).

---

## 1. People

| Person | Example | Goal |
| --- | --- | --- |
| Designer | Emma | Check every case of a new feature. Say exactly what is wrong. Approve when it is right. |
| Developer | Tom | Ask for a design check when a feature is built. Get clear fixes. Know when it is approved so the work can be merged. |

The designer is the main user. The designer does not need to know Git.
In the designer's screens we say **feature**, never **branch** or **repo**.

---

## 2. Journey at a glance

| # | Phase | Who | What happens | Main screen |
| --- | --- | --- | --- | --- |
| 1 | Before design QA | Developer, then designer | Developer asks for a design check. Designer opens it and confirms what to check. | Request design QA, Confirm what to check |
| 2 | During design QA | Designer | Designer looks at every case, drops pins on the design, and marks each case. | Case screen |
| 3 | After design QA | Designer, then developer | Designer sends the fixes. Developer reads them, fixes them, and says it is ready. | Case screen (both roles) |
| 4 | Re-check | Designer | Designer gets a notification, checks the fixes, and approves or flags again. | Case screen, re-check view |
| 5 | Other | Designer, developer | See all projects and their deploy status. | Projects |

Happy path in one line:
Developer requests, designer confirms, designer checks and pins, designer sends, developer fixes, designer re-checks, designer approves, developer merges.

---

## 3. Status cycle

Every case and every pin uses the same four statuses from the design system. Together they make a loop.

| Status | Badge | Who it waits on | How it changes |
| --- | --- | --- | --- |
| Not checked | Gray | Designer | Designer marks it Approved or Needs fix. |
| Needs fix | Red | Designer (to send it) | Designer sends it. It becomes Waiting. |
| Waiting | Yellow | Developer | Developer fixes it and pushes. The AI checks the push and adds a mark. Developer may tap Fixed, then clicks "Ready for re-check". It becomes Not checked. |
| Approved | Green | Nobody | Done. If the designer finds a new problem later, it goes back to Needs fix. |

The loop: Not checked, then Needs fix, then Waiting, then Not checked again, until Approved.

The AI marks (Likely fixed, Not sure, No change found) and the developer mark (Fixed) are not statuses. They are hints. Only the designer changes a status to Approved.

---

## 4. Phase 1: Before design QA

### 1A. Developer asks for a design check

**Who:** Developer

**When.** The developer finishes building a feature and wants a designer to check it.
Today this is a chat message or sitting next to the designer. The tool replaces that moment.

**Steps**

1. The developer opens **Request design QA** (`/requests/new`).
2. The developer picks the **work to check**. This is the branch. The developer knows what it is.
3. The developer writes a **feature name** and a **one-line note** in plain words.
   Example: "Cart page" and "Cart changes by state and A/B test".
4. The developer picks **who should review**. One or more designers.
5. The developer sends the request.

**Result**

- The designer gets a notification (see section 9).
- The developer sees the request as **Waiting** in the project list.

**Rules**

- The feature name is what the designer sees everywhere. The Git name is hidden in small text.
- A request needs a feature name and at least one reviewer.
- Show an error next to the field if something is missing. Do not disable the Send button.

---

### 1B. Designer opens the request

**Who:** Designer

**Steps**

1. Emma gets a notification in the app: the bell in the header shows a dot. The list says "Tom asked you to check Cart page." She also gets a Slack message with an **Open** button.
2. She clicks the notification (or the Slack button).
3. The tool opens **Confirm what to check** (`/review/:id/confirm`).

**Rules**

- The page title is the feature name. It shows who asked and the developer's note.
- The first time, a short line explains: "You do not need to know Git."
- If she is not signed in, she signs in first and then lands on the same page.

---

### 1C. Designer confirms what to check (the AI step)

**Who:** Designer

The AI has read the code. It shows what it found and asks if it is right.

**What the screen shows**

- **Found cases.** The cases sit in boxes grouped by section, such as **Logged in** and **Logged out**. Each case is a row in its box, with a rounded black checkbox on the left (with a white check when on), the case name as the title and a short plain line under it. Examples:
  - **Logged in: No items:** the person is signed in and nothing is in the cart.
  - **Logged in: Sold out:** the person is signed in and one product in the cart is sold out. Checkout is off.
- Two buttons: **Yes, show 5 cases** (primary) and **Something is missing** (secondary).

**Rules**

- Every card is **on by default**. The designer turns one off to skip it.
- The case count on the primary button updates when cards change. Example: "Yes, show 2 cases".
- If no card is on, show a message: "Keep at least one on."
- **Something is missing** opens a popup "What did we miss?". The designer writes what is missing, for example that she heard about an A/B test but does not see it in the cases, and presses **Send**. Nothing is added to the list. The AI looks again.
- If the AI finds nothing special, it skips this screen and goes straight to the case screen with the default case.

**Result.** The designer clicks the primary button and goes to the case screen.

---

### 1D. The chips become a dropdown

**Who:** Designer

On the case screen, the same chips become a **dropdown** at the right of the feature name. Each option is one case.

- An option shows the version, the group, and the case status badge.
- The first case with status Not checked is selected.
- The dropdown shows the selected case. Clicking it opens the list of all cases.

---

## 5. Phase 2: During design QA

All of this happens on the **case screen** (`/review/:id/cases/:caseId`).

### 2A. Look at the design

**Who:** Designer

**Layout**

- **Top:** feature name, the case dropdown, and the big button on the right (see 3A).
- **Middle:** the design for the selected case, shown as a live preview.
- **Side panel (desktop) or below (phone):** the list of feedback for this case.

**Steps**

1. The designer picks a case in the dropdown.
2. The design for that case appears. Example: **Logged in: Sold out** shows a faded product and a Checkout button that is off.
3. She looks at it, picks the next case, and looks at the next one.

---

### 2B. Leave feedback with a pin

**Who:** Designer

Feedback is placed **on the design itself**, so the developer sees the exact spot.

**Steps**

1. The designer clicks or taps on the design where the problem is.
2. A **pin** appears at that spot. It has a number: 1, 2, 3.
3. A **comment popup** opens next to the pin with a text area ("Say what to change").
4. She types the feedback and saves.
5. The pin stays on the design. The comment appears in the feedback list with the same number.

**Rules**

- Pins belong to one case. Each case has its own pins.
- A pin remembers its place as a position on the design, so it stays in the right spot on different screen sizes.
- Clicking a pin or a list item opens the comment and highlights the matching one.
- Pins use the red color (Needs fix).
- A feedback item shows who wrote it and when.
- An empty comment cannot be saved. Show a message next to the field.
- Marking a case as Needs fix requires at least one pin. If there is none, show a message: "Add a pin to show what to fix."

---

### 2C. Edit and delete feedback

**Who:** Designer

**Edit**

1. The designer clicks a pin or a list item.
2. She chooses **Edit**. The text becomes editable.
3. She saves. The comment shows an **Edited** label.

**Move.** She can drag the pin to a new spot before sending.

**Delete**

1. She chooses **Delete** on a pin or a list item.
2. The pin and the comment disappear.
3. A toast says "Feedback deleted" with an **Undo** action for 5 seconds.

**After the feedback is sent**

- She can still edit or delete. The developer sees the **Edited** label, or a "Deleted" note.
- Deleting after sending asks for confirmation in a popup first.

---

### 2D. Mark the case

**Who:** Designer

There is no button to approve a case. The designer only leaves comments:

| What the designer does | Result |
| --- | --- |
| Leaves no comment on a case | The case counts as approved |
| Leaves a comment | Status badge turns red: Needs fix, by itself |

- When no case has a comment, the big button says **Approve and finish**.
- She can change her mind at any time before sending.

---

## 6. Phase 3: After design QA

### 3A. Send to the developer

**Who:** Designer

**The big button.** It sits at the top right of the case screen. It is the one primary button of the screen. Its label changes with the situation:

| Situation | Label | What it does |
| --- | --- | --- |
| At least one case Needs fix | **Send to developer** | Sends all fixes in one message |
| Every case Approved | **Approve and finish** | Approves the review and tells the developer they can merge |
| Some cases Not checked | **Send to developer** (same label) | Asks first, see below |

The label includes a count when it helps, for example "Send to developer (3 fixes)".

**Steps**

1. The designer clicks the big button.
2. A **popup** opens: "All done? We will send your comments to Tom.".
3. If some cases are Not checked, the popup also says: "2 cases are not checked yet." The buttons are **Keep checking** and **Send anyway**.
4. She confirms.
5. A toast says "Sent to Tom".
6. Cases with fixes change from Needs fix to **Waiting**. Approved cases stay Approved.

---

### 3B. Developer reads the feedback and fixes it

**Who:** Developer

**Steps**

1. Tom gets a Slack message: "Emma sent 3 fixes for Cart page." It has an **Open** button and a short summary.
2. He opens the case screen. He sees the same design with the pins.
3. The feedback list shows every comment. Each item shows the pin number, the comment, the case, and its status.
4. He clicks a pin to see exactly where the problem is.
5. He fixes the code and pushes. The AI checks each comment after every push (see "AI check" below).
6. He can mark an item **Fixed**. This is optional. He can add a short note. Example: "Moved the badge up."
7. When he is done, he clicks the big button: **Ready for re-check**.

**Item status in the developer view**

| Status | Meaning |
| --- | --- |
| Open | Nothing done yet. |
| Marked fixed | The developer tapped **Fixed**. |
| AI: likely fixed | The AI thinks the push fixed it. |

An item can have both marks. Items never disappear from the list. Only the designer can close an item.

**AI check (runs on every push)**

1. The tool sees a new commit on the branch.
2. It compares the new code with the last version.
3. It finds the element under each pin.
4. It renders the commented cases again and compares the pinned area with the old screenshot. To save time, it only renders cases that have comments or related code changes.
5. It sets one mark on each comment:
   - **Likely fixed**: code near the element changed, and the screen matches the comment.
   - **Not sure**: code changed, but the screen looks almost the same.
   - **No change found**: nothing near the element changed.

The AI mark is a suggestion. It never closes a comment.

**Result**

- The designer gets a notification (see section 9).
- Cases change from Waiting to **Not checked**.

**Rules**

- The developer cannot approve. Only the designer can.
- A developer can reply to a comment if something is not clear. The designer is notified.
- If some items are still Open, **Ready for re-check** asks first: "2 items are still open. Send anyway?"
- A push alone does not notify the designer. Only **Ready for re-check** does.

---

## 7. Phase 4: Re-check

### 4A. Designer gets the notification

**Who:** Designer

- Slack message: "Tom fixed 3 things in Cart page. Check again." It has an **Open** button.
- Clicking it opens the case screen in the **re-check view** (`/review/:id/cases/:caseId?view=recheck`).

### 4B. Review the updated designs

**Who:** Designer

**What the screen shows**

- Only the cases that changed are in the dropdown first. Other cases are still reachable.
- A yellow bar at the top, with a sparkle icon, says: "AI found 1 comment that does not look fully fixed. Please take a look."
- In the demo the fix cannot be real, so it is fixed in place: one comment, picked at random, stays as not fully fixed (AI: no change found). The other comments count as fixed. They are kept as earlier comments and are hidden. A switch named "Show earlier comments" sits next to Inspect. When it is on, the earlier comments show again.
- The design shows the **new version**.
- Old pins stay on the design. Each pin shows:
  - Her old comment.
  - The developer's note, if there is one.
  - The developer mark (Marked fixed or not).
  - The AI mark (Likely fixed, Not sure, or No change found).
  - Its current status.
- If the two marks disagree, the pin shows a small warning. Example: the developer marked it Fixed, but the AI found no change. She should look at it first.
- Resolved pins look quiet (gray). Open pins keep the red color.

**Steps**

1. She opens the first changed case.
2. She looks at the new design and reads her old comment next to it.
3. She decides.

### 4C. Flag again or approve

**Who:** Designer

For each pin she chooses:

| Choice | Result |
| --- | --- |
| **Resolved** | The pin becomes Approved (green). |
| **Still needs fix** | The pin goes back to Needs fix (red). She adds a short note about what is still wrong. |

**Case status**

- Every pin in the case Resolved: the case becomes **Approved**.
- Any pin Still needs fix: the case becomes **Needs fix** again.

### 4D. Finish

**Who:** Designer

| Situation | Big button label | What happens |
| --- | --- | --- |
| Something still needs fix | **Send to developer** | Same as 3A. The loop starts again. |
| Every case Approved | **Approve and finish** | Popup: "Approve all cases? The developer can merge." She confirms. |

After she approves:

- A toast says "Review approved".
- Tom gets a Slack message: "Emma approved Cart page. You can merge."
- The feature shows **Approved** in the left sidebar.

**Rules**

- She can see the full history of comments from earlier rounds. Round 1, round 2, and so on.
- Old comments are never lost, even when they are resolved.

---

## 8. Phase 5: Other

### 5A. See all projects

**Who:** Designer and developer

**Where:** The left sidebar of the app (see [pages.md](pages.md)). There is no separate Projects page.

- The sidebar lists projects. Each project opens to show its features that are in design QA.
- Each feature row shows: feature name and review status (Not checked, Waiting, Needs fix, Approved).
- Reviews in progress have no section name. Approved ones sit under **Approved**. Each feature row has a badge on the right: **Waiting**, **In development** or **Approved**. The designer sees nothing in the list until they confirm the first request. Then a full-screen loading screen says "Adding the project" for about 3 seconds. A white rounded tile fades in from blur, a folder is drawn inside it, and thin lines with dots spread out around it. A progress bar in a darker shade of the sidebar color fills below, and the project appears with a "Project added" toast.
- Click a feature to open its case screen.
- The person who asked and the round number show at the top of the case screen.
- To add a new project, the person clicks **Add project** and sees the Add project dialog.

### 5B. See deploy status

**Who:** Designer and developer

- After a feature is approved, its sidebar row also shows where it is in release: **Not merged**, **Merged**, **Deployed**.
- This comes from the code system. Designers do not set it.
- It is shown as a small outlined release badge. It never replaces the review status.

---

## 9. Notifications

| Event | Who gets it | Channel | Message | Opens |
| --- | --- | --- | --- | --- |
| Design QA requested | Designer | In app and Slack | "Tom asked you to check Cart page." | Confirm what to check |
| Fixes sent | Developer | In app and Slack | "Emma sent 3 fixes for Cart page." | Case screen with the fixes |
| Ready for re-check | Designer | In app and Slack | "Tom fixed 3 things in Cart page. Check again." | Case screen, re-check view |
| Review approved | Developer | In app and Slack | "Emma approved Cart page. You can merge." | Case screen |
| Feedback edited or deleted after sending | Developer | In app and Slack (grouped) | "Emma changed 1 comment on Cart page." | Case screen |

Rules:

- A push alone sends no message. The AI check updates the marks quietly. The designer is told only when the developer clicks **Ready for re-check**.
- In the app, the bell shows a dot while something is unread (see design-system.md, 4.23).
- One message per event. Never one message per comment.
- Messages use the feature name and people's names. They never show a Git name.
- Every message has one button.

---

## 10. Pages for this journey

| URL | Page | Used by | Phase |
| --- | --- | --- | --- |
| `/requests/new` | Request design QA | Developer | 1A |
| `/review/:id/confirm` | Confirm what to check | Designer | 1C |
| `/review/:id/cases/:caseId` | Case screen | Designer, developer | 2, 3, 4 |
| `/review/:id/cases/:caseId?view=recheck` | Case screen, re-check view | Designer | 4 |
| `/` | Start page: add a project | Designer | Before 1 |

Projects are not a page. They live in the left sidebar of every page.

Already built from earlier work: `/how-it-works`, `/review/new` (pick what to review by yourself).

---

## 11. Components this journey needs

| Component | Status |
| --- | --- |
| Button, Badge (including the release badge), Card, Input, Text area, Dropdown menu, Popup, Dialog, Toast, Skeleton, Empty state, Tooltip | In the design system |
| App shell (header, left and right sidebars, tree item) | In the design system (4.17) |
| **Toggle chip** (on by default, used on the confirm screen) | In the design system (4.18) |
| **Case dropdown** (with a status badge on each option) | In the code (CaseSelect) |
| **Pin** (numbered marker on the design) | In the design system (4.20) |
| **Comment popup** (text area, save, edit, delete) | In the design system (4.21) |
| **Feedback list item** (number, text, author, status, actions) | In the design system (4.22) |
| **Notification message** (Slack message layout) | To add |
