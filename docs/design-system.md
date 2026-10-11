# Design system

This file is the single source of truth for how the product looks and behaves.
Read it before you design or build any screen.

- Mobile first.
- Light mode only. Colors are used by role (see "Semantic tokens"), so a dark theme can be added later by changing one table.
- All values in this file are final. The code version lives in `app/src/styles/tokens.css`.

---

## 1. Principles

1. **Calm.** Warm gray surfaces, thin lines, small text. The screen should feel quiet so that status colors stand out.
2. **Clear status.** People scan many cases fast. Color plus a word plus an icon tell them what is done, waiting, or broken.
3. **Plain words.** Short sentences. Common UX terms. No code words for designers.
4. **Honest.** Say what works today. If something is not ready, say so.
5. **Flat.** No shadows and no gradients. Use thin borders and a dim overlay to show layers.
6. **For everyone.** Real form controls, visible focus, 44px touch targets, enough contrast, keyboard support.

---

## 2. Foundations

### 2.1 Color

We use five scales. Gray is the base. Green, yellow, red, and blue carry meaning.

Step meaning (the same for every hue):

| Step | Use |
| --- | --- |
| 50 | Soft background (badge background, selected row) |
| 200 | Light border or tint |
| 400 | Mid tone (charts, illustrations, icons on dark) |
| 600 | Main color: icons, dots, fills |
| 700 | Text on a 50 background, solid fills that hold white text |
| 900 | Deepest tone (rare) |

#### Gray (base)

| Token | Hex | Use |
| --- | --- | --- |
| `gray-50` | `#F7F7F4` | Page background |
| `gray-100` | `#F1F0EC` | Panels, hover, code background, disabled fill |
| `gray-200` | `#E6E5E0` | Default border, dividers, pressed fill, skeleton |
| `gray-250` | `#DEDDD7` | Button border |
| `gray-300` | `#C9C8C1` | Strong border (inputs, menus, popups), switch track off |
| `gray-500` | `#8F8E86` | Placeholder, disabled text, unchecked box border |
| `gray-600` | `#6A6962` | Secondary text |
| `gray-900` | `#26251E` | Main text, primary button, tooltip, toast |
| `white` | `#FFFFFF` | Cards and surfaces |

#### Green: done, approved

| Token | Hex |
| --- | --- |
| `green-50` | `#E3F6EC` |
| `green-200` | `#9FDFBD` |
| `green-400` | `#3FBF86` |
| `green-600` | `#12975F` |
| `green-700` | `#0D7A4C` |
| `green-900` | `#084A2D` |

#### Yellow: waiting, be careful

| Token | Hex |
| --- | --- |
| `yellow-50` | `#FFF4D1` |
| `yellow-200` | `#FFDC7A` |
| `yellow-400` | `#F5B82E` |
| `yellow-600` | `#D98F06` |
| `yellow-700` | `#9A6200` |
| `yellow-900` | `#523300` |

#### Red: needs fix, error, danger

| Token | Hex |
| --- | --- |
| `red-50` | `#FFE6EC` |
| `red-200` | `#FFADC1` |
| `red-400` | `#F26085` |
| `red-600` | `#E0245A` |
| `red-700` | `#B81448` |
| `red-800` | `#9C1140` |
| `red-900` | `#5C0A24` |

`red-800` is used only for the pressed and hover color of the destructive button.

#### Blue: selected, links, focus

| Token | Hex |
| --- | --- |
| `blue-50` | `#E6F0FF` |
| `blue-200` | `#A8C8FF` |
| `blue-400` | `#5B97F5` |
| `blue-600` | `#2F6FE0` |
| `blue-700` | `#2257B8` |
| `blue-900` | `#12306B` |

#### Meaning of each hue

| Hue | Means | Never use it for |
| --- | --- | --- |
| Gray | Neutral, not started | Warnings or success |
| Green | Done, approved, success | Selection (use blue) |
| Yellow | Waiting, needs attention soon | Errors |
| Red | Needs fix, error, danger | Decoration |
| Blue | The thing you picked, on/checked, links, focus | Status |

Blue is not a status. It only shows "this is selected or on" or "this is a link".

#### Semantic tokens

Use these names in code. They point to the scale tokens above.

| Token | Points to | Use |
| --- | --- | --- |
| `--color-bg` | `gray-50` | Page |
| `--color-panel` | `gray-100` | Side panels, quiet areas, hover fill |
| `--color-surface` | `white` | Cards, inputs, menus, dialogs |
| `--color-border` | `gray-200` | Default borders and dividers |
| `--color-border-button` | `gray-250` | Secondary button border |
| `--color-border-strong` | `gray-300` | Input, menu, popup borders |
| `--color-border-hover` | `gray-500` | Input border on hover |
| `--color-text` | `gray-900` | Main text |
| `--color-text-muted` | `gray-600` | Secondary text, hints |
| `--color-text-disabled` | `gray-500` | Disabled text, placeholder |
| `--color-primary` | `gray-900` | Primary button fill |
| `--color-primary-hover` | `#3B3A33` | Primary button on hover |
| `--color-primary-active` | `#4B4A43` | Primary button pressed |
| `--color-on-primary` | `gray-50` | Text on primary |
| `--color-danger-solid` | `red-700` | Destructive button fill |
| `--color-danger-solid-hover` | `red-800` | Destructive hover |
| `--color-danger-solid-active` | `#860E36` | Destructive pressed |
| `--color-pressed` | `gray-200` | Pressed fill for secondary, ghost, icon button, menu item |
| `--color-disabled-bg` | `gray-100` | Disabled fill |
| `--color-disabled-border` | `gray-200` | Disabled border |
| `--color-selected-bg` | `blue-50` | Selected card or row |
| `--color-selected` | `blue-600` | Selected border, checked controls, switch on |
| `--color-selected-hover` | `blue-700` | Checked controls on hover |
| `--color-link` | `blue-700` | Links |
| `--color-link-hover` | `blue-900` | Links on hover and pressed |
| `--color-focus` | `blue-600` at 35% | Focus ring |
| `--color-success-bg` / `-fg` / `-icon` | `green-50` / `green-700` / `green-600` | Approved |
| `--color-warning-bg` / `-fg` / `-icon` | `yellow-50` / `yellow-700` / `yellow-600` | Waiting |
| `--color-danger-bg` / `-fg` / `-icon` | `red-50` / `red-700` / `red-600` | Needs fix, error |
| `--color-overlay` | `gray-900` at 45% | Dim layer behind a dialog |

#### Color rules

- Text on a soft background (50) uses the 700 step of the same hue.
- Icons and dots use the 600 step.
- Never show status with color alone. Always add a word. An icon is a good extra.
- White text is allowed on `gray-900`, `blue-600`, `red-600`, and any 700 or 800 step. Do not put white text on `green-600`, `yellow-600`, or lighter steps.
- Placeholder text (`gray-500`) is lighter than the 4.5:1 target. Never put needed information in a placeholder. Always use a visible label.
- Use at most one primary (dark) button per view.

### 2.2 Typography

Font: the system font. Weights: **400 and 500 only.** Do not use bold.

Product font: **Inter**. Fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

Demo website font (the Clearwell cart page, not part of the product UI): **Archivo**, a firm sans-serif like Helvetica. Fallback: `"Helvetica Neue", Helvetica, Arial, sans-serif`.

