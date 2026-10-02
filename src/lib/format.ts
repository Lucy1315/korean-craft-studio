const priceFormatter = new Intl.NumberFormat('ko-KR')

export function formatPrice(price: number): string {
  return `${priceFormatter.format(price)}원`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}분`
  if (rest === 0) return `${hours}시간`
  return `${hours}시간 ${rest}분`
}
