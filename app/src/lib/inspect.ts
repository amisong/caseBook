/** Reads the size, text style and spacing of an element, like the box model in browser dev tools. */

export type Sides = { top: number; right: number; bottom: number; left: number }

export type InspectInfo = {
  name: string
  width: number
  height: number
  font: string
  weight: string
  lineHeight: string
  family: string
  color: string
  background: string
  hasText: boolean
  padding: Sides
  margin: Sides
}

const px = (value: string) => Number.parseFloat(value) || 0

const sides = (style: CSSStyleDeclaration, prop: 'padding' | 'margin'): Sides => ({
  top: px(style.getPropertyValue(`${prop}-top`)),
  right: px(style.getPropertyValue(`${prop}-right`)),
  bottom: px(style.getPropertyValue(`${prop}-bottom`)),
  left: px(style.getPropertyValue(`${prop}-left`)),
})

const hex = (color: string): string => {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return color
  const [r, g, b, a = '1'] = m[1].split(',').map((v) => v.trim())
  if (Number(a) === 0) return 'none'
  const h = (v: string) => Math.round(Number(v)).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

export function readElement(el: Element): InspectInfo {
  const style = getComputedStyle(el)
  const rect = el.getBoundingClientRect()
  const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : ''
  const hasText = Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '')
  return {
    name: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`,
    width: Math.round(rect.width * 10) / 10,
    height: Math.round(rect.height * 10) / 10,
    font: style.fontSize,
    weight: style.fontWeight,
    lineHeight: style.lineHeight === 'normal' ? 'normal' : `${Math.round(px(style.lineHeight) * 10) / 10}px`,
    family: style.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
    color: hex(style.color),
    background: hex(style.backgroundColor),
    hasText,
    padding: sides(style, 'padding'),
    margin: sides(style, 'margin'),
  }
}

/** "8 16 8 16", or "0" when all sides are zero. */
export function sidesText(s: Sides): string {
  if (!s.top && !s.right && !s.bottom && !s.left) return '0'
  return `${s.top} ${s.right} ${s.bottom} ${s.left}`
}

/** A plain note the designer can start a comment from. */
export function measureNote(info: InspectInfo): string {
  const lines = [`${info.name}  ${info.width} × ${info.height}`]
  if (info.hasText) lines.push(`Font: ${info.font} / ${info.weight}, line ${info.lineHeight}`, `Color: ${info.color}`)
  else if (info.background !== 'none') lines.push(`Background: ${info.background}`)
  lines.push(`Padding: ${sidesText(info.padding)}`, `Margin: ${sidesText(info.margin)}`)
  return lines.join('\n')
}
