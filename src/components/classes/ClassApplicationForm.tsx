'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FormNotice } from '@/components/forms/FormNotice'
import { SubmissionError } from '@/components/forms/SubmissionError'
import { SubmissionResult } from '@/components/forms/SubmissionResult'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { useSubmission } from '@/hooks/useSubmission'
import { toLocalDateString } from '@/lib/date'
import { submitClassApplication } from '@/lib/mock-api'
import { MAX_MEMO_LENGTH, validateClassApplication } from '@/lib/validation'
import type {
  ClassApplicationInput,
  ClassApplicationValues,
  CraftClass,
  FieldErrors,
  SubmitFn,
} from '@/types'

interface ClassApplicationFormProps {
  craftClass: CraftClass
  onClose: () => void
  onBusyChange?: (busy: boolean) => void
  submit?: SubmitFn<ClassApplicationInput>
  getToday?: () => string
}

const emptyValues: ClassApplicationValues = {
  name: '',
  phone: '',
  preferredDate: '',
  headcount: '1',
  memo: '',
}

const defaultGetToday = () => toLocalDateString(new Date())

// 'YYYY-MM-DD'의 다음 날. Date(y, m, d + 1)로 로컬 시간 산술을 한다(UTC 파싱 회피).
function nextDay(today: string): string {
  const [year = 0, month = 1, day = 1] = today.split('-').map(Number)
  return toLocalDateString(new Date(year, month - 1, day + 1))
}

export function ClassApplicationForm({
  craftClass,
  onClose,
  onBusyChange,
  submit = submitClassApplication,
  getToday = defaultGetToday,
}: ClassApplicationFormProps) {
  const [values, setValues] = useState<ClassApplicationValues>(emptyValues)
  const [errors, setErrors] = useState<FieldErrors<ClassApplicationValues>>({})
  const [focusTick, setFocusTick] = useState(0)
  // 폼은 모달이 열릴 때(클라이언트)만 마운트되므로 렌더 중 계산해도 서버·정적 빌드에 영향이 없다.
  const [minDate] = useState(() => nextDay(getToday()))
  const formRef = useRef<HTMLFormElement>(null)
  const { status, result, submit: runSubmit } = useSubmission(submit)
  const busy = status === 'submitting'

  useEffect(() => {
    onBusyChange?.(busy)
  }, [busy, onBusyChange])

  useEffect(() => {
    if (focusTick === 0) return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [focusTick])

  if (status === 'success' && result?.ok) {
    return (
      <SubmissionResult
        title="클래스 신청이 접수되었습니다"
        receiptNo={result.receiptNo}
        message={result.message}
        onClose={onClose}
      />
    )
  }

  const setField = (field: keyof ClassApplicationValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const nextErrors = validateClassApplication(values, {
      today: getToday(),
      maxHeadcount: craftClass.remainingSeats,
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setFocusTick((tick) => tick + 1)
      return
    }
    const memo = values.memo.trim()
    void runSubmit({
      classId: craftClass.id,
      name: values.name.trim(),
      phone: values.phone.trim(),
      preferredDate: values.preferredDate,
      headcount: Number(values.headcount),
      ...(memo ? { memo } : {}),
    })
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={busy}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <FormNotice />
      {status === 'error' && result && !result.ok ? <SubmissionError message={result.message} /> : null}
      <FormField label="클래스" name="className" readOnly value={craftClass.name} />
      <FormField
        label="이름"
        name="name"
        required
        autoComplete="off"
        value={values.name}
        error={errors.name}
        onChange={(e) => setField('name')(e.target.value)}
      />
      <FormField
        label="연락처"
        name="phone"
        required
        type="tel"
        inputMode="numeric"
        autoComplete="off"
        value={values.phone}
        error={errors.phone}
        onChange={(e) => setField('phone')(e.target.value)}
      />
      <FormField
        label="희망 날짜"
        name="preferredDate"
        required
        type="date"
        min={minDate}
        value={values.preferredDate}
        error={errors.preferredDate}
        onChange={(e) => setField('preferredDate')(e.target.value)}
      />
      <FormField
        label="인원"
        name="headcount"
        required
        type="number"
        min={1}
        max={craftClass.remainingSeats}
        hint={`최대 ${craftClass.remainingSeats}명까지 신청할 수 있습니다.`}
        value={values.headcount}
        error={errors.headcount}
        onChange={(e) => setField('headcount')(e.target.value)}
      />
      <FormField
        label="요청사항"
        name="memo"
        multiline
        maxLength={MAX_MEMO_LENGTH}
        value={values.memo}
        error={errors.memo}
        onChange={(e) => setField('memo')(e.target.value)}
      />
      <Button type="submit" disabled={busy} className="self-end">
        {busy ? '접수 중…' : status === 'error' ? '다시 시도' : '신청하기'}
      </Button>
    </form>
  )
}