Both fonts are bundled with the app. They do not load from the internet.
Mono stack: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

| Style | Size / line | Weight | Use |
| --- | --- | --- | --- |
| Display | 28 / 32 | 400 | One big statement on a landing page. Letter spacing -2%. |
| Title | 20 / 28 | 500 | Page title, dialog title, section title |
| Heading | 16 / 24 | 500 | Card title, list group title |
| Heading small | 14 / 20 | 500 | Titles inside cards, such as the welcome cards and empty states |
| Body | 14 / 20 | 400 | Default text in the app |
| Small | 13 / 20 | 400 | Hints, meta, helper text. Uses `gray-600`. |
| Label | 11 / 16 | 500 | Small section label. Normal capitals, like all other text. Uses `gray-600`. |
| Mono | 12 / 18 | 400 | Branch names, file names, code |

Rules:

- Write in sentence case. Only the first word and proper names get a capital letter.
- Keep one h1 per page. Use Title for it.
- Do not skip heading levels.
- Keep lines under about 70 characters for reading text.
- Do not use bold for emphasis. Use 500 weight or a different color step.
- Use the Label style only for short labels (one to three words), never for sentences.

### 2.3 Space

Base unit: 4px.

| Token | Value |
| --- | --- |
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-7` | 48 |
| `space-8` | 72 |

- Space inside a component: 8 to 16.
- Space between components: 16 to 24.
- Space between page sections: 32 to 48.

### 2.4 Shape (radius)

| Token | Value | Use |
| --- | --- | --- |
| `radius-xs` | 4 | Inline code |
| `radius-sm` | 6 | Badge, tooltip, menu item, skeleton, small button |
| `radius-md` | 8 | Button, input, checkbox (5px), dropdown trigger, icon button |
| `radius-lg` | 10 | Popup, dropdown menu, toast |
| `radius-xl` | 12 | Card, empty state |
| `radius-2xl` | 16 | Dialog |
| `radius-pill` | 999 | Count badge, switch |

### 2.5 Borders and layers (no shadows)

- Default border: 1px `gray-200`.
- Border for floating things (menu, popup): 1px `gray-300`.
- We do not use shadows. A floating layer is shown by its border. A dialog is shown by the dim overlay. A toast is shown by its dark fill.
- At most two floating layers on screen at the same time. For example, a popup and a tooltip. A third layer must be a dialog. A toast does not count.

Stacking order (z-index):

| Layer | Value |
| --- | --- |
| Page header | 10 |
| Sidebar backdrop (small screens) | 12 |
| Sidebar panel (small screens) | 15 |
| Dropdown menu | 20 |
| Popup | 30 |
| Tooltip | 40 |
| Overlay and dialog | 50 |
| Toast | 60 |

### 2.6 Focus

- Every control that can be used must show focus when you use the keyboard.
- Focus ring: 3px, `blue-600` at 35%, around the control.
- For inputs, the border also turns `blue-600`.
- Never remove the focus ring without a replacement.

### 2.7 Touch targets

- Minimum height for anything you tap: 44px.
- Checkbox, radio, and switch rows are 44px tall, even though the control is smaller.
- Small buttons and icon-only controls may look small, but their tap area must be 44px.

### 2.8 Motion

- Color and border changes: 120ms, ease.
- Skeleton pulse: 1.4s, opacity from 100% to 50%.
- Spinner: 0.8s, linear, full turn.
- Tooltip: fade in and out in 120ms.
- Toast: drops in from the top in 320ms. It fades to clear in 250ms when it leaves.
- Respect "reduce motion". When it is on, turn off all animation. A spinner is replaced by the word "Working".
- No bouncing, sliding, or decorative motion.

### 2.9 Icons

- Style: outline. Library: Tabler Icons.
- Sizes: 16 (inside text, menus, small buttons), 18 (list rows, buttons, close), 22 (empty states).
- Icon color follows the text color, or the status color (600 step) when it shows status.
- An icon alone needs an accessible name (`aria-label`). A decorative icon is hidden from screen readers.

### 2.10 Layout

- Mobile first. No horizontal scroll at 390px wide.
- Content max width: 960px. Side padding: 16px.
- Grids: 1 column on phones, 2 columns from 640px, 3 columns from 900px.
- The whole app sits inside the App shell (see 4.17). The 960px max width applies to content inside the center area.
- Breakpoints: 640px and 900px. These are the only two.

---

## 3. Status language

These four states appear all over the product. Always show them the same way.

| Status | Badge color | Icon | Meaning |
| --- | --- | --- | --- |
| Not checked | Gray | circle, dashed | Nobody looked at it yet |
| Waiting | Yellow | clock | Someone needs to act (for example, the developer is fixing) |
| Needs fix | Red | alert circle | Reviewer found a problem |
| Approved | Green | circle with check | Reviewer is happy with it |

Rules:

- Use these exact words. Do not invent new ones like "Pending" or "Blocked".
- A status always has a word. The icon is extra.
- "Selected" is not a status. It is a UI state that uses blue.

---

## 4. Components

Each component has: what it is, when to use it, when not to use it, how it looks, states, content rules, and accessibility.

### 4.1 Button

**What it is.** The control that starts an action.

**Variants**

| Variant | Look | Use |
| --- | --- | --- |
| Primary | `gray-900` fill, `gray-50` text | The one main action in a view (Approve, Send review) |
| Secondary | White fill, 1px `gray-250` border, `gray-900` text | Other actions (Add comment, Open) |
| Ghost | No fill, no border, `gray-900` text | Quiet actions (Not now, Skip) |
| Destructive | `red-700` fill, white text | Actions that delete or cannot be undone (Remove project) |

**Sizes**

| Size | Height | Padding | Radius | Text | Icon | Use |
| --- | --- | --- | --- | --- | --- | --- |
| Default | 44 | 0 16 | 8 | 14 / 500 | 18 | Everywhere |
| Small | 32 | 0 12 | 6 | 13 / 500 | 16 | Dense lists and table rows. On touch screens the tap area grows to 44px. |

**Icon button**

- 44 x 44 tap area, radius 8, icon 18, no fill. Use it for Close, More, and other single-icon actions.
- Always has an `aria-label` and a tooltip.

**States**

| State | Primary | Secondary | Ghost | Destructive |
| --- | --- | --- | --- | --- |
| Default | `gray-900` fill | White fill, `gray-250` border | No fill | `red-700` fill |
| Hover | `#3B3A33` fill | `gray-100` fill | `gray-100` fill | `red-800` fill |
| Pressed | `#4B4A43` fill | `gray-200` fill | `gray-200` fill | `#860E36` fill |
| Focus | Focus ring | Focus ring | Focus ring | Focus ring |
| Disabled | `gray-200` fill, `gray-500` text | `gray-100` fill, `gray-200` border, `gray-500` text | `gray-500` text | `gray-200` fill, `gray-500` text |
| Loading | Fill stays, 16px spinner before the label, not clickable | Same | Same | Same |

The icon button uses the Ghost states.

**Other specs**

- Icon (optional): 6px gap from the text. Put it before the text. "Go to" arrows go after.
- Loading: the label stays so the button does not change width. Set `aria-busy="true"`.

**When to use**

- Use a button for actions (save, send, approve).
- Use a link for going to another page.
- Use Destructive only for actions that remove something or cannot be undone. Put it inside a confirm dialog when the result is big.

