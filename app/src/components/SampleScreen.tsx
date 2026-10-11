type Props = {
  version: string
  groupId: string
  groupLabel: string
  /** The developer's code version. Version 2 has the first fixes. */
  revision: number
}

type Product = {
  id: string
  name: string
  size: string
  price: number
  quantity: number
  soldOut?: boolean
  photo: string
}

const FREE_SHIPPING_FROM = 25
const SHIPPING_FEE = 4

const TONER: Product = {
  id: 'toner',
  name: 'Glycolic Acid 7% Exfoliating Toner',
  size: '240ml',
  price: 12,
  quantity: 1,
  photo: '/products/product-1.jpg',
}
const SERUM: Product = {
  id: 'serum',
  name: 'Niacinamide 10% + Zinc 1% Serum',
  size: '30ml',
  price: 8,
  quantity: 1,
  photo: '/products/product-2.jpg',
}

/** The products in the cart for each case. */
function itemsFor(groupId: string): Product[] {
  if (groupId === 'in-empty') return []
  if (groupId === 'in-sold-out') return [TONER, { ...SERUM, soldOut: true }]
  if (groupId === 'in-free') return [TONER, { ...SERUM, quantity: 2 }]
  return [TONER, SERUM]
}

const money = (n: number) => `£${n.toFixed(2)} GBP`

/**
 * The screen being reviewed. In the real product this is the developer's app, running with the case's data.
 * Here it is a small shop cart page. Pins point at elements with `data-pin-target`.
 */
export function SampleScreen({ groupId, revision }: Props) {
  const items = itemsFor(groupId)
  const buyable = items.filter((i) => !i.soldOut)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = buyable.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const empty = items.length === 0
  const hasSoldOut = items.some((i) => i.soldOut)
  const freeShipping = subtotal >= FREE_SHIPPING_FROM
  const shipping = empty ? 0 : freeShipping ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const away = Math.max(0, FREE_SHIPPING_FROM - subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100))
  const canCheckout = !empty && !hasSoldOut
  const fixed = revision >= 2
  const signedIn = groupId.startsWith('in-')

  return (
    <div className="cart-site" data-pin-target="screen">
      <header className="cart-header" data-pin-target="site-header">
        <span className="cart-logo">Clearwell</span>
        <nav className="cart-nav" aria-hidden="true">
          <span>Shop</span>
          <span>Skin</span>
          <span>Hair</span>
          <span>About</span>
        </nav>
        <span className="cart-bag" data-pin-target="bag">
          Cart ({count})
        </span>
      </header>

      <main className="cart-main">
        <h1 className="cart-title" data-pin-target="title">
          Cart ({count} {count === 1 ? 'item' : 'items'})
        </h1>

        <div className="cart-columns">
          <section className="cart-list" aria-label="Items">
            {!signedIn ? (
              <p className="cart-account" data-pin-target="sign-in">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3 3.5-5 8-5s8 2 8 5z" />
                </svg>
                <span>
                  <b>Sign in</b> | <b>Create account</b> for a faster checkout
                </span>
              </p>
            ) : null}

            {!empty ? (
              <div className="cart-ship" data-pin-target="shipping-bar">
                <p>{freeShipping ? 'You qualify for free shipping' : `You are ${money(away)} away from free shipping`}</p>
                <div className="cart-track" aria-hidden="true">
                  <div className="cart-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}

            {empty ? (
              <div className="cart-empty" data-pin-target="empty-message">
                <p className="cart-empty-title">Your cart is empty</p>
                <p className="cart-empty-text">Add something you like and it will show up here.</p>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className={`cart-item ${item.soldOut ? 'cart-item-out' : ''}`.trim()}
                  data-pin-target={`item-${item.id}`}
                >
                  <div className="cart-image" data-pin-target={`image-${item.id}`}>
                    <img src={item.photo} alt="" draggable={false} />
                  </div>
                  <div className="cart-info">
                    <p className="cart-brand">Clearwell</p>
                    <p className="cart-name">{item.name}</p>
                    <p className="cart-size">{item.size}</p>
                    {item.soldOut ? (
                      <p className="cart-out" data-pin-target="sold-out">
                        Sold out. Remove it to check out.
                      </p>
                    ) : null}
                    <p className={`cart-price ${item.soldOut ? 'cart-price-off' : ''}`.trim()} data-pin-target={`price-${item.id}`}>
                      {money(item.price * item.quantity)}
                    </p>
                  </div>
                  <span className="cart-remove" data-pin-target={`remove-${item.id}`}>
                    Remove
                  </span>
                  <div className={`cart-qty ${item.soldOut ? 'cart-qty-off' : ''}`.trim()} data-pin-target={`quantity-${item.id}`}>
                    <span>−</span>
                    <span>{item.quantity}</span>
                    <span>+</span>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="cart-summary" data-pin-target="summary">
            <dl className="cart-rows">
              <div className="cart-row">
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="cart-row" data-pin-target="shipping-row">
                <dt>Shipping &amp; Handling</dt>
                <dd>{empty ? money(0) : freeShipping ? <span className="cart-free">Free</span> : money(shipping)}</dd>
              </div>
            </dl>
            <div className="cart-balance" data-pin-target="balance">
              <span>Estimated Total</span>
              <span>{money(total)}</span>
            </div>
            <div className="cart-buttons">
              <button
                type="button"
                tabIndex={-1}
                disabled={!canCheckout}
                className={`cart-checkout ${fixed ? 'cart-checkout-fixed' : ''}`.trim()}
                data-pin-target="checkout-button"
              >
                Checkout
              </button>
              <button type="button" tabIndex={-1} className="cart-continue" data-pin-target="keep-shopping">
                Continue shopping
              </button>
            </div>
            {hasSoldOut ? <p className="cart-note">Remove the sold out item to continue.</p> : null}
          </aside>
        </div>
      </main>
    </div>
  )
}
