import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom은 <dialog>의 showModal/close를 구현하지 않는다.
// close()는 브라우저처럼 'close' 이벤트까지 발생시켜야 초기화·포커스 복귀 테스트가 거짓 통과하지 않는다.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
