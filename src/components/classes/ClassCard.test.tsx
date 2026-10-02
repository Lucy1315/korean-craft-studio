import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CraftClass } from '@/types'
import { ClassCard } from './ClassCard'

const open: CraftClass = {
  id: 'wheel',
  name: '물레 도자기',
  description: '물레를 돌려 나만의 그릇을 빚는다.',
  price: 65000,
  durationMinutes: 150,
  capacity: 8,
  remainingSeats: 3,
}
const soldOut: CraftClass = { ...open, id: 'full', name: '나전 자개 소품', remainingSeats: 0 }

describe('ClassCard', () => {
  it('가격·소요시간·정원과 잔여석을 보여주고 신청 시 onApply를 호출한다', async () => {
    const onApply = vi.fn()
    render(<ClassCard craftClass={open} onApply={onApply} />)
    expect(screen.getByRole('heading', { level: 3, name: '물레 도자기' })).toBeInTheDocument()
    expect(screen.getByText('65,000원')).toBeInTheDocument()
    expect(screen.getByText('2시간 30분')).toBeInTheDocument()
    expect(screen.getByText('정원 8명 · 잔여 3석')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: '물레 도자기 클래스 신청하기' }))
    expect(onApply).toHaveBeenCalledWith(open)
  })

  it('마감이면 마감 배지와 비활성 마감 버튼을 보이고 onApply를 호출하지 않는다', async () => {
    const onApply = vi.fn()
    render(<ClassCard craftClass={soldOut} onApply={onApply} />)
    const button = screen.getByRole('button', { name: '마감' })
    expect(button).toBeDisabled()
    expect(screen.getAllByText('마감').length).toBeGreaterThanOrEqual(2)
    await userEvent.setup().click(button)
    expect(onApply).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /신청하기/ })).not.toBeInTheDocument()
  })
})
