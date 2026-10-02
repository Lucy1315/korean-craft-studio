import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import HomePage from './page'

describe('HomePage 통합', () => {
  it('탭은 정확히 2개이고 기본 탭은 공예품 전시·주문이다', () => {
    render(<HomePage />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['공예품 전시·주문', '공방 클래스'])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('공방 클래스 탭으로 전환하면 클래스 패널이 보인다', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    await user.click(screen.getByRole('tab', { name: '공방 클래스' }))
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getAllByRole('article').length).toBeGreaterThanOrEqual(3)
  })

  it('실제 Mock API로 실패 번호는 오류, 고친 번호는 접수번호를 보여준다', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getAllByRole('article').length).toBeGreaterThanOrEqual(6)

    await user.click(within(panel).getAllByRole('button', { name: /주문 문의하기/ })[0])
    const dialog = screen.getByRole('dialog', { name: '주문 문의' })
    await user.type(within(dialog).getByLabelText(/이름/), '홍길동')
    const phone = within(dialog).getByLabelText(/연락처/)
    await user.type(phone, '010-0000-0000')
    await user.click(within(dialog).getByRole('button', { name: '주문 문의 접수' }))

    expect(await within(dialog).findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent('Mock 오류')

    await user.clear(phone)
    await user.type(phone, '010-1234-5678')
    await user.click(within(dialog).getByRole('button', { name: '다시 시도' }))
    expect(await within(dialog).findByText(/^ORD-\d{8}-\d{4}$/, {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
