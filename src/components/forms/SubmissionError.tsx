'use client'

import { useEffect, useRef } from 'react'

interface SubmissionErrorProps {
  message: string
}

// 제출 중에는 제출 버튼이 비활성화되어 포커스가 사라지므로, 오류가 나타나면 메시지로 포커스를 옮긴다.
export function SubmissionError({ message }: SubmissionErrorProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <p
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="rounded-sm border border-danger px-3 py-2 text-sm text-danger"
    >
      {message}
    </p>
  )
}
