/**
 * Small pictures for the welcome page. Plain shapes, no words, in grays only.
 * Each one is 280 x 120 and scales with its card.
 */

const line = { stroke: 'var(--gray-250)', strokeWidth: 1 }
const HEADER = 8

type Variant = 'a' | 'b' | 'c' | 'd'

/** One screen. The variant changes the layout a little, like the versions of a real screen. */
function Phone({ x, y, w, h, variant = 'a' }: { x: number; y: number; w: number; h: number; variant?: Variant }) {
  const inner = w - 16
  const offerH = Math.round(h * 0.26)
  const buttonH = 12
  const offerY = HEADER + 10
  const buttonY = offerY + offerH + 8

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="6" fill="var(--white)" {...line} />
      <path d={`M0 6a6 6 0 0 1 6-6h${w - 12}a6 6 0 0 1 6 6v${HEADER - 6}H0z`} fill="var(--gray-300)" />

      {variant === 'a' && (
        <>
          <rect x="8" y={offerY} width={inner} height={offerH} rx="3" fill="var(--gray-100)" />
          <rect x="8" y={buttonY} width={inner} height={buttonH} rx="4.5" fill="var(--gray-300)" />
          <rect x="8" y={buttonY + buttonH + 8} width={inner * 0.6} height="4" rx="1.5" fill="var(--gray-250)" />
        </>
      )}
      {variant === 'b' && (
        <>
          <rect x="8" y={offerY} width={inner} height={offerH} rx="3" fill="var(--gray-100)" />
          <rect x="8" y={buttonY} width={inner * 0.4} height="8" rx="3" fill="var(--gray-250)" />
          <rect x="8" y={buttonY + 14} width={inner} height={buttonH} rx="4.5" fill="var(--gray-300)" />
        </>
      )}
      {variant === 'c' && (
        <>
          <rect x="8" y={offerY} width={inner * 0.7} height="5" rx="2.2" fill="var(--gray-250)" />
          <rect x="8" y={offerY + 10} width={inner} height="5" rx="2.2" fill="var(--gray-250)" />
          <rect x="8" y={offerY + 20} width={inner * 0.5} height="5" rx="2.2" fill="var(--gray-250)" />
          <rect x="8" y={buttonY + 14} width={inner} height={buttonH} rx="4.5" fill="var(--gray-300)" />
        </>
      )}
      {variant === 'd' && (
        <>
          <rect x="8" y={offerY} width={inner} height={offerH + 8} rx="3" fill="var(--gray-100)" />
          <rect x="8.5" y={buttonY + 8} width={inner - 1} height={buttonH - 1} rx="4" fill="var(--white)" stroke="var(--gray-300)" />
          <rect x="8" y={buttonY + buttonH + 16} width={inner * 0.5} height="4" rx="1.5" fill="var(--gray-250)" />
        </>
      )}
    </g>
  )
}

/** Where the button sits inside a variant "a" screen, so a pin can point at it. */
function buttonCenter(w: number, h: number) {
  const offerH = Math.round(h * 0.26)
  const buttonY = HEADER + 10 + offerH + 8
  return { y: buttonY + 6, right: w - 8 }
}

function Pin({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="10" fill="var(--gray-900)" stroke="var(--white)" strokeWidth="2" />
      <text textAnchor="middle" y="3.5" fontSize="10" fontWeight="600" fill="var(--white)" fontFamily="var(--font-sans)">
        {n}
      </text>
    </g>
  )
}

function Check({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="var(--gray-600)" />
      <path d={`M${-r * 0.45} 0l${r * 0.3} ${r * 0.35}l${r * 0.6} ${-r * 0.7}`} fill="none" stroke="var(--white)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 15 280 120" role="img" aria-hidden="true" focusable="false" className="art">
      {children}
    </svg>
  )
}

/** 1. A request arrives: one notification. */
export function ArtRequest() {
  return (
    <Frame>
      <rect x="40" y="47" width="200" height="56" rx="8" fill="var(--white)" {...line} />
      <circle cx="68" cy="75" r="14" fill="var(--gray-100)" />
      <path d="M68 67a6 6 0 0 0-6 6v4l-2 3h16l-2-3v-4a6 6 0 0 0-6-6zm-2 15h4a2 2 0 0 1-4 0z" fill="var(--gray-600)" />
      <rect x="92" y="65" width="120" height="6" rx="2.2" fill="var(--gray-250)" />
      <rect x="92" y="79" width="86" height="6" rx="2.2" fill="var(--gray-250)" />
      <circle cx="79" cy="64" r="5" fill="var(--gray-900)" stroke="var(--white)" strokeWidth="2" />
    </Frame>
  )
}

/** 2. AI finds every version: four screens in a row, each a little different. */
export function ArtVersions() {
  const w = 54
  const h = 84
  const gap = 10
  const start = (280 - (4 * w + 3 * gap)) / 2
  const y = (150 - h) / 2
  const variants: Variant[] = ['a', 'b', 'c', 'd']
  return (
    <Frame>
      {variants.map((variant, i) => (
        <Phone key={variant} x={start + i * (w + gap)} y={y} w={w} h={h} variant={variant} />
      ))}
    </Frame>
  )
}

/** 3. Pins and a comment on one screen. The comment sits right next to pin 1. */
export function ArtPins() {
  const w = 54
  const h = 84
  const px = 74
  const py = 33
  const button = buttonCenter(w, h)
  const pin1 = { x: px + w - 18, y: py + button.y }
  const pin2 = { x: px + 22, y: py + button.y + 24 }

  const bx = px + w + 12
  const bw = 100
  const bh = 44
  const by = pin1.y - bh / 2
  return (
    <Frame>
      <Phone x={px} y={py} w={w} h={h} variant="a" />
      <Pin x={pin2.x} y={pin2.y} n={2} />

      <rect x={bx} y={by} width={bw} height={bh} rx="6.5" fill="var(--white)" {...line} />
      <path d={`M${bx} ${pin1.y - 4}L${bx - 4} ${pin1.y}L${bx} ${pin1.y + 4}`} fill="var(--white)" {...line} />
      <line x1={bx} y1={pin1.y - 3} x2={bx} y2={pin1.y + 3} stroke="var(--white)" strokeWidth="2" />
      <rect x={bx + 10} y={by + 12} width="80" height="6" rx="2.2" fill="var(--gray-250)" />
      <rect x={bx + 10} y={by + 26} width="56" height="6" rx="2.2" fill="var(--gray-250)" />
      <Pin x={pin1.x} y={pin1.y} n={1} />
    </Frame>
  )
}

/** 4. Approved: one card, the same size as the notification. */
export function ArtApprove() {
  return (
    <Frame>
      <rect x="40" y="47" width="200" height="56" rx="8" fill="var(--white)" {...line} />
      <Check x={68} y={75} r={14} />
      <rect x="92" y="65" width="120" height="6" rx="2.2" fill="var(--gray-250)" />
      <rect x="92" y="79" width="86" height="6" rx="2.2" fill="var(--gray-250)" />
    </Frame>
  )
}
