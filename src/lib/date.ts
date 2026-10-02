// 로컬 시간 기준 'YYYY-MM-DD'. toISOString은 UTC라서 KST에서 하루 어긋날 수 있어 쓰지 않는다.
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
