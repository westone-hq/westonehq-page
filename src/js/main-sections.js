// ── 메인 페이지 섹션 동작 ─────────────────────────────────────────────────
// 1) 함께한 곳: 이름만 보여 준다(누르는 동작 없음). 7곳을 넘으면 흐르는 띠로 바꾼다
// 2) #case-… 주소(다른 페이지에서 index.html#case-… 로 들어오거나 같은 페이지 안 링크): 해당 케이스 카드로 스크롤하고 테두리를 한 번 깜빡인다

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MARQUEE_FROM = 7 // 이 수를 넘으면 흐르는 띠로 바뀐다

export function initClients() {
  const box = document.getElementById('cl-list')
  const list = box?.querySelector('.cl-items')
  if (!list) return
  const count = list.children.length
  if (count <= MARQUEE_FROM || reduceMotion()) return

  box.classList.add('marquee')
  list.style.setProperty('--dur', `${count * 4}s`)
  const copy = list.cloneNode(true)
  copy.setAttribute('aria-hidden', 'true')
  box.appendChild(copy)
}

export function initCaseLinks() {
  const showCase = (hash, { scroll }) => {
    if (!hash || !hash.startsWith('#case-')) return false
    const card = document.getElementById(hash.slice(1))
    if (!card || !card.classList.contains('case-card')) return false
    if (scroll) card.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
    card.classList.remove('flash')
    void card.offsetWidth // 같은 카드를 다시 눌러도 처음부터 깜빡이게
    card.classList.add('flash')
    card.addEventListener('animationend', () => card.classList.remove('flash'), { once: true })
    return true
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#case-"]')
    if (!a) return
    const hash = a.getAttribute('href')
    if (showCase(hash, { scroll: true })) {
      e.preventDefault()
      history.pushState(null, '', hash)
    }
  })

  // 다른 페이지에서 index.html#case-… 로 들어왔을 때 (스크롤은 브라우저가 주소대로 한 번 하고, 여기서 한 번 더 맞춘다)
  showCase(location.hash, { scroll: true })
  window.addEventListener('hashchange', () => showCase(location.hash, { scroll: true }))
}

export function initMainSections() {
  initClients()
  initCaseLinks()
}
