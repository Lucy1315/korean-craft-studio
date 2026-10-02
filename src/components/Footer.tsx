import type { ImageCredit } from '@/types'

interface FooterProps {
  imageCredits: Array<{ label: string; credit: ImageCredit }>
}

export function Footer({ imageCredits }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <section aria-labelledby="footer-info-title">
          <h2 id="footer-info-title" className="font-serif text-lg font-semibold text-ink">
            공방 안내
          </h2>
          <p className="mt-2 text-sm text-ink-muted">아래 주소·운영시간·문의처는 모두 실습용 가상 정보입니다.</p>
          <dl className="mt-4 space-y-2 text-sm text-ink">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="w-24 shrink-0 text-ink-muted">주소</dt>
              <dd>서울특별시 가상구 실습로 123 (가상)</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="w-24 shrink-0 text-ink-muted">운영시간</dt>
              <dd>화~일 10:00-18:00, 월요일 휴무 (가상)</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="w-24 shrink-0 text-ink-muted">전화</dt>
              <dd>02-000-0000 (가상)</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="w-24 shrink-0 text-ink-muted">이메일</dt>
              <dd>hello@example.com (가상)</dd>
            </div>
          </dl>
        </section>
        {imageCredits.length > 0 && (
          <section aria-labelledby="footer-credits-title">
            <h2 id="footer-credits-title" className="font-serif text-lg font-semibold text-ink">
              이미지 출처
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              {imageCredits.map(({ label, credit }) => (
                <li key={`${label}-${credit.sourceUrl}`}>
                  {label}: {credit.author}, {credit.license},{' '}
                  <a
                    href={credit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-jjok underline underline-offset-2"
                  >
                    원본 보기
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </footer>
  )
}
