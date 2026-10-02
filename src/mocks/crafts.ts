import type { Craft } from '@/types'

// 모든 사진은 Wikimedia Commons의 CC0(퍼블릭 도메인 헌정) 파일이다. 출처는 Commons API 응답 그대로 적었다.
export const crafts: Craft[] = [
  {
    id: 'moon-jar',
    name: '백자 달항아리',
    category: '도자기',
    description: '둥근 보름달을 닮은 유백색 항아리이다. 장식 없이 곡선과 여백만으로 완성한 단정한 한 점이다.',
    price: 480000,
    image: {
      src: '/images/crafts/moon-jar.jpg',
      alt: '유백색 유약이 고르게 입혀진, 둥글고 풍만한 백자 달항아리의 정면',
      credit: {
        author: 'Hiart',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Large_moon_jar,_18th_century,_Honolulu_Museum_of_Art_3494.1.JPG',
      },
    },
  },
  {
    id: 'celadon-openwork-jar',
    name: '청자 투각 국화문 항아리',
    category: '도자기',
    description: '맑은 비색 몸체에 국화 무늬를 겹겹이 뚫어 새겼다. 빛이 통과하면 무늬가 그림자로 드러난다.',
    price: 620000,
    image: {
      src: '/images/crafts/celadon-jar.jpg',
      alt: '국화 무늬를 촘촘히 투각한 연한 청록빛 청자 항아리',
      credit: {
        author: 'Kim Se-yong',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Double-openwork_celadon_moon_jar_with_chrysanthemums.jpg',
      },
    },
  },
  {
    id: 'najeon-grape-box',
    name: '나전 포도문 함',
    category: '나전칠기',
    description: '검은 옻칠 위에 자개로 포도 넝쿨을 수놓은 납작한 함이다. 서류나 소품을 단정하게 보관한다.',
    price: 540000,
    image: {
      src: '/images/crafts/najeon-box.jpg',
      alt: '검갈색 옻칠 바탕에 자개로 포도 넝쿨 무늬를 박아 넣은 납작한 직사각형 함',
      credit: {
        author: 'Daderot',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Box,_Korea,_Joseon_dynasty,_1700-1800_AD,_lacquered_wood_with_mother-of-pearl_inlays_-_Asian_Art_Museum_of_San_Francisco_-_DSC01435.JPG',
      },
    },
  },
  {
    id: 'najeon-peony-chest',
    name: '나전 모란문 함',
    category: '나전칠기',
    description: '자개 모란과 대모(거북 등껍데기) 무늬 원형 장식을 두른 뚜껑 함이다. 선물 상자로도 어울린다.',
    price: 450000,
    image: {
      src: '/images/crafts/najeon-covered-box.jpg',
      alt: '자개 모란 넝쿨과 둥근 장식 무늬가 빼곡한 검은 뚜껑 달린 칠기 함',
      credit: {
        author: 'Hiart',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Korean_covered_lacquer_box,_mid_to_late_18th_century,_lacquer,_mother_of_pearl,_tortoise_shell_and_silk,_HAA.JPG',
      },
    },
  },
  {
    id: 'bojagi-linen',
    name: '모시 조각보',
    category: '보자기',
    description: '결이 고운 천 조각을 손바느질로 이어 붙인 보자기이다. 분홍 조각이 리듬을 만든다.',
    price: 85000,
    image: {
      src: '/images/crafts/bojagi-wrapping.jpg',
      alt: '아이보리색 천 조각 사이에 분홍과 자주색 직사각형 조각을 이어 붙인 정사각형 보자기',
      credit: {
        author: 'Hiart',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Wrapping_cloth_from_Korea,_Honolulu_Museum_of_Art,_13784.1.JPG',
      },
    },
  },
  {
    id: 'bojagi-silk',
    name: '오방색 명주 조각보',
    category: '보자기',
    description: '붉은색·노란색·청록색 비단 조각을 기하학적으로 이은 큰 보자기이다. 벽에 걸어 장식하기도 한다.',
    price: 120000,
    image: {
      src: '/images/crafts/bojagi-patchwork.jpg',
      alt: '붉은색, 분홍색, 청록색, 노란색 비단 조각을 줄무늬로 이어 붙인 정사각형 조각보',
      credit: {
        author: 'Unknown author',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:%EC%A1%B0%EA%B0%81%EB%B3%B4-Patchwork_wrapping_cloth_(jogakbo)_MET_DP148409.jpg',
      },
    },
  },
  {
    id: 'wood-letter-rack',
    name: '투각 목조 서간꽂이',
    category: '목공예',
    description: '박쥐와 꽃 무늬를 투각한 벽걸이형 목제 편지꽂이이다. 붉은 갈색 칠이 깊은 결을 살린다.',
    price: 160000,
    image: {
      src: '/images/crafts/wood-letter-box.jpg',
      alt: '박쥐와 꽃, 엽전 무늬를 뚫어 새긴 붉은 갈색 나무 벽걸이 편지꽂이',
      credit: {
        author: 'Hiart',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Korean_letter_box,_late_Choson_dynasty,_wood,_Honolulu_Academy_of_Arts.JPG',
      },
    },
  },
  {
    id: 'wood-stacked-chest',
    name: '이층 목제 의걸이장',
    category: '목공예',
    description: '두 단을 포개 쓰는 나무 수납장이다. 나비 모양 장식 쇠와 상감 무늬가 문을 장식한다.',
    price: 890000,
    image: {
      src: '/images/crafts/wood-chest.jpg',
      alt: '나비 모양 금속 장식과 인물·수목 무늬 상감이 있는 검은 이층 목제 수납장',
      credit: {
        author: 'Wmpearl',
        license: 'CC0',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Korean_stacked_clothing_chest,_19th_century,_wood_with_lacquer,_Dayton_Art_Institute.JPG',
      },
    },
  },
]