**When not to use**

- Do not put two primary buttons in one view.
- In a confirm dialog for a destructive action, the Destructive button replaces the primary button. Never show both.
- Do not use a button as a link. Do not use a link as a button.

**Content**

- Start with a verb. One to three words. Sentence case. No period.
- Good: "Approve", "Send review", "Remove project". Bad: "OK", "Submit", "Click here".

**Accessibility**

- Use a real `<button>` or `<a>`.
- Avoid disabled buttons. Leave the button enabled and show a message when someone uses it without the needed input. If you must disable it, say why next to it.

---

### 4.2 Badge

**What it is.** A small label that shows status or a count.

**Status badge**

- Height 22, padding 0 8, radius 6, text 12 / 500.
- Background is the 50 step. Text is the 700 step.
- Optional 6px dot in the 600 step, before the text.
- Variants: Gray (Not checked), Green (Approved), Yellow (Waiting), Red (Needs fix), Blue (Selected, or a neutral highlight).

**Release badge**

- Shows where approved work is in release. It is not a review status.
- Same size as the status badge, but outlined: no fill, 1px `gray-250` border, text 12 / 500.
- Words: **Not merged** (text `gray-600`), **Merged** (text `gray-900`), **Deployed** (text `gray-900`, with a 14px check icon before the word).
- Show it only after a feature is Approved. Never next to a review status that is not Approved.
- Do not use color for it. Color is kept for review status.

**Count badge**

- Round (pill). Min width 20, height 20, text 11 / 500.
- Dark (`gray-900` fill, `gray-50` text) for a normal count.
- Red (`red-600` fill, white text) for a count that needs attention.
- Show "99+" for numbers above 99.

**States.** A badge has no hover, pressed, or disabled state. It is not interactive.

**When to use**

- To show the status of a case, review, or comment.
- To show how many items are in a list or need attention.

**When not to use**

- Do not use a badge as a button.
- Do not use a badge for long text. Keep it to one to three words.
- Do not show many colors at once in one list. Show only the statuses that apply.

**Accessibility**

- The word is the information. Color is extra.
- A count badge next to a label should be read as part of that label, for example "Comments, 3".

---

### 4.3 Card

**What it is.** A white box that groups related content.

**Specs**

- White fill, 1px `gray-200` border, radius 12.
- Padding 14 vertical, 16 horizontal.
- Title: Heading style (16 / 24 / 500). In a compact card use Body size (14) with 500 weight.
- Text: Body (14 / 22), `gray-600`.
- Actions at the bottom, 12px below the text. Left aligned.

**Selectable card**

- Used for pick-one choices (project, branch, screen, device).
- It is a real radio button under the hood. The whole card is the tap area.

| State | Look |
| --- | --- |
| Default | White fill, `gray-200` border |
| Hover | Border `gray-300` |
| Focus | Focus ring |
| Selected | Border and inset line `blue-600`, fill `blue-50` |
| Selected, hover | Border and inset line `blue-700` |
| Disabled | Fill `gray-100`, border `gray-200`, text `gray-500`. Prefer to hide an option instead. |

A plain card (not selectable) has no hover state.

**When to use**

- To group one object (a branch, a case, a comment) with its details and actions.
- For pick-one choices that need a title and a short description.

**When not to use**

- Do not put a card inside a card.
- Do not use a card for one short line of text. Use a list row.
- Do not make a whole card clickable if it also has buttons inside. Pick one.

**Accessibility**

- If the card is a choice, use a radio input with a label. Do not use a div with a click handler.

---

### 4.4 Checkbox

**What it is.** A control for turning an option on or off, or for picking several items.

**Specs**

- Box 18 x 18, radius 5, border 1.5 `gray-500`, white fill.
- Row height 44. Gap 10 between the box and the label. Label is Body (14).
- Optional helper text under the label in Small (13) `gray-600`.

**States**

| State | Look |
| --- | --- |
| Unchecked | Border `gray-500`, white fill |
| Unchecked, hover | Border `gray-600` |
| Focus | Focus ring on the box |
| Checked | Fill and border `blue-600`, white check mark |
| Checked, hover | Fill and border `blue-700` |
| Indeterminate | Fill and border `blue-600`, white 2px dash, 10px wide. For a "select all" when only some items are picked. |
| Disabled, unchecked | Fill `gray-100`, border `gray-300`, label `gray-500` |
| Disabled, checked | Fill and border `gray-300`, white check, label `gray-500` |
| Error | Border `red-600`, message under the group in `red-700` |

**When to use**

- Settings that are on or off and are saved with a Save button (Notify me when the developer pushes).
- Picking more than one item from a list.

**When not to use**

- Do not use it for pick-one choices. Use a radio button.
- Do not use it for a setting that applies right away. Use a switch.

**Content**

- The label says what happens when it is checked. Write it as a positive statement. Good: "Notify me when the developer pushes". Bad: "Do not disable notifications".

**Accessibility**

- Use a real `<input type="checkbox">` with a `<label>`. The label is clickable.
- Space key toggles it.
- Indeterminate uses the `indeterminate` property and `aria-checked="mixed"`.

---

### 4.5 Radio button

**What it is.** A control for picking exactly one option from a short list.

**Specs**

- Circle 18 x 18, border 1.5 `gray-500`, white fill.
- Row height 44. Gap 10. Label is Body (14).

**States**

| State | Look |
| --- | --- |
| Unselected | Border `gray-500`, white fill |
| Unselected, hover | Border `gray-600` |
| Focus | Focus ring on the circle |
| Selected | Border `blue-600`, 8px `blue-600` dot in the center |
| Selected, hover | Border and dot `blue-700` |
| Disabled, unselected | Fill `gray-100`, border `gray-300`, label `gray-500` |
| Disabled, selected | Fill `gray-100`, border `gray-300`, `gray-300` dot, label `gray-500` |

**When to use**

- Two to six options, and people need to see all of them.
- Examples: device size, review mode.

**When not to use**

- More than six options. Use a dropdown.
- Options that need a title and description. Use selectable cards.

**Rules**

- One option is selected by default when there is a clear safe choice.
- Group the options with a visible group label.

**Accessibility**

- Use real radio inputs in a `<fieldset>` with a `<legend>`.
- Arrow keys move between options.

---

### 4.6 Input

**What it is.** A text field. There are two kinds: single line (Input) and multi-line (Text area, used for comments).

**Specs (single line)**

- Height 44. Padding 0 12. Radius 8. Border 1px `gray-300`. White fill.
- Text: Body (14), `gray-900`.
- Placeholder: `gray-500`.
- Label above the field: Small (13) with weight 500. Gap 4.
- Hint under the field: Small (13), `gray-600`. Gap 4.

**Text area**

- Min height 88 (about three lines). Padding 10 12. Same border, radius, and states as Input.
- Grows with the text up to 240px, then scrolls.
- Resize handle: vertical only.
- Optional character count under the field, right aligned, Small (13) `gray-600`. Turns `red-700` when over the limit.

**States**

| State | Look |
| --- | --- |
| Default | Border `gray-300` |
| Hover | Border `gray-500` |
| Focus | Border `blue-600` plus focus ring |
| Filled | Same as default, text `gray-900` |
| Error | Border `red-600`, hint in `red-700` with a clear fix |
| Disabled | Fill `gray-100`, border `gray-200`, text `gray-500` |
| Read-only | Fill `gray-50`, border `gray-200`, text `gray-900`. Can be focused and copied. |

