import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Craft } from '@/types'
import { CraftSection } from './CraftSection'

const crafts: Craft[] = [
  {
    id: 'a',
    name: '가 항아리',
    category: '도자기',
    description: '설명 가.',
    price: 10000,
    image: { src: '/images/crafts/fixture.jpg', alt: '가 항아리 사진' },
  },
  {
    id: 'b',
    name: '나 보자기',
    category: '보자기',
    description: '설명 나.',
    price: 20000,
    image: { src: '/images/crafts/fixture.jpg', alt: '나 보자기 사진' },
  },
]

describe('CraftSection', () => {
  it('제목, 가상 안내, 상품 카드를 보여준다', () => {
    render(<CraftSection crafts={crafts} />)
    expect(screen.getByRole('heading', { level: 2, name: '공예품 전시·주문' })).toBeInTheDocument()
    expect(screen.getByText(/실습용 가상 안내/)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('주문 문의하기를 누르면 상품명이 채워진 모달 폼이 열린다', async () => {
    const user = userEvent.setup()
    render(<CraftSection crafts={crafts} />)
    await user.click(screen.getByRole('button', { name: '나 보자기 주문 문의하기' }))
    const dialog = screen.getByRole('dialog', { name: '주문 문의' })
    expect(within(dialog).getByLabelText('상품')).toHaveValue('나 보자기')
  })

  it('닫았다가 다시 열면 입력이 비어 있다', async () => {
    const user = userEvent.setup()
    render(<CraftSection crafts={crafts} />)
    await user.click(screen.getByRole('button', { name: '가 항아리 주문 문의하기' }))
    await user.type(screen.getByLabelText(/이름/), '홍길동')
    await user.click(screen.getByRole('button', { name: '닫기' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '가 항아리 주문 문의하기' }))
    expect(screen.getByLabelText(/이름/)).toHaveValue('')
    expect(screen.getByLabelText('상품')).toHaveValue('가 항아리')
  })
})
