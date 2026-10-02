import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PracticeNotice } from './PracticeNotice'

describe('PracticeNotice', () => {
  it('실습용 안내 문구를 보여주고 닫기 버튼이 없다', () => {
    render(<PracticeNotice />)
    expect(
      screen.getByText('실습용 프로토타입입니다. 실제 이름·전화번호를 입력하지 마세요.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