**When to use**

- When people type free text or a value.

**When not to use**

- Do not use it when there is a short fixed list of options. Use radio buttons or a dropdown.

**Content**

- Always show a visible label. Never use the placeholder as the label.
- Placeholder shows an example of good input, for example "Say what to change".
- Error text says what is wrong and how to fix it. Good: "Pick a branch from the list." Bad: "Invalid input."

**Accessibility**

- Link the label to the input.
- Link the hint and error text with `aria-describedby`.
- Set `aria-invalid="true"` on an input with an error.
- Show the error when the person leaves the field or sends the form, not while they are still typing.

---

### 4.7 Dropdown menu

**What it is.** A button or field that opens a list of choices or actions.

There are two kinds:

- **Select:** the trigger looks like an input and shows the chosen value. Use it to pick one value (for example, a project).
- **Action menu:** the trigger is a button or icon button (for example, "More"). Items run actions.

**Trigger specs (select)**

- Same as Input: height 44, radius 8, border `gray-300`. Same states as Input.
- Chevron-down icon (18px, `gray-600`) on the right.
- Open: border `blue-600` plus focus ring.

**Menu specs**

- White fill, 1px `gray-300` border, radius 10, padding 4.
- 6px gap below the trigger. Same width as the trigger for a select. Min width 180 for an action menu.
- Item: height 40, padding 0 10, radius 6, Body (14).
- Selected item (select): check icon on the right.
- Divider: 1px `gray-200`, 4px space above and below.
- Danger item: text `red-700`. Put it last, below a divider.

**Item states**

| State | Look |
| --- | --- |
| Default | No fill |
| Hover or keyboard focus | `gray-100` fill |
| Pressed | `gray-200` fill |
| Selected | Check icon on the right, text weight 500 |
| Disabled | Text `gray-500`. Cannot be picked or focused with a pointer. |

**When to use**

- Seven or more options.
- Actions that would crowd the screen.

**When not to use**

- Two to six options that people should compare. Use radio buttons.
- The one main action on a screen. Use a button.

**Content**

- Items are short. Start action items with a verb ("Add a project").
- Do not nest menus inside menus.

**Accessibility**

- Arrow keys move. Enter or Space chooses. Escape closes and returns focus to the trigger.
- Typing a letter jumps to a matching item.
- The trigger has `aria-haspopup` and `aria-expanded`.

---

### 4.8 Empty state

**What it is.** What people see when there is nothing to show yet.

**Specs**

- White fill, 1px `gray-200` border, radius 12, padding 28 vertical and 20 horizontal. Centered.
- Icon in a 44px `gray-100` circle. Icon 22px, `gray-600`.
- Title: Heading (16 / 24 / 500).
- Text: Body (14 / 22), `gray-600`, max width 240, centered. Gap 4 from the title.
- One primary button, 14px below the text.

**When to use**

- A list or page that has no items yet (no reviews, no comments).
- A search or filter with no results.

**When not to use**

- While data is loading. Use a skeleton.
- When something failed. Use an error message that explains what to do.

**Content**

- The title names the space or the situation: "No reviews yet".
- The text tells the person what they can do next. One short sentence.
- The button is the next step: "Start a review".
- Do not blame the person. Do not apologize.
- For "no results", say how to change the search instead of showing a button.

**Accessibility**

- The icon is decorative. Hide it from screen readers.

---

### 4.9 Text (headings, body, links)

**What it is.** All the words on the screen. See section 2.2 for sizes.

**When to use which style**

| Style | Where |
| --- | --- |
| Display | One statement on a landing page |
| Title | Page title, dialog title |
| Heading | Card title, group title |
| Body | Everything else |
| Small | Hints, meta, helper text |
| Label | Tiny group label |
| Mono | Branch names, file names, code |

**Link states**

| State | Look |
| --- | --- |
| Default | `blue-700`, underline, 2px offset |
| Hover | `blue-900` |
| Pressed | `blue-900` |
| Focus | Focus ring |
| Visited | Same as default |

**Rules**

- Use semantic HTML (`h1`, `h2`, `p`, `ul`). The visual style is separate from the heading level.
- Main text is `gray-900`. Secondary text is `gray-600`. Do not use `gray-500` for readable text.
- Write short sentences. Use common words.
- Show a branch or file name in Mono so it is easy to tell from normal words.

---

### 4.10 Markdown

**What it is.** The style for formatted text that people or AI write: comments, explanations, fix notes.

**Supported elements and their style**

| Element | Style |
| --- | --- |
| Heading (h2) | Title size (20 / 28 / 500). Use h2 and h3 only. |
| Paragraph | Body (14 / 22). 8px gap below. |
| List | Bullets or numbers. 18px left padding. |
| Inline code | Mono 12, `gray-100` background, radius 4, padding 1 5 |
| Code block | Mono 12 / 18, `gray-100` background, radius 8, padding 10 12. Scrolls sideways. |
| Quote | 3px left border `gray-300`, `gray-600` text, 12px left padding. Square corners. |
| Link | Same as the link states in section 4.9 |

**When to use**

- Any text written by users or by AI that may contain lists, code, or links.

**When not to use**

- UI labels and buttons. These are plain text.

**Rules**

- Do not allow raw HTML. Only render the elements in the table.
- Open links in a new tab and show that they leave the app.
- Keep a code block inside its box. Do not let it push the page wider.
- A markdown block lives inside a card or panel. It does not need its own box.

---

### 4.11 Skeleton

**What it is.** A gray placeholder shape that shows while content loads.

**Specs**

- Fill `gray-200`. Radius 6. Avatar shapes are circles.
- Pulse: opacity 100% to 50% to 100%, 1.4s, forever.
- With "reduce motion" on: no animation.

**When to use**

- Content that takes more than about 300ms to load and has a known shape (a card, a list, a screen preview).
- Show it after a short delay (about 300ms). If the data loads faster, show nothing.

**When not to use**

- Short waits. A flash of skeleton feels worse than a short blank.
- Errors or empty results.
- Actions like "Send" that wait on the server. Use the loading state on the button.

**Rules**

- Match the shape and size of the real content. The page should not jump when the content arrives.
- Show the same number of rows as the real list, up to about five.
- If loading takes more than about 10 seconds, show a message and a Retry button.

**Accessibility**

- Mark the loading area with `aria-busy="true"`.
- Skeleton shapes are hidden from screen readers. Add a visually hidden "Loading" message.

---

### 4.12 Tooltip

**What it is.** A tiny label that explains an icon or a short term when you hover or focus it.

**Specs**

- Fill `gray-900`. Text `gray-50`, 12 / 16.
- Padding 6 10. Radius 6.
- 5px arrow. 8px gap from the target. Default position: above. Flips below if there is no room.
- Shows on hover and on keyboard focus. Hides on Escape or when the pointer leaves.
- Shows after about 300ms. Hides right away.

**When to use**

- To name an icon-only button.
- To explain a short term in one line.

**When not to use**

- For important information. Touch screens have no hover. Put important text on the page.
- For links, buttons, or long text. Use a popup.
- On a disabled control as the only explanation.

**Content**

- One short line. About 60 characters or fewer.
- No period. Sentence case.

