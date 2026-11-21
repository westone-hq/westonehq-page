// ── 진행 방식 9단계 (process-steps 조각) ──────────────────────────────────
// 단계 버튼 = 탭. 누르거나 화살표 키로 옮기면 아래 설명 칸이 바뀐다.
// 설명 칸 안의 다이어그램 틀과 탭 동작은 diagram-view.js 와 같이 쓴다.

import { initTabs, initDiagramViews } from './diagram-view.js'

export function initProcessSteps() {
  document.querySelectorAll('[data-proc]').forEach(initTabs)
  initDiagramViews()
}
