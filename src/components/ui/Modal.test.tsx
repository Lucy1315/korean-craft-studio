import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

function Harness({ preventClose = false, onClosed }: { preventClose?: boolean; onClosed?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        열기
      </button>
      <Modal
        open={open}
        title="주문 문의"
        preventClose={preventClose}
        onClose={() => {
          setOpen(false)
          onClosed?.()
        }}
      >
        <label htmlFor="product">상품</label>
        <input id="product" readOnly value="달항아리" />
        <label htmlFor="name">이름</label>
        <input id="name" />
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('열리면 제목이 연결되고 읽기 전용이 아닌 첫 입력칸에 포커스가 간다', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: '열기' }))

    const dialog = screen.getByRole('dialog', { name: '주문 문의' })
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByLabelText('이름')).toHaveFocus()
  })

  it('닫기 버튼을 누르면 onClose가 1회 호출되고 여는 버튼으로 포커스가 돌아간다', async () => {
    const user = userEvent.setup()
    const onClosed = vi.fn()
    render(<Harness onClosed={onClosed} />)
    const trigger = screen.getByRole('button', { name: '열기' })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: '닫기' }))

    expect(onClosed).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open')
    expect(trigger).toHaveFocus()
  })

  it('preventClose이면 닫기 버튼이 비활성화되고 cancel(Esc)을 막는다', async () => {
    const user = userEvent.setup()
    render(<Harness preventClose />)
    await user.click(screen.getByRole('button', { name: '열기' }))

    expect(screen.getByRole('button', { name: '닫기' })).toBeDisabled()
    const cancel = new Event('cancel', { cancelable: true })
    screen.getByRole('dialog').dispatchEvent(cancel)
    expect(cancel.defaultPrevented).toBe(true)
  })

  it('preventClose가 아니면 cancel(Esc)을 막지 않는다', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: '열기' }))

    const cancel = new Event('cancel', { cancelable: true })
    screen.getByRole('dialog').dispatchEvent(cancel)
    expect(cancel.defaultPrevented).toBe(false)
  })
})