**Accessibility**

- Use `role="tooltip"` and connect it with `aria-describedby`.
- The tooltip must stay open while the pointer is over it.

---

### 4.13 Popup (popover)

**What it is.** A small panel that opens next to the thing that opened it. It holds a short message or a small choice.

**Specs**

- White fill, 1px `gray-300` border, radius 10, padding 14.
- Max width about 300. Keep at least 16px from the screen edge.
- Title: Body (14) with 500 weight. Text: Small (13 / 20), `gray-600`.
- Buttons at the bottom right: ghost on the left, primary on the right. 12px above.

**When to use**

- A quick confirmation ("All done? We will send your comments to Tom.").
- A short explanation with an action.
- A small set of options.

**When not to use**

- Long forms or important decisions. Use a dialog.
- A hint. Use a tooltip.

**Behavior**

- Opens on click or tap, not on hover.
- Closes when you press Escape, click outside, or finish the action.
- Opens next to the trigger. Stays inside the screen. Flips above or below as needed.

**Accessibility**

- If it has buttons or inputs, move focus into it when it opens. Return focus to the trigger when it closes.
- The trigger has `aria-expanded`.

---

### 4.14 Overlay and dialog

**What it is.** A dialog is a box in the middle of the screen that asks for a decision. The overlay is the dim layer behind it that blocks the page.

**Overlay specs**

- Fill `gray-900` at 45%.
- Covers the whole screen. Clicking it closes the dialog, unless the action cannot be undone. Then it does not close.

**Dialog specs**

- White fill, 1px `gray-200` border, radius 16, padding 20.
- Width: full width minus 32px on phones. Max width 480.
- Title: Title style (20 / 28 / 500).
- Close: an icon button (see 4.1), top right.
- Text: Body (14 / 22), `gray-600`. 6px below the title.
- Footer: 16px below the text. Buttons on the right. Secondary on the left, primary on the right.
- Tall content scrolls inside the dialog. The title and footer stay in view.

**When to use**

- Decisions with a result that matters ("Approve all cases?").
- Short forms that need full attention.

**When not to use**

- Simple messages. Use a toast or inline text.
- Anything that could be a popup.
- A dialog on top of another dialog. Never.

**Content**

- The title is a question or a clear action ("Approve all cases?").
- The text says what will happen and what can be undone.
- The primary button repeats the action ("Approve all"). Do not use "OK".
- For a destructive action, the button is Destructive and says what it removes ("Remove project").
- Always give a way out: a Cancel button and a Close icon.

**Accessibility**

- `role="dialog"` with `aria-modal="true"` and a label.
- Move focus into the dialog when it opens. Keep it inside (focus trap). Return it to the trigger when it closes.
- Escape closes it.
- Stop the page behind from scrolling.

---

### 4.15 Switch

**What it is.** A control that turns a setting on or off right away.

**Specs**

- Track 36 x 20, radius pill. Knob 16 x 16, white, 2px from the edge.
- The label is on the left. The switch is on the right. Row height 44.
- The knob moves in 120ms. With "reduce motion" on, it jumps.

**States**

| State | Look |
| --- | --- |
| Off | Track `gray-300`, knob white |
| Off, hover | Track `gray-500` |
| On | Track `blue-600`, knob white, knob on the right |
| On, hover | Track `blue-700` |
| Focus | Focus ring around the track |
| Disabled, off | Track `gray-200`, knob `gray-50`, label `gray-500` |
| Disabled, on | Track `blue-200`, knob white, label `gray-500` |

**When to use**

- A setting that takes effect the moment it changes (Notify me in Slack).

**When not to use**

- When a Save button is needed. Use a checkbox.
- For picking one of several options. Use radio buttons.

**Content**

- The label names the setting, not the action. Good: "Slack alerts". Bad: "Turn on Slack alerts".
- Show a toast if the change needs confirmation, for example "Slack alerts on".

**Accessibility**

- Use `role="switch"` and `aria-checked`. Space toggles it.
- The state must not depend on color alone. The knob position shows it.

---

### 4.16 Toast

**What it is.** A short message that appears at the top of the screen after an action and goes away by itself.

**Specs**

- Fill `gray-900`. Text `gray-50`, Body (14 / 22). Radius 10. Padding 12 16. Min height 44.
- Position: top center, 16px below the top edge. Max width 420. On phones, full width minus 32px.
- Optional status icon (18px) on the left: success uses `green-400`, error uses `red-400`.
- Optional action on the right: a text button in `blue-200` (for example, "Undo", "View").
- Optional close icon button.

**Behavior**

- Shows for 2 seconds, then fades out.
- An error toast stays until it is closed.
- The timer pauses on hover and focus.
- One toast at a time. More messages wait in a line.
- A toast does not count toward the two-layer limit.

**When to use**

- To confirm something that happened ("Review sent", "Comment added").
- To give a way to undo.

**When not to use**

- Form errors. Show them next to the field.
- Anything that needs a decision. Use a dialog.
- Long messages or messages with several actions.

**Content**

- One short sentence. State what happened. No "successfully". No exclamation marks.
- Good: "Review sent to the developer". Bad: "Your review was successfully sent!"

**Accessibility**

- Success and info toasts use `role="status"`. Error toasts use `role="alert"`.
- Do not move focus to a toast.
- Anything in a toast must also be reachable somewhere else, because it goes away.

---

### 4.17 App shell

**What it is.** The frame around every page: a header, a left sidebar, the center area, and a right sidebar. Every page uses it, so it must look and behave the same everywhere.

```
+--------------+--------------------------------+--------------+
| Left sidebar | Header                         | Right sidebar|
|              +--------------------------------+              |
|              | Center (the page)              |              |
+--------------+--------------------------------+--------------+
```

**Specs**

- Left sidebar: 280px wide. Fill `gray-100`. 1px `gray-200` border on the right.
- Right sidebar: 360px wide. Fill `gray-100`. 1px `gray-200` border on the left.
- Header: 56px tall. Fill `gray-50`. 1px `gray-200` border on the bottom. It sits above the center only, not above the sidebars.
- Center: fill `gray-50`. It takes all the space that is left. Page content follows the layout rules in 2.10.
- On screens 900px and wider, the sidebars and the center are separate cards. Each card has a 1px `gray-200` border and a 16px corner radius. There is an 8px gap between cards and an 8px margin around them. The page behind the cards uses `gray-100`.
- Sidebar content scrolls on its own. The header and the sidebars do not scroll away.
- Sidebar toggle: an icon button (see Button). Left sidebar icon: layout sidebar. Right sidebar icon: layout sidebar right. Tap area 44px.

**Behavior by screen width**

| Screen width | Left sidebar | Right sidebar |
| --- | --- | --- |
| 900px and wider | Sits beside the center and makes it narrower | Sits beside the center and makes it narrower |
| 640px to 899px | Opens on top of the center, from the left edge | Opens on top of the center, from the right edge. Only one sidebar is open at a time |
| Under 640px | Opens on top, full height, 85% of the width (max 320px) | Opens as a sheet from the bottom, up to 85% of the height |

