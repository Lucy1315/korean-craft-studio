import { ClassSection } from '@/components/classes/ClassSection'
import { CraftSection } from '@/components/crafts/CraftSection'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Tabs } from '@/components/ui/Tabs'
import { craftClasses } from '@/mocks/classes'
import { crafts } from '@/mocks/crafts'
import type { ImageCredit } from '@/types'

const imageCredits = crafts.flatMap((craft): Array<{ label: string; credit: ImageCredit }> =>
  craft.image.credit ? [{ label: craft.name, credit: craft.image.credit }] : [],
)

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Tabs
            label="온결 공방 메뉴"
            tabs={[
              { id: 'crafts', label: '공예품 전시·주문', content: <CraftSection crafts={crafts} /> },
              { id: 'classes', label: '공방 클래스', content: <ClassSection classes={craftClasses} /> },
            ]}
          />
        </div>
      </main>
      <Footer imageCredits={imageCredits} />
    </>
  )
}
