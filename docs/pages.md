# Pages

This file lists every page of the product: what it is for, what is on it, and which sidebars show.
Steps and rules for each person are in [user-journey.md](user-journey.md).
The frame (header, sidebars, sizes, behavior) is the App shell in [design-system.md](design-system.md) (4.17). This file does not repeat its numbers.

---

## 1. All pages

| URL | Page | Used by | Left sidebar | Right sidebar |
| --- | --- | --- | --- | --- |
| `/` | Welcome: how it works | Designer | Open | Not shown |
| `/requests/new` | Request design QA | Developer | Open | Not shown |
| `/review/:id` | Goes to the first case that needs a decision (or the confirm page) | Both | Open | Not shown |
| `/review/:id/confirm` | Confirm what to check | Designer | Open | Not shown (the header shows no page title) |
| `/review/:id/cases/:caseId` | Case screen | Designer, developer | Open | Open |
| `/review/:id/cases/:caseId?view=recheck` | Case screen, re-check view | Designer | Open | Open |

There is no separate Projects page. Projects live in the left sidebar of every page.
Any other address shows a Not found page with a link back to the start.

### Demo controls

The demo has no real developer or code host, so it has a few controls that stand in for them. They are marked **Demo** and are not part of the product.

- **Demo view** (left sidebar, bottom): a row with the avatar and name of the person the demo is acting as (Emma or Tom). Clicking it opens a small popup above the row with Emma (Designer), Tom (Developer), and **Reset demo**. Choosing a person switches the view. **Reset demo** clears all data.
- When Tom clicks **Ready for re-check**, the demo acts as if his code was pushed. The AI checks each comment and the result goes to Emma.

---

## 2. Shared parts

### 2.1 Left sidebar: projects and features

It works like a file list. It shows every project the person can see.

```
Projects                      [+ Add project]
-----------------------------------------
v clearwell-frontend
    Cart page                 Needs fix
    Repayment plan            Waiting
    Welcome screen            Approved   Merged
> Savings app
> Card app
```

**Structure**

- Level 1: **project**. It can open and close.
- Level 2: **feature**. This is what the designer reviews. It shows the feature name.
- Cases are not in the sidebar. They are in a dropdown on the case screen.

**Each feature row shows**

- The feature name.
- The review status badge: Not checked, Needs fix, Waiting, or Approved.
- After approval, a release badge: **Not merged**, **Merged**, or **Deployed**.

**Rules**

- The selected feature is highlighted.
- Features that need the person's action are on top. Designers see "Not checked" first. Developers see "Needs fix" first.
- Approved features sit at the bottom and look quiet (gray text).
- When a review ends, the feature stays in the list with the Approved badge. It then gets Merged and Deployed as the code moves on.
- The list is in a Notion-like style. There is extra space above the first section name. Reviews that are not approved yet have no section name. Approved ones sit under an **Approved** name. A section with nothing in it is not shown. Each project is a row with a folder icon, and its features sit under it, indented. Each feature row has a badge on the right: **Waiting** (designer's turn), **In development** (developer's turn) or **Approved**. The row you are on has a light gray background. Each feature row and each page title shows the branch name (for example feature/cart-page), for both the designer and the developer. The developer also sees more branches of the project inside the project folder, under the review, each with a release badge (**Merged**, **Deployed** or **Not merged**). These rows are not clickable.
- A designer sees no project and no request in the list until they confirm the first request ("Yes, show 5 cases"). The sidebar shows "No projects yet" until then. When they confirm, the project appears and a toast says "Project added".
- The **Add project** button fills the full width of the sidebar.
- If a project has no features, show an empty state: "No reviews yet."
- **Add project** opens the Add project dialog (section 3b).
- On small screens, selecting a feature closes the sidebar.

### 2.2 Right sidebar: feedback

It only exists on the case screen.

- Header: the title "Comments".
- A list of feedback items in pin order (see Feedback list item, 4.22).
- Clicking an item highlights the pin. Clicking a pin highlights the item.
- In the developer view each item also shows the developer mark, the AI mark, and a **Fixed** button.
- In the re-check view each item also shows **Mark resolved** and **Still needs fix**. The badge reads **Resolved** or **Not resolved**.
- If there is no feedback, show an empty state: "No feedback yet. Click on the design to add a pin."
- The feedback count shows next to the right sidebar toggle, so the person knows feedback exists even when the sidebar is closed.

### 2.3 Header

