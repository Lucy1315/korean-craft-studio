'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

interface SubmissionResultProps {
  title: string
  receiptNo: string
  message: string
  onClose: () => void
}

export function SubmissionResult({ title, receiptNo, message, onClose }: SubmissionResultProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h3 ref={headingRef} tabIndex={-1} className="font-serif text-xl font-semibold">
        {title}
      </h3>
      <dl className="rounded-sm border border-line bg-paper-deep px-4 py-3">
        <dt className="text-sm text-ink-muted">접수번호</dt>
        <dd className="text-lg font-semibold tracking-wide">{receiptNo}</dd>
      </dl>
      <p className="text-sm text-ink-muted">{message}</p>
      <Button onClick={onClose} className="self-end">
        닫기
      </Button>
    </div>
  )
}
