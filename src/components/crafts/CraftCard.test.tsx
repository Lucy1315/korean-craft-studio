import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Craft } from '@/types'
import { CraftCard } from './CraftCard'

const craft: Craft = {
  id: 'test-jar',
  name: '테스트 항아리',
  category: '도자기',
  description: '테스트용 설명이다.',
  price: 1234000,
  image: { src: '/images/crafts/fixture.jpg', alt: '푸른 항아리 사진' },
}

describe('CraftCard', () => {
  it('이름·종류·설명·가격·이미지를 보여준다', () => {
    render(<CraftCard craft={craft} onInquire={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 3, name: '테스트 항아리' })).toBeInTheDocument()
    expect(screen.getByText('도자기')).toBeInTheDocument()
    expect(screen.getByText('테스트용 설명이다.')).toBeInTheDocument()
    expect(screen.getByText('1,234,000원')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '푸른 항아리 사진' })).toBeInTheDocument()
  })

  it('버튼 이름에 상품명이 들어 있고 클릭하면 onInquire에 상품을 넘긴다', async () => {
    const onInquire = vi.fn()
    render(<CraftCard craft={craft} onInquire={onInquire} />)
    await userEvent.setup().click(screen.getByRole('button', { name: '테스트 항아리 주문 문의하기' }))
    expect(onInquire).toHaveBeenCalledWith(craft)
  })
})
