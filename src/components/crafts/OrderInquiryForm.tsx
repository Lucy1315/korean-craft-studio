'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FormNotice } from '@/components/forms/FormNotice'
import { SubmissionError } from '@/components/forms/SubmissionError'
import { SubmissionResult } from '@/components/forms/SubmissionResult'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { useSubmission } from '@/hooks/useSubmission'
import { submitOrderInquiry } from '@/lib/mock-api'
import { MAX_MEMO_LENGTH, MAX_ORDER_QUANTITY, validateOrderInquiry } from '@/lib/validation'
import type { Craft, FieldErrors, OrderInquiryInput, OrderInquiryValues, SubmitFn } from '@/types'

interface OrderInquiryFormProps {
  craft: Craft
  onClose: () => void
  onBusyChange?: (busy: boolean) => void
  submit?: SubmitFn<OrderInquiryInput>
}

const initialValues: OrderInquiryValues = { name: '', phone: '', quantity: '1', memo: '' }

export function OrderInquiryForm({ craft, onClose, onBusyChange, submit = submitOrderInquiry }: OrderInquiryFormProps) {
  const [values, setValues] = useState<OrderInquiryValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<OrderInquiryValues>>({})
  // 검증 실패마다 늘려서, 오류가 화면에 반영된 뒤 첫 오류 필드로 포커스를 옮기는 효과를 일으킨다.
  const [focusRequest, setFocusRequest] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const { status, result, submit: runSubmit } = useSubmission(submit)

  const submitting = status === 'submitting'

  useEffect(() => {
    onBusyChange?.(submitting)
  }, [submitting, onBusyChange])

  useEffect(() => {
    if (focusRequest === 0) return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [focusRequest])

  function setField(field: keyof OrderInquiryValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const nextErrors = validateOrderInquiry(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setFocusRequest((count) => count + 1)
      return
    }
    const memo = values.memo.trim()
    void runSubmit({
      craftId: craft.id,
      name: values.name.trim(),
      phone: values.phone.trim(),
      quantity: Number(values.quantity),
      ...(memo ? { memo } : {}),
    })
  }

  if (status === 'success' && result?.ok) {
    return (
      <SubmissionResult
        title="주문 문의가 접수되었습니다"
        receiptNo={result.receiptNo}
        message={result.message}
        onClose={onClose}
      />
    )
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={submitting}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <FormNotice />
      {status === 'error' && result && !result.ok ? <SubmissionError message={result.message} /> : null}
      <FormField label="상품" name="product" readOnly value={craft.name} />
      <FormField
        label="이름"
        name="name"
        required
        autoComplete="off"
        value={values.name}
        error={errors.name}
        onChange={(event) => setField('name', event.target.value)}
      />
      <FormField
        label="연락처"
        name="phone"
        required
        type="tel"
        inputMode="numeric"
        autoComplete="off"
        placeholder="010-1234-5678"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => setField('phone', event.target.value)}
      />
      <FormField
        label="수량"
        name="quantity"
        required
        type="number"
        min={1}
        max={MAX_ORDER_QUANTITY}
        value={values.quantity}
        error={errors.quantity}
        onChange={(event) => setField('quantity', event.target.value)}
      />
      <FormField
        label="요청사항"
        name="memo"
        multiline
        maxLength={MAX_MEMO_LENGTH}
        value={values.memo}
        error={errors.memo}
        onChange={(event) => setField('memo', event.target.value)}
      />
      <Button type="submit" disabled={submitting} className="self-end">
        {submitting ? '접수 중…' : status === 'error' ? '다시 시도' : '주문 문의 접수'}
      </Button>
    </form>
  )
}
