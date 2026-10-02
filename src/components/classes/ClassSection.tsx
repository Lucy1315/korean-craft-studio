'use client'

import { useCallback, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { CraftClass } from '@/types'
import { ClassApplicationForm } from './ClassApplicationForm'
import { ClassCard } from './ClassCard'

interface ClassSectionProps {
  classes: CraftClass[]
}

export function ClassSection({ classes }: ClassSectionProps) {
  const [selected, setSelected] = useState<CraftClass | null>(null)
  const [busy, setBusy] = useState(false)

  const close = useCallback(() => {
    setSelected(null)
    setBusy(false)
  }, [])

  return (
    <section aria-labelledby="class-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 id="class-heading" className="font-serif text-2xl font-semibold">
          공방 클래스
        </h2>
        <div className="border border-line bg-paper-deep px-4 py-3 text-sm text-ink-muted">
          <p className="font-medium text-ink">준비물·취소 안내 (실습용 가상 안내)</p>
          <ul className="mt-2 list-disc pl-5">
            <li>준비물: 앞치마와 편한 복장을 권한다. 도구와 재료는 공방에서 준비한다.</li>
            <li>취소·환불: 수강일 3일 전까지 전액 환불, 이후에는 환불이 어렵다.</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((craftClass) => (
          <ClassCard key={craftClass.id} craftClass={craftClass} onApply={setSelected} />
        ))}
      </div>
      <Modal open={selected !== null} title="클래스 신청" onClose={close} preventClose={busy}>
        {selected ? <ClassApplicationForm craftClass={selected} onClose={close} onBusyChange={setBusy} /> : null}
      </Modal>
    </section>
  )
}
