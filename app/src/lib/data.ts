import type { AbTest, AiMark, Release, Role, UserGroup } from './types'

export const PEOPLE: Record<Role, { name: string }> = {
  designer: { name: 'Emma' },
  developer: { name: 'Tom' },
}

export const DESIGNERS = ['Emma', 'Priya']

/**
 * Demo data. The real product reads the code and finds the A/B tests and states.
 * Here the same result is used for every request.
 */
export const DEMO_AB_TESTS: AbTest[] = [
  {
    name: 'cart_page_test',
    versions: ['Current'],
    text: 'Each version is shown as its own screen.',
  },
]

export const DEMO_GROUPS: UserGroup[] = [
  { id: 'in-items', section: 'Logged in', label: '1 or more items', text: 'One or more products are in the cart.' },
  { id: 'in-sold-out', section: 'Logged in', label: 'Sold out', text: 'One product in the cart is sold out. Checkout is off.' },
  { id: 'in-empty', section: 'Logged in', label: 'No items', text: 'Nothing is in the cart.' },
  { id: 'in-free', section: 'Logged in', label: 'Free shipping', text: 'The cart total reaches £25. Shipping is free.' },
  { id: 'out-items', section: 'Logged out', label: '1 or more items', text: 'One or more products are in the cart.' },
]

export type DemoCommit = { hash: string; time: string; subject: string; body: string[] }

/** The commits on the demo branch, newest first. The first one is the commit behind the request. */
const DEMO_COMMITS: DemoCommit[] = [
  {
    hash: 'a3f9c21',
    time: 'Today, 09:41',
    subject: 'feat: build new cart page',
    body: [
      'Add the cart layout and order summary',
      'Add the free shipping bar (free from £25)',
      'Turn off Checkout when an item is sold out',
      'Show a message when the cart is empty',
      'Show "Sign in | Create account" when logged out',
    ],
  },
  {
    hash: 'b72e4d8',
    time: 'Yesterday, 17:05',
    subject: 'feat: add cart item rows',
    body: ['Add rows with photo, name and price', 'Add the quantity box and the Remove link'],
  },
  {
    hash: 'c19a006',
    time: 'Yesterday, 14:30',
    subject: 'chore: add cart page route',
    body: ['Add the /cart route', 'Add an empty cart page'],
  },
]

/** What the developer pushes after the design review. Each push adds one commit on top. */
const DEMO_FIX_COMMITS: DemoCommit[] = [
  {
    hash: 'e41b7d0',
    time: 'Today, 11:20',
    subject: 'fix: update cart page after design review',
    body: ['Fix the items from the review comments', 'Make the Checkout button taller'],
  },
]

/** The commits for a review, newest first. Revision 1 is the first push. */
export function commitsFor(revision: number): DemoCommit[] {
  const fixes = DEMO_FIX_COMMITS.slice(0, Math.max(0, revision - 1)).reverse()
  return [...fixes, ...DEMO_COMMITS]
}

/** Other branches of the project, shown to the developer in the left list. They have no design review. */
export const DEMO_OTHER_BRANCHES: { name: string; release: Release }[] = [
  { name: 'feature/checkout-page', release: 'merged' },
  { name: 'fix/header-menu', release: 'merged' },
  { name: 'feature/search-bar', release: 'deployed' },
  { name: 'feature/wishlist', release: 'not-merged' },
]

export const DEMO_BRANCHES = ['feature/cart-page', 'feature/checkout-page', 'fix/header-menu']

/**
 * Demo AI check. After a push, the AI looks at the part of the screen under each pin.
 * Here the answer depends on the element, so the demo always behaves the same way.
 */
export function demoAiMark(target: string): AiMark {
  if (target === 'checkout-button') return 'likely-fixed'
  if (target === 'sold-out') return 'not-sure'
  return 'no-change'
}

/** Short AI words, joined to the status badge. */
export const AI_SHORT: Partial<Record<AiMark, string>> = {
  'likely-fixed': 'Likely fixed',
  'not-sure': 'Not sure',
}

