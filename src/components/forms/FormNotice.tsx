// 폼 상단 실습 안내. 배너만으로는 모달 안에서 보이지 않으므로 폼마다 다시 알린다.
export function FormNotice() {
  return (
    <p className="rounded-sm border border-line bg-paper-deep px-3 py-2 text-sm text-ink-muted">
      실습용 가상 폼입니다. 실제 이름·전화번호를 입력하지 마세요. 예시: 홍길동 / 010-1234-5678 · 오류
      테스트: 010-0000-0000
    </p>
  )
}
