import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import type { Craft } from '@/types'

interface CraftCardProps {
  craft: Craft
  onInquire: (craft: Craft) => void
}

export function CraftCard({ craft, onInquire }: CraftCardProps) {
  return (
    <article className="flex flex-col border border-line bg-paper">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-paper-deep">
        <Image
          src={craft.image.src}
          alt={craft.image.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-ink-muted">{craft.category}</p>
          <h3 className="font-serif text-lg font-semibold">{craft.name}</h3>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{craft.description}</p>
        <p className="font-serif text-lg">{formatPrice(craft.price)}</p>
        <Button
          variant="secondary"
          aria-label={`${craft.name} 주문 문의하기`}
          onClick={() => onInquire(craft)}
          className="w-full"
        >
          주문 문의하기
        </Button>
      </div>
    </article>
  )
}