- The header shows only the app name. It has no page title. The page name is shown in the page itself (on the case screen, the feature name and who asked).
- The one primary button of the page sits in the header (on the case screen, this is the big button).
- The notification bell sits at the far right of the header on every page (see design-system.md, 4.23).

### 2.4 Notifications

- A notification is how a person learns that something is waiting for them. Example: "Tom asked you to check Cart page."
- The bell shows a dot while something is unread. Clicking the bell opens the list.
- Clicking a notification opens its page. A request opens **Confirm what to check**, which starts the review (journey 1B and 1C).
- The feature also appears in the left sidebar as **Not checked**, so the person can open it from there too.
- In the demo, the developer's request is simulated: it arrives a few seconds after a project is added.

---

## 3. Welcome: how it works

**URL.** `/`
**Used by.** Designer
**When.** The first page. It shows when the person opens the tool.

```
+----------------+------------------------------------------------+
| Left sidebar   |  Check every screen before it ships            |
|                |  See every version of a screen, tell the       |
|                |  developer what to fix, and approve it.        |
|                |                                                |
|                |  1  Get a request or add a project [Add]       |
|                |  2  AI finds every version                     |
|                |  3  Leave pins and comments                    |
|                |  4  Check again and approve                    |
|                |                                                |
+----------------+------------------------------------------------+
```

**Center**

- One title, one short description, four cards.
- Each card has a small picture, a numbered title, and one line of text. Two columns on wide screens, one column on phones.
- The cards match the journey: get a request or add a project, AI finds versions, leave pins and comments, check again and approve.
- The pictures use grays only (the same grays as the sidebar), so they do not pull attention from the real screens.
- The pictures use only simple shapes and the design tokens. They have no words.
- Card 1 has a small **Add project** button under its description. It opens the Add project dialog. It has no description text.
- Cards have the same fill as the left sidebar, a 1px border, and 24px padding.

**States**

- First visit: the left sidebar is empty and says "No projects yet" with an **Add project** button under it.
- A request is waiting: the bell shows a dot. The feature appears in the left sidebar only after the person opens the notification.

---

## 3b. Add project (dialog)

**URL.** None. It is a dialog (design-system.md, 4.14) that opens on top of the current page.
**Used by.** Designer
**When.** The person clicks **Add project** in the left sidebar, or **Add project** on the welcome page. It always opens as a dialog, from any page.

- Title "Add project", a short friendly description, one input, two buttons: **Cancel** and **Start**.
- The input asks for the repository address. The label says "Enter the code address (from GitHub or GitLab)". There is no separate hint.
- The description says the person needs the link to the team's code. Below it, a box with the sidebar color holds the line to ask a developer, in the same text color: Ask a developer: "Can you send me the GitHub or GitLab link for our project?"
- Plain words. No other Git terms.
- Escape, Cancel, or a click outside closes it. It cannot be closed while the code is opening.

**After the address is accepted.** The dialog closes and a toast says "Code address saved". The project is not in the left sidebar yet. It appears, with a "Project added" toast, when the designer confirms the first request (section 5).

**States**

- Empty input: "Paste a code address first."
- Wrong or private address: an error next to the input with the next step: "We cannot open this address. Check the link, or connect your account."
- Address already added: "This project is already added."
- Working: the Start button shows a spinner and the input is disabled.

---

## 4. Request design QA

**URL.** `/requests/new`
**Used by.** Developer
**Journey.** 1A

**Center**

- Title: "Request design QA".
- Fields: work to check (the branch), feature name, one-line note, reviewers.
- One primary button: **Send request**.

**States**

- Missing feature name or reviewer: an error next to the field. The button is not disabled.
- Sent: a toast, then the feature appears in the left sidebar as Waiting.

---

## 5. Confirm what to check

**URL.** `/review/:id/confirm`
**Used by.** Designer
**Journey.** 1B, 1C

**How the designer gets here.** From the notification "Tom asked you to check Cart page", or from the feature row in the left sidebar.

**Center**

- Title: the feature name. Under it: who asked and the developer's note.
- A title, **Found cases**, and the cases the AI found, in white boxes with rounded corners and a thin gray border, grouped by section (**Logged in**, **Logged out**). Each box has its section name as a bold title. Each case is a row with a rounded black checkbox on the left, the case name as its title, and one plain line under it that says what the case is. All are on by default. The A/B test group is not shown here.
- Two buttons: **Yes, show 5 cases** (primary) and **Something is missing** (secondary). It opens a popup "What did we miss?" with one input and **Send**. The placeholder says that the designer heard about an A/B test but does not see it in the cases. Nothing is added to the list. It only tells the AI to look again. The number on the primary button is the number of cards that are on.

