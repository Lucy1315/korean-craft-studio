'use client'

import { useCallback, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { Craft } from '@/types'
import { CraftCard } from './CraftCard'
import { OrderInquiryForm } from './OrderInquiryForm'

interface CraftSectionProps {
  crafts: Craft[]
}

export function CraftSection({ crafts }: CraftSectionProps) {
  const [selected, setSelected] = useState<Craft | null>(null)
  const [busy, setBusy] = useState(false)

  // 모달이 닫히면 선택을 비운다. Modal이 자식을 언마운트하므로 폼 상태도 함께 초기화된다.
  const handleClose = useCallback(() => {
    setSelected(null)
    setBusy(false)
  }, [])

  return (
    <section aria-labelledby="craft-section-title" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 id="craft-section-title" className="font-serif text-2xl font-semibold">
          공예품 전시·주문
        </h2>
        <p className="text-ink-muted">
          도자기·나전칠기·보자기·목공예 여덟 점을 전시합니다. 마음에 드는 작품은 주문 문의로 알려 주세요.
        </p>
      </div>

      <aside aria-labelledby="craft-guide-title" className="border border-line bg-paper-deep p-5">
        <h3 id="craft-guide-title" className="font-serif text-base font-semibold">
          제작·배송 안내 <span className="text-sm font-normal text-ink-muted">(실습용 가상 안내)</span>
        </h3>
        <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm text-ink-muted">
          <li>주문 제작 기간: 접수 후 약 3~4주 (가상)</li>
          <li>배송 방법: 전용 포장 후 택배 발송, 제작 완료 뒤 3일 이내 (가상)</li>
          <li>문의 접수는 실제 주문이나 결제로 이어지지 않습니다.</li>
        </ul>
      </aside>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {crafts.map((craft) => (
          <li key={craft.id} className="grid">
            <CraftCard craft={craft} onInquire={setSelected} />
          </li>
        ))}
      </ul>

      <Modal open={selected !== null} title="주문 문의" onClose={handleClose} preventClose={busy}>
        {selected ? <OrderInquiryForm craft={selected} onClose={handleClose} onBusyChange={setBusy} /> : null}
      </Modal>
    </section>
  )
}
