import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ClassApplicationInput, CraftClass, MockResult } from '@/types'
import { ClassApplicationForm } from './ClassApplicationForm'

const craftClass: CraftClass = {
  id: 'wheel',
  name: '물레 도자기',
  description: '설명',
  price: 65000,
  durationMinutes: 150,
  capacity: 8,
  remainingSeats: 3,
}
const today = () => '2026-09-30'
const okResult: MockResult = { ok: true, receiptNo: 'CLS-20260930-0001', message: '가상 접수입니다.' }
const failResult: MockResult = { ok: false, code: 'MOCK_ERROR', message: 'Mock 오류가 발생했습니다.' }

function setup(submit = vi.fn<(input: ClassApplicationInput) => Promise<MockResult>>().mockResolvedValue(okResult)) {
  const onClose = vi.fn()
  const onBusyChange = vi.fn()
  render(
    <ClassApplicationForm
      craftClass={craftClass}
      onClose={onClose}
      onBusyChange={onBusyChange}
      submit={submit}
      getToday={today}
    />,
  )
  return { submit, onClose, onBusyChange, user: userEvent.setup() }
}

async function fill(user: ReturnType<typeof userEvent.setup>, phone = '010-1234-5678', date = '2026-10-05') {
  await user.type(screen.getByLabelText(/이름/), '  홍길동 ')
  await user.type(screen.getByLabelText(/연락처/), phone)
  await user.type(screen.getByLabelText(/희망 날짜/), date)
}

describe('ClassApplicationForm', () => {
  it('클래스 이름이 읽기 전용으로 채워지고 날짜 min은 내일이다', () => {
    setup()
    expect(screen.getByLabelText('클래스')).toHaveValue('물레 도자기')
    expect(screen.getByLabelText('클래스')).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/희망 날짜/)).toHaveAttribute('min', '2026-10-01')
    const headcount = screen.getByLabelText(/인원/)
    expect(headcount).toHaveValue(1)
    expect(headcount).toHaveAttribute('max', '3')
    expect(screen.getByLabelText(/연락처/)).toHaveAttribute('inputmode', 'numeric')
  })

  it('빈 제출은 submit을 호출하지 않고 오류를 보이며 첫 오류 필드에 포커스한다', async () => {
    const { submit, user } = setup()
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('이름을 입력해 주세요.')).toBeInTheDocument()
    expect(screen.getByText('연락처를 입력해 주세요.')).toBeInTheDocument()
    expect(screen.getByLabelText(/이름/)).toHaveFocus()
  })

  it('오늘·과거 날짜는 거부한다', async () => {
    const { submit, user } = setup()
    await fill(user, '010-1234-5678', '2026-09-30')
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('희망 날짜는 내일 이후로 선택해 주세요.')).toBeInTheDocument()
    expect(screen.getByLabelText(/희망 날짜/)).toHaveFocus()
  })

  it('잔여석을 넘는 인원은 거부한다', async () => {
    const { submit, user } = setup()
    await fill(user)
    const headcount = screen.getByLabelText(/인원/)
    await user.clear(headcount)
    await user.type(headcount, '4')
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('인원은 1~3명 사이로 입력해 주세요.')).toBeInTheDocument()
  })

  it('제출 중에는 접수 중 표시와 비활성 버튼이며 중복 클릭해도 한 번만 호출한다', async () => {
    const submit = vi.fn(() => new Promise<MockResult>(() => {}))
    const { user, onBusyChange } = setup(submit)
    await fill(user)
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    const busyButton = await screen.findByRole('button', { name: '접수 중…' })
    expect(busyButton).toBeDisabled()
    expect(document.querySelector('form')).toHaveAttribute('aria-busy', 'true')
    await user.click(busyButton)
    expect(submit).toHaveBeenCalledTimes(1)
    expect(onBusyChange).toHaveBeenLastCalledWith(true)
  })

  it('성공하면 접수번호를 보여주고 정리된 입력으로 호출한다', async () => {
    const { submit, user, onClose, onBusyChange } = setup()
    await fill(user)
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    expect(await screen.findByText('CLS-20260930-0001')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '클래스 신청이 접수되었습니다' })).toBeInTheDocument()
    expect(submit).toHaveBeenCalledWith({
      classId: 'wheel',
      name: '홍길동',
      phone: '010-1234-5678',
      preferredDate: '2026-10-05',
      headcount: 1,
    })
    expect(onBusyChange).toHaveBeenLastCalledWith(false)
    await user.click(screen.getByRole('button', { name: '닫기' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('요청사항이 있으면 memo를 포함한다', async () => {
    const { submit, user } = setup()
    await fill(user)
    await user.type(screen.getByLabelText(/요청사항/), '왼손잡이입니다')
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1))
    expect(submit.mock.calls[0]?.[0].memo).toBe('왼손잡이입니다')
  })

  it('실패하면 alert와 입력값을 유지하고 다시 시도로 고친 값을 제출한다', async () => {
    const submit = vi
      .fn<(input: ClassApplicationInput) => Promise<MockResult>>()
      .mockResolvedValueOnce(failResult)
      .mockResolvedValueOnce(okResult)
    const { user } = setup(submit)
    await fill(user, '010-0000-0000')
    await user.click(screen.getByRole('button', { name: '신청하기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Mock 오류가 발생했습니다.')
    expect(screen.getByLabelText(/이름/)).toHaveValue('  홍길동 ')
    expect(screen.getByLabelText(/연락처/)).toHaveValue('010-0000-0000')

    const phone = screen.getByLabelText(/연락처/)
    await user.clear(phone)
    await user.type(phone, '010-1234-5678')
    await user.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(await screen.findByText('CLS-20260930-0001')).toBeInTheDocument()
    expect(submit).toHaveBeenCalledTimes(2)
    expect(submit.mock.calls[1]?.[0].phone).toBe('010-1234-5678')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