- On top-of-center sidebars, a backdrop (Overlay color) sits behind. Tapping it or pressing Escape closes the sidebar.
- On small screens, both sidebars are closed at first.
- On large screens, the sidebars open or closed as the person left them. The choice is remembered for each person.
- A closed sidebar is fully hidden. Only its toggle button stays visible, in the header.
- Sidebars open and close with no sliding animation. They appear and disappear at once.
- Selecting an item inside a sidebar on a small screen closes it.
- A sidebar that has no content for the current page (for example, the right sidebar on the landing page) is not shown, and its toggle is not shown either.

**Header content**

- Left: left sidebar toggle, then the app name.
- Middle: the page title. Text style Heading. One line, cut with an ellipsis.
- Right: page actions. The one primary button of the page goes last. The right sidebar toggle sits at the far right, with a count badge when there is something to show (for example, the number of comments).

**Tree item (a row in the left sidebar)**

- 44px tall. Padding 0 12. Radius 8.
- Level 1 is a group (for example, a project). It has a chevron on the left and can open and close. Text is Body, weight 500.
- Level 2 is an item (for example, a feature). It is indented by 16px and shows a Badge on the right. Text is Body, weight 400.
- Hover: `gray-200` fill. Selected: `blue-50` fill, text stays `gray-900`, and a 2px `blue-600` bar on the left edge.
- Quiet rows (finished items) use `gray-600` text and a quiet Badge.
- Long names are cut with an ellipsis. The full name shows in a Tooltip.

**Filter**

- A row of 2 to 3 text buttons at the top of a sidebar list, with one selected. The selected one has a `blue-50` fill and `blue-700` text.
- Only one is selected at a time.

**When to use**

- Always. Every page lives inside the shell.

**When not to use**

- Do not build a page with its own header or its own sidebars.
- Do not put page content in a sidebar when it is needed to finish the task. A person on a phone may never open it.

**Content**

- Sidebar headings are Label style, for example "Feedback". The left sidebar has no heading; it starts with the Add project button.
- Empty sidebars use the Empty state component with one short line.

**Accessibility**

- Left sidebar is `<nav>` with an accessible name. Right sidebar is `<aside>` with an accessible name. The center is `<main>`.
- Toggle buttons use `aria-expanded` and `aria-controls`, and have an accessible name ("Open projects", "Close feedback").
- When a sidebar opens on top of the center, focus moves into it and stays inside until it closes. When it closes, focus returns to the toggle.
- The tree uses real buttons for groups and real links for items. The selected item has `aria-current="page"`.
- The first link on every page is "Skip to main content".

---

### 4.18 Toggle chip

**What it is.** A pill-shaped button that is on or off. Several chips sit together, and each one is chosen on its own.

**Specs**

- Height 44. Padding 0 16. Radius pill. Text Body, weight 500. Gap between chips: 8.
- Off: white fill, 1px `gray-250` border, `gray-900` text.
- On: `blue-50` fill, 1px `blue-600` border, `blue-700` text, and a 16px check icon before the text.
- Hover (off): `gray-100` fill. Hover (on): border `blue-700`.
- Pressed: `gray-200` fill.
- Disabled: `gray-100` fill, `gray-200` border, `gray-500` text.
- Focus: focus ring (see 2.6).
- Chips wrap onto the next line when there is no room.

**Behavior**

- Click or tap toggles on and off.
- A group can require at least one chip to stay on. Then the last chip that is on cannot be turned off, and a message shows next to the group: "Keep at least one on."

**When to use**

- To pick which items to include from a short list. Example: A/B test versions and states on the confirm screen.

**When not to use**

- To pick exactly one option. Use Radio button.
- To turn a setting on or off right away. Use Switch.
- To move between views. Use Tabs.
- For more than about 8 chips in a group.

**Content**

- One to three words. Example: "Current", "Empty cart", "Sold out".
- Put a short plain explanation under the group, not inside the chip.

**Accessibility**

- It is a button with `aria-pressed`. The state is shown by the check icon and the fill, not by color alone.
- Chips in a group are inside an element with a group label.

---

### 4.19 Tabs

**What it is.** A row of tabs. Each tab shows one view. Only one view is shown at a time.

**Specs**

- Tab: min height 44. Padding 0 16. Text Body, weight 500, `gray-600`.
- Selected: text `gray-900`, and a 2px `blue-600` line at the bottom.
- Hover: `gray-100` fill. Pressed: `gray-200` fill. Focus: focus ring.
- The whole row has a 1px `gray-200` line at the bottom.
- A tab can show a status Badge after its label. Use the small status badge.
- A label can use two lines. Longer labels are cut with an ellipsis, and the full label shows in a Tooltip.
- Tabs are boxes in a grid. Each box has a 1px `gray-250` border and radius 8. The grid fits as many columns as the width allows (min 190px each) and wraps to new rows. It never scrolls sideways. Selected: `blue-50` fill and `blue-600` border.
- All cases always show, also in the re-check. Cases with no problem stay, so the designer can look at earlier comments and fixes.

**Behavior**

- Click or tap selects a tab and changes the view at once.
- The selected tab is remembered while the person stays on the screen.
- Arrow keys move between tabs. Home and End go to the first and last tab.

**When to use**

- To switch between cases of the same feature. Each tab is one case.

**When not to use**

- To move between pages. Use links or the sidebar.
- For steps that must be done in order.
- For one tab only. Show the content with no tabs.

**Content**

- Short labels that say what is different. Example: "Sold out". With more than one A/B version: "Version B + Sold out".
- All labels in one row follow the same pattern.

**Accessibility**

- Use `role="tablist"`, `role="tab"`, and `role="tabpanel"`. The selected tab has `aria-selected="true"`.
- The status is part of the tab name, for example "Sold out, Needs fix".

---

### 4.20 Pin

**What it is.** A numbered marker placed on the design. It shows exactly where a comment is about.

**Specs**

- Circle, 28px. A 2px white border keeps it visible on any design. Number inside: 12px, weight 500.
- Tap area: 44px, even though the circle is 28px.
- Color follows the status of the comment:

| Status | Fill | Content |
| --- | --- | --- |
| Needs fix | `red-700` | White number |
| Waiting | `yellow-400` | `gray-900` number |
| Not checked | `gray-600` | White number |
| Approved | `green-600` | White check icon |

- Selected: add a 3px `blue-600` ring around the pin.
- Hover: the number stays. The circle gets 1px larger on each side (30px).
- Dragging: the pin follows the pointer.
- A small pin (24px) is used in the feedback list.

**Behavior**

- The pin belongs to the element it points to. Its place is saved as that element plus a position inside it (as a percentage), so it stays in the right spot on any screen size.
- Click or tap selects the pin and opens its comment popup. The matching feedback item is highlighted in the list.
- The designer can drag a pin to a new spot before the feedback is sent.
- Numbers go up in the order pins were added. A number is never reused in the same case, even after a delete.
- A hidden pin (when the design is not shown) is not in the tab order.

**When to use**

- To point at one spot on a design.

**When not to use**

- For feedback about the whole screen. Add the comment at the top-left of the screen, or use a general comment in the list.
- As a status badge in lists. Use Badge.

**Accessibility**

- Each pin is a button. Its name says the number, status and the start of the comment, for example "Pin 2, needs fix: Move the badge up".
- Pins can be reached with Tab, in number order. Arrow keys move a selected pin by 8px.

---

### 4.21 Comment popup

**What it is.** A Popup attached to a pin. It is where the person writes, reads, edits or deletes a comment.

**Specs**