**States**

- No chip on in a group: "Keep at least one on."
- Nothing special found: this page is skipped and the designer goes straight to the case screen.
- Reading the code: Skeleton blocks and the line "Reading the code".

---

## 6. Case screen

**URL.** `/review/:id/cases/:caseId`
**Used by.** Designer and developer
**Journey.** 1D, 2, 3, 4

```
+--------------+-------------------------------------+--------------+
| Left sidebar | Cart page          [Send]    | Feedback (3) |
|              | [Case dropdown v]       |              |
|              | +---------------------------------+ | 1 Move the   |
|              | |   Design preview                | |   badge up   |
|              | |       (1)  (2)                  | | 2 Text too   |
|              | +---------------------------------+ |   small      |
|              | [Approve]  [Needs fix]              |              |
+--------------+-------------------------------------+--------------+
```

**Center**

- Header: feature name, the commit button, and the **Inspect** button.
- Next to the feature name: a small button with a speech bubble icon and "Asked by Tom". It opens a popup with the number of commits on the branch and the branch name. The newest commit is shown as "Latest", like a git log (commit id, author, date, subject, list of changes). Two older commits sit below it, folded; click one to open it. When the developer pushes a fix, the new fix commit appears on top as "Latest" and the earlier commit moves down into the folded list.
- Case dropdown: at the left of the bottom bar. It shows the selected case and its status. It opens upward with a list of all cases in two sections, each with a status badge. The first case that is Not checked is selected.
- **Show earlier comments** switch, at the left of Inspect. It only shows after a re-check, when some comments are already fixed. It is off at first, so only the open comment shows. When it is on, the earlier comments show too.
- **Full screen** button, next to Inspect. The preview fills the whole window. Pins, comments and Inspect still work, and Inspect and **Exit full screen** are at the top right. A smaller version of the bottom bar (case dropdown, Send to developer) stays at the bottom. Esc also leaves full screen. After the designer sends the comments to the developer, full screen ends by itself.
- **Inspect** button, at the right of the header. When it is on, hovering the design shows a box like browser dev tools: blue for the content, green for padding, orange for margin. A small card shows the element name, size, font (size / weight / line height), family, color, padding and margin. Clicking starts a new comment that already holds these numbers, so the designer can add the design value next to it. In the real product the developer's app runs on another address, so a small script in that app has to send these numbers. Not built yet: measuring the distance between two elements.
- Design preview: the live screen for the selected case, with pins on top. It is drawn like a real website. It sits on a light gray work area with a small label "Preview" and the branch name, so it is not mistaken for the CaseBook screen.
- Right sidebar (Feedback): closed at first. The person opens it with the button in the header.
- A bar fixed at the bottom of the screen, always visible when scrolling. Left: the case dropdown. There is no Review done button and no Needs fix button: a case becomes Needs fix by itself when the designer leaves a comment, and a case with no comments counts as approved. Right: the big button (for example **Send to developer**). The label changes with the situation (see the user journey, 3A).

**Right sidebar.** Feedback (see 2.2).

**Demo cases.** The demo reviews a shop cart page. It looks like a shop cart page: a black and white style with bold capital headings, product photos, a summary box and Checkout and Continue shopping buttons. There are four cases:

The cases are in the dropdown, in two sections. The person is logged in by default:

- **Logged in**
  1. **1 or more items:** two products. A line and bar show how far the person is from free shipping. The summary shows the shipping fee.
  2. **Sold out:** one product is sold out (faded, with a message). The summary leaves it out. Checkout is off until it is removed.
  3. **No items:** a message "Your cart is empty". The summary shows £0.00 GBP and Checkout is off.
  4. **Free shipping:** the cart total reaches £25. The line says "You qualify for free shipping" and the summary shows Shipping & Handling as Free.
- **Logged out**
  1. **1 or more items:** the same as the logged in case, with the line "Sign in | Create account for a faster checkout".

**Re-check view** (`?view=recheck`)

- The dropdown shows only the cases that changed. Other cases are still reachable.
- The preview shows the new version. Old pins stay on it.
- The feedback list shows the developer mark and the AI mark on each item.

**States**

- Loading the preview: Skeleton in the preview area.
- The preview cannot be shown: an empty state with the reason in plain words and a **Try again** button.
- Everything Approved: the big button reads **Approve and finish**.
- Review finished: the page is read-only and shows a banner "Approved". The feature shows Approved in the left sidebar.
