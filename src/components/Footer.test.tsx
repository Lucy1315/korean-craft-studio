import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

const credits = [
  {
    label: '달항아리',
    credit: { author: '홍길동', license: 'CC BY 4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Moon.jpg' },
  },
]

describe('Footer', () => {
  it('가상 정보 안내와 주소·운영시간·문의처를 보여주고 tel/mailto 링크가 아니다', () => {
    render(<Footer imageCredits={[]} />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('아래 주소·운영시간·문의처는 모두 실습용 가상 정보입니다.')).toBeInTheDocument()
    expect(screen.getByText(/02-000-0000/)).toBeInTheDocument()
    expect(screen.getByText(/example\.com/)).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('이미지 출처를 rel 속성이 있는 링크로 보여준다', () => {
    render(<Footer imageCredits={credits} />)
    expect(screen.getByRole('heading', { name: '이미지 출처' })).toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', credits[0].credit.sourceUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(/홍길동/)).toBeInTheDocument()
    expect(screen.getByText(/CC BY 4\.0/)).toBeInTheDocument()
  })

  it('출처가 없으면 이미지 출처 목록을 렌더링하지 않는다', () => {
    render(<Footer imageCredits={[]} />)
    expect(screen.queryByRole('heading', { name: '이미지 출처' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
