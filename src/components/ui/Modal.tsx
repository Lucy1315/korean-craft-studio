'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  // true이면 Esc와 닫기 버튼을 막는다(제출 중).
  preventClose?: boolean
  children: ReactNode
}

const FIRST_FIELD_SELECTOR =
  'input:not([readonly]):not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([readonly]):not([disabled])'

// 네이티브 <dialog> 래퍼. 닫힘은 모두 'close' 이벤트로 수렴하며 그때 onClose를 한 번 호출한다.
export function Modal({ open, title, onClose, preventClose = false, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      dialog.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR)?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => {
      onClose()
      triggerRef.current?.focus()
      triggerRef.current = null
    }
    const handleCancel = (event: Event) => {
      if (preventClose) event.preventDefault()
    }
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
    }
  }, [onClose, preventClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink sm:m-auto sm:h-auto sm:max-h-[90dvh] sm:max-w-lg sm:rounded-sm sm:border sm:border-line"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 id={titleId} className="font-serif text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="닫기"
          disabled={preventClose}
          onClick={() => dialogRef.current?.close()}
          className="inline-flex size-11 items-center justify-center rounded-sm text-xl text-ink hover:bg-paper-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="px-5 py-5">{open ? children : null}</div>
    </dialog>
  )
}
