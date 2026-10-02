import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
}

type InputFieldProps = BaseProps & { multiline?: false } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'required' | 'id'
  >

type TextareaFieldProps = BaseProps & { multiline: true } & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'name' | 'required' | 'id'
  >

type FormFieldProps = InputFieldProps | TextareaFieldProps

const controlClass =
  'w-full rounded-sm border border-ink-muted bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-muted read-only:bg-paper-deep aria-[invalid=true]:border-danger'

// label·입력·오류 메시지를 연결한다. 검증은 하지 않는다.
// 오류가 있는 입력은 aria-invalid="true"이므로 폼에서 form.querySelector('[aria-invalid="true"]')로 첫 오류 필드를 찾을 수 있다.
export function FormField(props: FormFieldProps) {
  const id = useId()
  const { label, name, error, hint, required = false, multiline, ...rest } = props
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  const shared = {
    id,
    name,
    required,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    className: controlClass,
  }

  // 구조 분해 뒤에는 판별 합집합이 좁혀지지 않아 요소별 속성 타입으로 단언한다.
  const control = multiline ? (
    <textarea rows={3} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...shared} />
  ) : (
    <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...shared} />
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="ml-1 text-ink-muted">(필수)</span> : null}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