- Uses the Popup component (4.13). Width 300. It points to its pin and sits on the side with the most room.
- Phones (under 640px): it opens as a sheet from the bottom, up to 85% of the height. A backdrop sits behind it.

**Write mode** (a new comment or an edit)

- Top: the pin number and the title. No author or time line.
- Text area: at least 3 lines, placeholder "Say what to change". Max 500 characters. The counter shows from 450.
- Bottom: **Save** (small primary button) and **Cancel** (small secondary button).
- **Save** is not disabled when the field is empty. Pressing it shows the message next to the field: "Write a comment first."

**Read mode** (a saved comment)

- The comment text.
- A thin light line (`gray-100`) sits above the buttons.
- Buttons: **Edit** and **Delete** are icon buttons (pencil and trash, 32px; the trash uses the danger color). **Close** is a small secondary button.

**Behavior**

- A new popup opens as soon as the pin is placed. The text area has focus.
- Escape or **Cancel** closes it. A new pin with no text is removed. An edit goes back to the old text.
- Clicking outside does nothing while the text area has unsaved text.
- **Delete** removes the pin and comment, and shows an Undo toast for 5 seconds. After the feedback is sent, **Delete** first asks in a dialog.

**When to use**

- To write or read the comment of one pin.

**When not to use**

- For long threads. Replies go in the feedback list.

**Accessibility**

- It follows the Popup rules. Focus moves into it when it opens and returns to the pin when it closes.

---

### 4.22 Feedback list item

**What it is.** One row in the feedback list (right sidebar). It shows one comment and what happened to it.

**Specs**

- Padding 12 16. 1px `gray-200` line at the bottom.
- Left: small pin (24px) with the number.
- Middle:
  - Comment text, Body, cut after 3 lines. When selected, the full text shows.
  - Meta line, Small, `gray-600`: "Emma, 2 min ago". If edited, add "Edited".
- Right: a status Badge, then an icon button with a menu (Edit, Delete). The icon button has a 44px tap area.
- Hover: `gray-100` fill. Selected: `blue-50` fill.
- Developer view adds a line under the text:
  - Developer mark: a **Fixed** button. Once tapped, it becomes the text "Marked fixed" with a check icon, and tapping again undoes it.
  - AI mark: an outlined badge (like the release badge) with a sparkle icon: "AI: likely fixed", "AI: not sure", or "AI: no change found".
- Designer re-check view adds the same two marks, and the **Mark resolved** and **Still needs fix** buttons. The status badge reads **Resolved** or **Not resolved**. The AI mark is joined to the status badge as one short badge, for example **Not resolved · No change**.
- When the two marks disagree, show a warning line in `yellow-700` with an alert icon: "Marked fixed, but the AI found no change."

**Behavior**

- Click or tap selects the item, highlights its pin, and scrolls the design to show the pin.
- Selecting a pin on the design selects its item and scrolls the list to it.
- Items stay in pin order. They are never removed by a push. Only the designer can close one.
- A deleted item after sending stays as a quiet line: "Comment deleted by Emma".

**When to use**

- In the feedback list of the case screen.

**When not to use**

- For anything that is not feedback on a design.

**Accessibility**

- The item is a list item with a button for selecting. The status and marks are text, not only color.
- The menu follows the Dropdown menu rules.

---

### 4.23 Notifications (bell and list)

**What it is.** A bell button in the header. A dot shows when something is unread. Clicking it opens a list of notifications. Clicking a notification opens the page it is about.

**Bell**

- An icon button (44px tap area) at the right of the header. Icon: bell.
- Unread dot: 8px, `blue-600`, with a 2px border in the header color. It sits at the top right of the icon. No number. It shows when at least one notification is unread, and disappears when all are read.
- Accessible name: "Notifications", or "Notifications, 2 unread".

**List (a popup)**

- Uses the Popup rules (4.13), but wider. Width 360. On phones: the screen width minus 32.
- Opens below the bell, aligned to its right edge. Max height: the screen minus the header, then it scrolls.
- Top row: the title "Notifications" (Body, 500) and a small ghost button "Mark all as read". The button is only shown when something is unread.
- If there is nothing: one line, "No notifications yet.", centered, `gray-600`.

**Notification row**

- The whole row is one button. Min height 44. Padding 12 16. 1px `gray-200` line at the bottom.
- Top line: a 40px round avatar on the left, then the sender's name (Heading small, `gray-900`) with the time under it (Small, `gray-600`, for example "Just now", "2 min ago", "3 h ago", then a date). No extra space between the name and the time. The avatar is a photo of the sender. The sender is the other person.
- Unread: an 8px `blue-600` dot on the top right of the avatar, with a 2px white edge. Read: no dot.
- Under the top line: the message (Body), using the full width of the row, starting at the left edge of the avatar. Unread message: `gray-900`. Read message: `gray-600`.
- Hover: `gray-100` fill. Pressed: `gray-200` fill. Focus: focus ring.
- The whole row has a 1px `gray-200` line at the bottom.
- A tab can show a status Badge after its label. Use the small status badge.
- A label can use two lines. Longer labels are cut with an ellipsis, and the full label shows in a Tooltip.
- Tabs are boxes in a grid. Each box has a 1px `gray-250` border and radius 8. The grid fits as many columns as the width allows (min 190px each) and wraps to new rows. It never scrolls sideways. Selected: `blue-50` fill and `blue-600` border.
- All cases always show, also in the re-check. Cases with no problem stay, so the designer can look at earlier comments and fixes.

**Behavior**

- Click or tap selects a tab and changes the view at once.
- The selected tab is remembered while the person stays on the screen.
- Arrow keys move between tabs. Home and End go to the first and last tab.

**When to use**

- To switch between cases of the same feature. Each tab is one case.

**When not to use**

- To move between pages. Use links or the sidebar.
- For steps that must be done in order.
- For one tab only. Show the content with no tabs.

**Content**

- Short labels that say what is different. Example: "Sold out". With more than one A/B version: "Version B + Sold out".
- All labels in one row follow the same pattern.

**Accessibility**

- Use `role="tablist"`, `role="tab"`, and `role="tabpanel"`. The selected tab has `aria-selected="true"`.
- The status is part of the tab name, for example "Sold out, Needs fix".

---

### 4.20 Pin

**What it is.** A numbered marker placed on the design. It shows exactly where a comment is about.

**Specs**

- Circle, 28px. A 2px white border keeps it visible on any design. Number inside: 12px, weight 500.
- Tap area: 44px, even though the circle is 28px.
- Color follows the status of the comment:

| Status | Fill | Content |
| --- | --- | --- |
| Needs fix | `red-700` | White number |
| Waiting | `yellow-400` | `gray-900` number |
| Not checked | `gray-600` | White number |
| Approved | `green-600` | White check icon |

- Selected: add a 3px `blue-600` ring around the pin.
- Hover: the number stays. The circle gets 1px larger on each side (30px).
- Dragging: the pin follows the pointer.
- A small pin (24px) is used in the feedback list.

**Behavior**

- The pin belongs to the element it points to. Its place is saved as that element plus a position inside it (as a percentage), so it stays in the right spot on any screen size.
- Click or tap selects the pin and opens its comment popup. The matching feedback item is highlighted in the list.
- The designer can drag a pin to a new spot before the feedback is sent.
- Numbers go up in the order pins were added. A number is never reused in the same case, even after a delete.
- A hidden pin (when the design is not shown) is not in the tab order.

