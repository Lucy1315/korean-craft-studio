import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SubmissionError } from './SubmissionError'
import { SubmissionResult } from './SubmissionResult'

describe('SubmissionResult', () => {
  it('접수번호와 메시지를 보여주고 제목에 포커스를 둔다', async () => {
    const onClose = vi.fn()
    render(
      <SubmissionResult
        title="주문 문의가 접수되었습니다"
        receiptNo="ORD-20260930-0001"
        message="가상 접수입니다."
        onClose={onClose}
      />,
    )
    expect(screen.getByRole('heading', { name: '주문 문의가 접수되었습니다' })).toHaveFocus()
    expect(screen.getByText('ORD-20260930-0001')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: '닫기' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('SubmissionError', () => {
  it('role=alert로 오류를 알리고 포커스를 받는다', () => {
    render(<SubmissionError message="Mock 오류입니다." />)
    expect(screen.getByRole('alert')).toHaveTextContent('Mock 오류입니다.')
    expect(screen.getByRole('alert')).toHaveFocus()
  })
})
