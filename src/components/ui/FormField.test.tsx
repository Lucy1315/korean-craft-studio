import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('label과 입력을 연결하고 필수 표시를 한다', () => {
    render(<FormField label="이름" name="name" required defaultValue="" />)
    const input = screen.getByLabelText(/이름/)
    expect(input).toBeRequired()
    expect(screen.getByText('(필수)')).toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('오류가 있으면 aria-invalid와 aria-describedby로 연결한다', () => {
    render(<FormField label="연락처" name="phone" error="연락처 형식을 확인해 주세요." defaultValue="" />)
    const input = screen.getByLabelText(/연락처/)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('연락처 형식을 확인해 주세요.')
  })

  it('multiline이면 textarea를 그린다', () => {
    render(<FormField label="요청사항" name="memo" multiline defaultValue="" />)
    expect(screen.getByLabelText(/요청사항/).tagName).toBe('TEXTAREA')
  })
})
