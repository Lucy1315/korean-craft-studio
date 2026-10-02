import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('h2 제목과 가상 브랜드 안내를 보여준다', () => {
    render(<Hero />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.getByText(/가상의 실습용 브랜드/)).toBeInTheDocument()
  })
})