**When to use**

- To point at one spot on a design.

**When not to use**

- For feedback about the whole screen. Add the comment at the top-left of the screen, or use a general comment in the list.
- As a status badge in lists. Use Badge.

**Accessibility**

- Each pin is a button. Its name says the number, status and the start of the comment, for example "Pin 2, needs fix: Move the badge up".
- Pins can be reached with Tab, in number order. Arrow keys move a selected pin by 8px.

---

### 4.21 Comment popup

**What it is.** A Popup attached to a pin. It is where the person writes, reads, edits or deletes a comment.

**Specs**

- Uses the Popup component (4.13). Width 300. It points to its pin and sits on the side with the most room.
- Phones (under 640px): it opens as a sheet from the bottom, up to 85% of the height. A backdrop sits behind it.

**Write mode** (a new comment or an edit)

- Top: the pin number and the title. No author or time line.
- Text area: at least 3 lines, placeholder "Say what to change". Max 500 characters. The counter shows from 450.
- Bottom: **Save** (small primary button) and **Cancel** (small secondary button).
- **Save** is not disabled when the field is empty. Pressing it shows the message next to the field: "Write a comment first."

**Read mode** (a saved comment)

- The comment text.
- A thin light line (`gray-100`) sits above the buttons.
- Buttons: **Edit** and **Delete** are icon buttons (pencil and trash, 32px; the trash uses the danger color). **Close** is a small secondary button.

**Behavior**

- A new popup opens as soon as the pin is placed. The text area has focus.
- Escape or **Cancel** closes it. A new pin with no text is removed. An edit goes back to the old text.
- Clicking outside does nothing while the text area has unsaved text.
- **Delete** removes the pin and comment, and shows an Undo toast for 5 seconds. After the feedback is sent, **Delete** first asks in a dialog.

**When to use**

- To write or read the comment of one pin.

**When not to use**

- For long threads. Replies go in the feedback list.

**Accessibility**

- It follows the Popup rules. Focus moves into it when it opens and returns to the pin when it closes.

---

### 4.22 Feedback list item

**What it is.** One row in the feedback list (right sidebar). It shows one comment and what happened to it.

**Specs**

- Padding 12 16. 1px `gray-200` line at the bottom.
- Left: small pin (24px) with the number.
- Middle:
  - Comment text, Body, cut after 3 lines. When selected, the full text shows.
  - Meta line, Small, `gray-600`: "Emma, 2 min ago". If edited, add "Edited".
- Right: a status Badge, then an icon button with a menu (Edit, Delete). The icon button has a 44px tap area.
- Hover: `gray-100` fill. Selected: `blue-50` fill.
- Developer view adds a line under the text:
  - Developer mark: a **Fixed** button. Once tapped, it becomes the text "Marked fixed" with a check icon, and tapping again undoes it.
  - AI mark: an outlined badge (like the release badge) with a sparkle icon: "AI: likely fixed", "AI: not sure", or "AI: no change found".
- Designer re-check view adds the same two marks, and the **Mark resolved** and **Still needs fix** buttons. The status badge reads **Resolved** or **Not resolved**. The AI mark is joined to the status badge as one short badge, for example **Not resolved · No change**.
- When the two marks disagree, show a warning line in `yellow-700` with an alert icon: "Marked fixed, but the AI found no change."

**Behavior**

- Click or tap selects the item, highlights its pin, and scrolls the design to show the pin.
- Selecting a pin on the design selects its item and scrolls the list to it.
- Items stay in pin order. They are never removed by a push. Only the designer can close one.
- A deleted item after sending stays as a quiet line: "Comment deleted by Emma".

**When to use**

- In the feedback list of the case screen.

**When not to use**

- For anything that is not feedback on a design.

**Accessibility**

- The item is a list item with a button for selecting. The status and marks are text, not only color.
- The menu follows the Dropdown menu rules.

---

### 4.23 Notifications (bell and list)

**What it is.** A bell button in the header. A dot shows when something is unread. Clicking it opens a list of notifications. Clicking a notification opens the page it is about.

**Bell**

- An icon button (44px tap area) at the right of the header. Icon: bell.
- Unread dot: 8px, `blue-600`, with a 2px border in the header color. It sits at the top right of the icon. No number. It shows when at least one notification is unread, and disappears when all are read.
- Accessible name: "Notifications", or "Notifications, 2 unread".

**List (a popup)**

- Uses the Popup rules (4.13), but wider. Width 360. On phones: the screen width minus 32.
- Opens below the bell, aligned to its right edge. Max height: the screen minus the header, then it scrolls.
- Top row: the title "Notifications" (Body, 500) and a small ghost button "Mark all as read". The button is only shown when something is unread.
- If there is nothing: one line, "No notifications yet.", centered, `gray-600`.

**Notification row**

- The whole row is one button. Min height 44. Padding 12 14. 1px `gray-200` line at the bottom.
- Left: an 8px dot. Unread: `blue-600`. Read: no dot (the space stays, so text lines up).
- Message: Body. Unread: `gray-900`, weight 500. Read: `gray-600`, weight 400.
- Under the message: the time, Small, `gray-600`. Examples: "Just now", "2 min ago", "3 h ago", then a date.
- Hover: `gray-100` fill. Pressed: `gray-200` fill.

**Behavior**

- Click or tap on the bell opens or closes the list.
- Clicking a notification marks it read, closes the list, and goes to its page.
- A new notification turns the dot on at once. It does not open the list and does not make a sound.
- Escape or a click outside closes the list, and focus returns to the bell. When the list opens, focus moves to its first button.
- The newest notification is on top.

**When to use**

- For things that need the person to act: a request, fixes sent, a re-check, an approval.

**When not to use**

- To confirm something the person just did. Use a Toast.
- For marketing or tips.

**Content**

- One sentence that says who did what, using the feature name. Good: "Tom asked you to check Cart page." Bad: "New notification."
- Never show a Git name.

**Accessibility**

- The dot is decorative. Unread rows have the hidden word "Unread" before the message, so the state is not only color.
- The bell has `aria-expanded`. The list is a labeled region.

---

## 5. Writing rules

- **Sentence case** for everything: buttons, titles, labels, menu items.
- **Verb first** for actions.
- **No periods** on buttons, titles, labels, badges, and toasts. Use periods in hints and body text.
- **Plain words.** Use "check", not "validate". Use "branch" with a short explanation the first time.
- **Say what happens.** "The developer gets one summary in Slack." beats "Notify".
- **Be honest about limits.** Say "Sample data" or "Coming next" when it is true.
- **No blame.** Errors say what happened and what to do next.
- **No filler.** Avoid "successfully", "please", "just", "simply".

---

## 6. Accessibility checklist

Use this list for every new component and page.

- [ ] One h1 per page. Headings in order.
- [ ] Everything works with the keyboard only.
- [ ] Focus is always visible.
- [ ] Touch targets are at least 44px tall.
- [ ] Text contrast is at least 4.5:1 (3:1 for large text and icons).
- [ ] Status is shown with a word, not only color.
- [ ] Form fields have visible labels and linked error text.
- [ ] Dialogs trap focus and close with Escape.
- [ ] Animation is off when "reduce motion" is on.
- [ ] No horizontal scroll at 390px wide.
