export type RepoParse = { ok: true; host: string; owner: string; name: string; url: string } | { ok: false }

const HOSTS = ['github.com', 'gitlab.com']

/** Reads a code address like https://github.com/owner/repo. */
export function parseRepoAddress(input: string): RepoParse {
  const text = input.trim()
  if (!text) return { ok: false }
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
  } catch {
    return { ok: false }
  }
  const host = url.hostname.replace(/^www\./, '')
  if (!HOSTS.includes(host)) return { ok: false }
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2) return { ok: false }
  const owner = parts[0]
  const name = parts[1].replace(/\.git$/, '')
  if (!owner || !name) return { ok: false }
  return { ok: true, host, owner, name, url: `https://${host}/${owner}/${name}` }
}

/** "web-shop" becomes "Web shop". */
export function projectTitle(name: string): string {
  const spaced = name.replace(/[-_]+/g, ' ').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
