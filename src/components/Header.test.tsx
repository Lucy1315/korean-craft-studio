import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('header 안에 단일 h1 "온결 공방"과 한 줄 소개가 있다', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('온결 공방')
  })

  it('내비게이션 링크가 없다', () => {
    render(<Header />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
