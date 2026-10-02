import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { CraftClass } from '@/types'
import { ClassSection } from './ClassSection'

const classes: CraftClass[] = [
  { id: 'a', name: '물레 도자기', description: '설명 A', price: 65000, durationMinutes: 150, capacity: 8, remainingSeats: 3 },
  { id: 'b', name: '목공 소품', description: '설명 B', price: 50000, durationMinutes: 120, capacity: 6, remainingSeats: 0 },
]

describe('ClassSection', () => {
  it('제목과 가상 안내와 카드를 보여준다', () => {
    render(<ClassSection classes={classes} />)
    expect(screen.getByRole('heading', { level: 2, name: '공방 클래스' })).toBeInTheDocument()
    expect(screen.getByText(/실습용 가상 안내/)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('신청하기를 누르면 클래스 이름이 채워진 모달이 열리고 닫았다 열면 빈 폼이다', async () => {
    const user = userEvent.setup()
    render(<ClassSection classes={classes} />)
    await user.click(screen.getByRole('button', { name: '물레 도자기 클래스 신청하기' }))
    const dialog = screen.getByRole('dialog', { name: '클래스 신청' })
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByLabelText('클래스')).toHaveValue('물레 도자기')
    await user.type(screen.getByLabelText(/이름/), '홍길동')

    await user.click(screen.getByRole('button', { name: '닫기' }))
    expect(screen.queryByLabelText('클래스')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '물레 도자기 클래스 신청하기' }))
    expect(screen.getByLabelText(/이름/)).toHaveValue('')
  })
})
