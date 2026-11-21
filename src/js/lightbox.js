// ── 이미지 크게 보기 ────────────────────────────────────────────────────────
// a.zoom 을 누르면 <dialog> 하나로 원본을 보여 준다. 캡션은 가장 가까운 figcaption.
// 세로로 긴 이미지(매뉴얼 쪽 등)는 창을 좁게 열어 한 화면에 가깝게 보이게 한다.

export function initLightbox() {
  const links = document.querySelectorAll('a.zoom')
  if (!links.length || typeof HTMLDialogElement !== 'function') return

  const dlg = document.createElement('dialog')
  dlg.className = 'lightbox'
  dlg.setAttribute('aria-label', '이미지 크게 보기')
  dlg.innerHTML = '<button type="button" class="lightbox-close" aria-label="닫기">×</button><img alt=""><p class="lightbox-cap"></p>'
  document.body.appendChild(dlg)
  const img = dlg.querySelector('img')
  const cap = dlg.querySelector('.lightbox-cap')
  let opener = null

  links.forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault()
    opener = a
    const thumb = a.querySelector('img')
    const w = +thumb?.getAttribute('width') || thumb?.naturalWidth || 1
    const h = +thumb?.getAttribute('height') || thumb?.naturalHeight || 1
    dlg.classList.toggle('tall', h > w)
    img.src = a.href
    img.alt = thumb?.alt || ''
    // 캡션의 "(누르면 크게 보기)" 같은 안내(.zoom-hint)는 크게 본 화면에서는 뺀다
    const fc = a.closest('figure')?.querySelector('figcaption')?.cloneNode(true)
    fc?.querySelectorAll('.zoom-hint').forEach(el => el.remove())
    const text = fc?.textContent.trim() || ''
    cap.textContent = text
    cap.hidden = !text
    dlg.showModal()
  }))
  dlg.querySelector('.lightbox-close').addEventListener('click', () => dlg.close())
  // 이미지 밖(배경)을 누르면 닫는다
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() })
  dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus() })
}
