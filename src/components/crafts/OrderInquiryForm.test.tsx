import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Craft, MockResult, OrderInquiryInput } from '@/types'
import { OrderInquiryForm } from './OrderInquiryForm'

const craft: Craft = {
  id: 'test-jar',
  name: '테스트 항아리',
  category: '도자기',
  description: '테스트용 설명이다.',
  price: 100000,
  image: { src: '/images/crafts/fixture.jpg', alt: '테스트 항아리 사진' },
}

const okResult: MockResult = { ok: true, receiptNo: 'ORD-20261002-0001', message: '가상 접수입니다.' }
const failResult: MockResult = { ok: false, code: 'MOCK_ERROR', message: '접수에 실패했습니다(Mock 오류).' }

function setup(submit: (input: OrderInquiryInput) => Promise<MockResult>, onBusyChange?: (busy: boolean) => void) {
  const onClose = vi.fn()
  const user = userEvent.setup()
  render(<OrderInquiryForm craft={craft} onClose={onClose} onBusyChange={onBusyChange} submit={submit} />)
  return { user, onClose }
}

async function fillValid(user: ReturnType<typeof userEvent.setup>, phone = '010-1234-5678') {
  await user.type(screen.getByLabelText(/이름/), '  홍길동 ')
  await user.type(screen.getByLabelText(/연락처/), phone)
}

describe('OrderInquiryForm', () => {
  it('상품명을 읽기 전용으로 채우고 수량 기본값은 1이다', () => {
    setup(vi.fn())
    const product = screen.getByLabelText('상품')
    expect(product).toHaveValue('테스트 항아리')
    expect(product).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/수량/)).toHaveValue(1)
    expect(screen.getByLabelText(/연락처/)).toHaveAttribute('type', 'tel')
  })

  it('빈 제출은 submit을 호출하지 않고 오류를 보이며 첫 오류 필드에 포커스한다', async () => {
    const submit = vi.fn()
    const { user } = setup(submit)
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByText('이름을 입력해 주세요.')).toBeInTheDocument()
    expect(screen.getByText('연락처를 입력해 주세요.')).toBeInTheDocument()
    const name = screen.getByLabelText(/이름/)
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveFocus()
  })

  it('입력값을 다듬어 submit에 전달하고 빈 요청사항은 생략한다', async () => {
    const submit = vi.fn().mockResolvedValue(okResult)
    const { user } = setup(submit)
    await fillValid(user)
    await user.clear(screen.getByLabelText(/수량/))
    await user.type(screen.getByLabelText(/수량/), '3')
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    expect(submit).toHaveBeenCalledWith({
      craftId: 'test-jar',
      name: '홍길동',
      phone: '010-1234-5678',
      quantity: 3,
    })
  })

  it('요청사항이 있으면 함께 전달한다', async () => {
    const submit = vi.fn().mockResolvedValue(okResult)
    const { user } = setup(submit)
    await fillValid(user)
    await user.type(screen.getByLabelText('요청사항'), '포장 부탁드립니다')
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ memo: '포장 부탁드립니다' }))
  })

  it('제출 중에는 버튼이 "접수 중…"으로 비활성화되고 중복 클릭해도 한 번만 호출한다', async () => {
    const submit = vi.fn().mockReturnValue(new Promise<MockResult>(() => {}))
    const onBusyChange = vi.fn()
    const { user } = setup(submit, onBusyChange)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    const busyButton = await screen.findByRole('button', { name: '접수 중…' })
    expect(busyButton).toBeDisabled()
    await user.click(busyButton)
    expect(submit).toHaveBeenCalledTimes(1)
    expect(document.querySelector('form')).toHaveAttribute('aria-busy', 'true')
    expect(onBusyChange).toHaveBeenLastCalledWith(true)
  })

  it('성공하면 폼 대신 접수번호를 보여주고 busy를 해제한다', async () => {
    const submit = vi.fn().mockResolvedValue(okResult)
    const onBusyChange = vi.fn()
    const { user, onClose } = setup(submit, onBusyChange)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    expect(await screen.findByText('ORD-20261002-0001')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '주문 문의가 접수되었습니다' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/이름/)).not.toBeInTheDocument()
    expect(onBusyChange).toHaveBeenLastCalledWith(false)
    await user.click(screen.getByRole('button', { name: '닫기' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('실패하면 alert와 입력값을 유지하고, 연락처를 고쳐 다시 시도하면 고친 값으로 제출한다', async () => {
    const submit = vi.fn().mockResolvedValueOnce(failResult).mockResolvedValueOnce(okResult)
    const { user } = setup(submit)
    await fillValid(user, '010-0000-0000')
    await user.click(screen.getByRole('button', { name: '주문 문의 접수' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('접수에 실패했습니다(Mock 오류).')
    expect(screen.getByLabelText(/이름/)).toHaveValue('  홍길동 ')
    expect(screen.getByLabelText(/연락처/)).toHaveValue('010-0000-0000')

    const retry = screen.getByRole('button', { name: '다시 시도' })
    const phone = screen.getByLabelText(/연락처/)
    await user.clear(phone)
    await user.type(phone, '010-1111-2222')
    // 입력을 고치는 것만으로는 alert가 사라지지 않는다.
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await user.click(retry)
    expect(submit).toHaveBeenCalledTimes(2)
    expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ phone: '010-1111-2222' }))
    await waitFor(() => expect(screen.getByText('ORD-20261002-0001')).toBeInTheDocument())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
