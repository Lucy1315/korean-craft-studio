import { Button } from '@/components/ui/Button'
import { formatDuration, formatPrice } from '@/lib/format'
import type { CraftClass } from '@/types'

interface ClassCardProps {
  craftClass: CraftClass
  onApply: (craftClass: CraftClass) => void
}

export function ClassCard({ craftClass, onApply }: ClassCardProps) {
  const soldOut = craftClass.remainingSeats === 0

  return (
    <article className="flex flex-col gap-3 border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold">{craftClass.name}</h3>
        {soldOut ? (
          <span className="shrink-0 border border-danger px-2 py-0.5 text-sm text-danger">마감</span>
        ) : null}
      </div>
      <p className="text-sm text-ink-muted">{craftClass.description}</p>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-muted">수강료</dt>
          <dd>{formatPrice(craftClass.price)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-muted">소요시간</dt>
          <dd>{formatDuration(craftClass.durationMinutes)}</dd>
        </div>
      </dl>
      <p className="text-sm text-ink-muted">
        정원 {craftClass.capacity}명 · 잔여 {craftClass.remainingSeats}석
      </p>
      {soldOut ? (
        <Button disabled className="mt-auto self-start">
          마감
        </Button>
      ) : (
        <Button
          aria-label={`${craftClass.name} 클래스 신청하기`}
          onClick={() => onApply(craftClass)}
          className="mt-auto self-start"
        >
          신청하기
        </Button>
      )}
    </article>
  )
}
