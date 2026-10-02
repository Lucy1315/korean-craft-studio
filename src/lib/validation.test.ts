import { describe, expect, it } from 'vitest'
import {
  validateClassApplication,
  validateDate,
  validateMemo,
  validateName,
  validateOrderInquiry,
  validatePhone,
  validateQuantity,
} from './validation'

describe('validateName', () => {
  it('공백만 있으면 오류이다', () => {
    expect(validateName('   ')).toBeTruthy()
  })
  it('1~20자는 통과한다', () => {
    expect(validateName(' 홍길동 ')).toBeNull()
    expect(validateName('가'.repeat(20))).toBeNull()
  })
  it('21자는 오류이다', () => {
    expect(validateName('가'.repeat(21))).toBeTruthy()
  })
})

describe('validatePhone', () => {
  it.each(['010-1234-5678', '01012345678', '011-123-4567', '0111234567', '010-0000-0000'])(
    '%s는 통과한다',
    (phone) => {
      expect(validatePhone(phone)).toBeNull()
    },
  )
  it.each(['', '010-12345678', '0101234-5678', '02-123-4567', '010-12-5678', 'abc', '012-1234-5678'])(
    '%s는 오류이다',
    (phone) => {
      expect(validatePhone(phone)).toBeTruthy()
    },
  )
})

describe('validateQuantity', () => {
  it('정수 1~max만 통과한다', () => {
    expect(validateQuantity('1', 10)).toBeNull()
    expect(validateQuantity('10', 10)).toBeNull()
    expect(validateQuantity('0', 10)).toBeTruthy()
    expect(validateQuantity('11', 10)).toBeTruthy()
    expect(validateQuantity('1.5', 10)).toBeTruthy()
    expect(validateQuantity('', 10)).toBeTruthy()
    expect(validateQuantity('두개', 10)).toBeTruthy()
  })
})

describe('validateDate', () => {
  const today = '2026-09-30'
  it('내일부터 통과한다', () => {
    expect(validateDate('2026-10-01', today)).toBeNull()
  })
  it('오늘과 과거는 오류이다', () => {
    expect(validateDate('2026-09-30', today)).toBeTruthy()
    expect(validateDate('2026-09-29', today)).toBeTruthy()
  })
  it('빈 값과 형식 오류는 오류이다', () => {
    expect(validateDate('', today)).toBeTruthy()
    expect(validateDate('2026/10/01', today)).toBeTruthy()
  })
})

describe('validateMemo', () => {
  it('500자 이하는 통과하고 501자는 오류이다', () => {
    expect(validateMemo('')).toBeNull()
    expect(validateMemo('가'.repeat(500))).toBeNull()
    expect(validateMemo('가'.repeat(501))).toBeTruthy()
  })
})

describe('validateOrderInquiry', () => {
  it('유효한 입력은 오류가 없다', () => {
    expect(
      validateOrderInquiry({ name: '홍길동', phone: '010-1234-5678', quantity: '2', memo: '' }),
    ).toEqual({})
  })
  it('빈 입력은 이름·연락처·수량 오류를 낸다', () => {
    const errors = validateOrderInquiry({ name: '', phone: '', quantity: '', memo: '' })
    expect(Object.keys(errors).sort()).toEqual(['name', 'phone', 'quantity'])
  })
})

describe('validateClassApplication', () => {
  const options = { today: '2026-09-30', maxHeadcount: 3 }
  const valid = {
    name: '홍길동',
    phone: '01012345678',
    preferredDate: '2026-10-02',
    headcount: '3',
    memo: '',
  }
  it('유효한 입력은 오류가 없다', () => {
    expect(validateClassApplication(valid, options)).toEqual({})
  })
  it('잔여석을 넘는 인원은 오류이다', () => {
    expect(validateClassApplication({ ...valid, headcount: '4' }, options).headcount).toBeTruthy()
  })
  it('과거 날짜는 오류이다', () => {
    expect(
      validateClassApplication({ ...valid, preferredDate: '2026-09-01' }, options).preferredDate,
    ).toBeTruthy()
  })
})
