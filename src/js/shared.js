// ── Header scroll effect ──────────────────────────────────────────────────
export function initHeader() {
  const header = document.querySelector('.global-header')
  if (!header) return

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 8)
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}

// ── Mobile menu toggle ────────────────────────────────────────────────────
export function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle')
  const overlay   = document.querySelector('.mobile-overlay')
  if (!toggleBtn || !overlay) return

  const closeTargets = document.querySelectorAll('.mobile-menu-link, .mobile-cta-btn')

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true')
    toggleBtn.setAttribute('aria-label', '메뉴 닫기')
    overlay.setAttribute('aria-hidden', 'false')
    document.body.classList.add('menu-open')
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false')
    toggleBtn.setAttribute('aria-label', '메뉴 열기')
    overlay.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('menu-open')
    toggleBtn.focus()
  }

  toggleBtn.addEventListener('click', () => {
    if (toggleBtn.getAttribute('aria-expanded') === 'true') closeMenu()
    else openMenu()
  })

  closeTargets.forEach(el => el.addEventListener('click', closeMenu))

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu()
  })
}

// ── AI Widget ─────────────────────────────────────────────────────────────
export function initAIWidget({
  mockResponses = {},
  defaultResponse = '',
  proxyUrl = import.meta.env.VITE_AI_PROXY_URL ?? 'AI_PROXY_URL',
  chips = [],
} = {}) {
  const trigger        = document.querySelector('.aiw-trigger')
  const panel          = document.getElementById('aiPanel')
  const closeBtn       = document.querySelector('.aiw-close')
  const bodyEl         = document.getElementById('aiBody')
  const form           = document.getElementById('aiForm')
  const input          = document.getElementById('aiInput')
  const sendBtn        = document.getElementById('aiSend')
  const chipsContainer = document.getElementById('aiChips')

  if (!trigger || !panel || !bodyEl) return

  // Inject chip buttons from JS
  if (chips.length && chipsContainer) {
    chips.forEach(text => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'aiw-chip mono'
      btn.textContent = text
      chipsContainer.appendChild(btn)
    })
  }

  let messages  = []
  let isWaiting = false

  function openPanel() {
    trigger.classList.add('is-hidden')
    trigger.setAttribute('aria-expanded', 'true')
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    input?.focus()
  }

  function closePanel() {
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
    trigger.classList.remove('is-hidden')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.focus()
  }

  // user text inserted via textContent, never innerHTML
  function appendMsg(text, type) {
    const div = document.createElement('div')
    div.className = `aiw-msg aiw-${type} mono`
    if (type === 'user') {
      const prefix = document.createElement('span')
      prefix.className = 'aiw-prefix'
      prefix.textContent = '❯ '
      div.appendChild(prefix)
      div.appendChild(document.createTextNode(text))
    } else {
      div.textContent = text
    }
    bodyEl.appendChild(div)
    bodyEl.scrollTop = bodyEl.scrollHeight
  }

  function showLoading() {
    const div = document.createElement('div')
    div.className = 'aiw-msg aiw-loading mono'
    div.id = 'aiLoading'
    div.innerHTML = 'thinking<span class="aiw-loading-dots"><span>.</span><span>.</span><span>.</span></span>'
    bodyEl.appendChild(div)
    bodyEl.scrollTop = bodyEl.scrollHeight
  }

  function removeLoading() {
    document.getElementById('aiLoading')?.remove()
  }

  async function sendMessage(text) {
    if (!text.trim() || isWaiting) return

    chipsContainer?.remove()

    if (input)   input.value    = ''
    if (input)   input.disabled = true
    if (sendBtn) sendBtn.disabled = true
    isWaiting = true

    appendMsg(text, 'user')
    messages.push({ role: 'user', content: text })
    showLoading()

    if (!proxyUrl || proxyUrl === 'AI_PROXY_URL') {
      setTimeout(() => {
        removeLoading()
        const reply = mockResponses[text] ?? defaultResponse
        appendMsg(reply, 'ai')
        messages.push({ role: 'assistant', content: reply })
        if (input)   input.disabled   = false
        if (sendBtn) sendBtn.disabled = false
        isWaiting = false
        input?.focus()
      }, 800)
      return
    }

    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.slice(-6) })
      })
      if (!res.ok) throw new Error('API Error')
      const data  = await res.json()
      const reply = data.reply ?? defaultResponse
      removeLoading()
      appendMsg(reply, 'ai')
      messages.push({ role: 'assistant', content: reply })
    } catch {
      removeLoading()
      if (messages.at(-1)?.role === 'user') messages.pop()
      appendMsg('지금은 응답이 어렵습니다. 아래 문의 폼을 이용해 주세요.', 'ai')
    } finally {
      if (input)   input.disabled   = false
      if (sendBtn) sendBtn.disabled = false
      isWaiting = false
      input?.focus()
    }
  }

  trigger.addEventListener('click', openPanel)
  closeBtn?.addEventListener('click', closePanel)
  form?.addEventListener('submit', (e) => { e.preventDefault(); sendMessage(input.value) })
  chipsContainer?.querySelectorAll('.aiw-chip').forEach(chip =>
    chip.addEventListener('click', () => sendMessage(chip.textContent.trim()))
  )
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel()
  })
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────
export function initScrollReveal(selector) {
  const targets = document.querySelectorAll(selector)
  if (!targets.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-visible'))
    return
  }

  targets.forEach((el, i) => {
    el.classList.add('reveal')
    el.style.transitionDelay = (Math.min(i % 4, 3) * 0.06) + 's'
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  targets.forEach(el => observer.observe(el))
}
