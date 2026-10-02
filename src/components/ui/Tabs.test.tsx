import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs } from './Tabs'

const tabs = [
  { id: 'a', label: '공예품 전시·주문', content: <p>첫째 내용</p> },
  { id: 'b', label: '공방 클래스', content: <input aria-label="메모" /> },
  { id: 'c', label: '세 번째', content: <p>셋째 내용</p> },
]

function setup(defaultTabId?: string) {
  return render(<Tabs label="공방 메뉴" tabs={tabs} defaultTabId={defaultTabId} />)
}

describe('Tabs', () => {
  it('tablist, tab, tabpanel 역할과 aria 연결이 맞다', () => {
    setup()
    expect(screen.getByRole('tablist', { name: '공방 메뉴' })).toBeInTheDocument()
    const tabEls = screen.getAllByRole('tab')
    expect(tabEls).toHaveLength(3)
    const panel = screen.getByRole('tabpanel', { name: '공예품 전시·주문' })
    expect(tabEls[0]).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', tabEls[0].id)
    expect(panel).toHaveAttribute('tabindex', '0')
    expect(tabEls[0]).toHaveAttribute('type', 'button')
  })

  it('기본은 첫 탭이고 defaultTabId가 있으면 그 탭이다', () => {
    const { unmount } = setup()
    expect(screen.getByRole('tab', { name: '공예품 전시·주문' })).toHaveAttribute('aria-selected', 'true')
    unmount()
    setup('b')
    expect(screen.getByRole('tab', { name: '공방 클래스' })).toHaveAttribute('aria-selected', 'true')
  })

  it('클릭하면 탭이 전환된다', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('tab', { name: '공방 클래스' }))
    expect(screen.getByRole('tab', { name: '공방 클래스' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: '공예품 전시·주문' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: '공방 클래스' })).toBeVisible()
  })

  it('로빙 tabindex: 선택된 탭만 0이다', async () => {
    const user = userEvent.setup()
    setup()
    const [t1, t2, t3] = screen.getAllByRole('tab')
    expect([t1, t2, t3].map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
    await user.click(t2)
    expect([t1, t2, t3].map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '0', '-1'])
  })

  it('ArrowRight/ArrowLeft는 순환하며 활성화하고 포커스를 옮긴다', async () => {
    const user = userEvent.setup()
    setup()
    const [t1, t2, t3] = screen.getAllByRole('tab')
    t1.focus()
    await user.keyboard('{ArrowRight}')
    expect(t2).toHaveFocus()
    expect(t2).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(t1).toHaveFocus()
    expect(t1).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowLeft}')
    expect(t3).toHaveFocus()
    expect(t3).toHaveAttribute('aria-selected', 'true')
  })

  it('Home/End는 처음/마지막 탭으로 이동한다', async () => {
    const user = userEvent.setup()
    setup()
    const [t1, , t3] = screen.getAllByRole('tab')
    t1.focus()
    await user.keyboard('{End}')
    expect(t3).toHaveFocus()
    expect(t3).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Home}')
    expect(t1).toHaveFocus()
    expect(t1).toHaveAttribute('aria-selected', 'true')
  })

  it('비활성 패널은 hidden이지만 DOM에 남아 상태가 유지된다', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('tab', { name: '공방 클래스' }))
    await user.type(screen.getByLabelText('메모'), '안녕')
    await user.click(screen.getByRole('tab', { name: '공예품 전시·주문' }))
    const hiddenPanel = document.getElementById(screen.getByRole('tab', { name: '공방 클래스' }).getAttribute('aria-controls') as string)
    expect(hiddenPanel).toHaveAttribute('hidden')
    expect(screen.getByLabelText('메모', { selector: 'input' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: '공방 클래스' }))
    expect(screen.getByLabelText('메모')).toHaveValue('안녕')
  })
})
