import type { CraftClass } from '@/types'

// 실습용 가상 클래스. 마감(remainingSeats 0)은 정확히 1개이다.
export const craftClasses: CraftClass[] = [
  {
    id: 'wheel-pottery',
    name: '물레 도자기',
    description: '물레를 돌려 흙을 올리고, 나만의 찻잔을 빚어 보는 입문 클래스이다.',
    price: 65000,
    durationMinutes: 150,
    capacity: 8,
    remainingSeats: 3,
  },
  {
    id: 'najeon-charm',
    name: '나전 자개 소품',
    description: '얇게 간 자개를 오려 붙여 작은 거울이나 책갈피를 만드는 클래스이다.',
    price: 80000,
    durationMinutes: 180,
    capacity: 6,
    remainingSeats: 0,
  },
  {
    id: 'bojagi-knot',
    name: '보자기 매듭·조각보',
    description: '자투리 천을 이어 조각보를 짓고, 전통 매듭으로 마감하는 클래스이다.',
    price: 55000,
    durationMinutes: 120,
    capacity: 10,
    remainingSeats: 6,
  },
  {
    id: 'woodwork-small',
    name: '목공 소품',
    description: '대패와 끌을 써서 작은 도마나 수저받침을 깎아 만드는 클래스이다.',
    price: 70000,
    durationMinutes: 150,
    capacity: 6,
    remainingSeats: 2,
  },
]
