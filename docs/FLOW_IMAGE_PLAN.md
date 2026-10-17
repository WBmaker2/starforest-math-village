# 별숲 수학마을 Flow 이미지 생성 계획 (ego-lite + Google Flow)

ego-lite 브라우저에서 Google Flow로 직접 생성해 `assets/img/flow/`에 넣을 시트 5종 계획입니다.
기존 파이프라인(`scripts/chroma_parts.py`)과 같은 마젠타(#FF00FF) 크로마키 규칙을 따릅니다.

## 공통 아트 디렉션 (모든 시트에 붙이기)

```
Cute cozy 2D storybook game asset sheet, warm pastel colors, soft clean brown outlines,
children's educational village RPG style, flat front view, isolated on a solid pure
magenta background (#FF00FF), evenly spaced grid, no text, no watermarks,
no drop shadows touching the edges, keep the same style as Star Forest Math Village
```

## 시트 목록

### 시트 1. pets-sheet.jpg (3x2)
- 내용: 신비한 별빛 알 / 새싹 정령 / 아기 별여우 / 지혜 부엉이 / 꼬마 수호룡 / 전설의 별빛 수호룡
- 저장: `assets/img/flow/pets-sheet.jpg`
- 분할: `python3 scripts/chroma_parts.py assets/img/flow/pets-sheet.jpg 3 2 pet-egg,pet-sprout,pet-fox,pet-owl,pet-dragon,pet-star assets/img/flow/parts`
- 프롬프트 추가: `six baby monster pets in a 3 by 2 grid, 1 starry egg, 1 leaf sprout spirit, 1 baby star fox, 1 wise owl, 1 tiny guardian dragon, 1 legendary starlight dragon`

### 시트 2. bosses-sheet.jpg (2x2)
- 내용: 태엽 연산 골렘 / 크리스탈 도형 기사 / 황금 저울 연금술사 / 별자리 그래프 마법사
- 저장: `assets/img/flow/bosses-sheet.jpg`
- 분할: `python3 scripts/chroma_parts.py assets/img/flow/bosses-sheet.jpg 2 2 boss-calc,boss-shape,boss-measure,boss-data assets/img/flow/parts`
- 프롬프트 추가: `four friendly cartoon math boss monsters in a 2 by 2 grid, golem calculator, crystal geometry knight, golden scale alchemist, constellation graph wizard`

### 시트 3. chests-badges-sheet.jpg (3x2)
- 내용: 닫힌 보물상자 / 열린 황금 보물상자 / 콤보 번개 훈장 / 수호자 트로피 / 연속 출석 불꽃 배지 / 별숲 대마법사 왕관 배지
- 저장: `assets/img/flow/chests-badges-sheet.jpg`
- 분할: `python3 scripts/chroma_parts.py assets/img/flow/chests-badges-sheet.jpg 3 2 ui-chest-closed,ui-chest-open,badge-combo,badge-boss,badge-streak,badge-master assets/img/flow/parts`
- 프롬프트 추가: `game UI icons in a 3 by 2 grid, closed treasure chest, open golden treasure chest, lightning combo medal, trophy, flame streak badge, crown badge`

### 시트 4. sets-wizard-sheet.jpg (3x2)
- 내용: 별마법사 모자 / 별마법사 로브 / 마법 외알안경 / 우주 헬멧 / 우주복 / 요정 날개
- 저장: `assets/img/flow/sets-wizard-sheet.jpg`
- 분할: `python3 scripts/chroma_parts.py assets/img/flow/sets-wizard-sheet.jpg 3 2 set-wiz-hat,set-wiz-robe,glass-wizard,set-astro-helm,set-astro-suit,set-fairy-wings assets/img/flow/parts`
- 프롬프트 추가: `six kids avatar costume parts in a 3 by 2 grid, star wizard hat, star wizard robe, magic monocle, astronaut helmet, astronaut suit, fairy wings, front view clothing items only`
- 참고: 기존 8레이어 아바타(`g3-avatar.js` HAT_STYLE/TOP_STYLE)와 맞추기 위해 정면·흰 배경 없는 단품 형태로 생성

### 시트 5. rare-crops-sheet.jpg (2x2)
- 내용: 별빛 딸기 / 무지개 수박 / 황금 사과 / 지혜의 별사탕
- 저장: `assets/img/flow/rare-crops-sheet.jpg`
- 분할: `python3 scripts/chroma_parts.py assets/img/flow/rare-crops-sheet.jpg 2 2 crop-starberry,crop-rainbowmelon,crop-goldapple,item-starcandy assets/img/flow/parts`
- 프롬프트 추가: `four shiny fantasy crops and one star candy in a 2 by 2 grid, starlight strawberry, rainbow watermelon, golden apple, star candy`

## 진행 상태 (2026-10-17 완료)

- 방식: 5종 한 TaskSpace 세션에서 생성 (한 번에 진행) — 완료
- 순서대로 생성·분할: rare-crops(4종) → chests-badges(6종) → pets(6종) → bosses(4종, 1회 재생성) → sets-wizard(6종, 1회 재생성)
- 총 26종 PNG가 `assets/img/flow/parts/`에 들어갔고 코드의 이모지 폴백이 자동으로 꺼짐 (코드 수정 불필요)
- QC: 시트 5종 실물 확인, 셀 경계 침범 전수 검사 26종 모두 통과, 흰 배경 합성 확인, 전설 작물·보물상자 샘플 HTTP 200 확인
- 배운 점: 2K 업스케일 배경은 순수 마젠타가 아니어도 기존 크로마키 임계값으로 제거됨. 큰 캐릭터는 셀에 닿아 잘리므로 "작게·넓은 여백" 문구를 프롬프트에 넣을 것. 분할 후 알파 1px 침식으로 테두리 핑크빛 제거

## ego-lite 작업 순서

1. TaskSpace 1개 생성·유지, Page `p1` 재사용 (`task.finish({ keep: [] })`로 종료)
2. Google Flow 열기 (로그인 세션 유지), 스냅샷으로 생성 UI 확인
3. 위 공통 아트 디렉션 + 시트별 추가 문구를 붙여 5종 생성
4. 각 시트를 `assets/img/flow/<시트명>.jpg`로 다운로드
5. 위 분할 명령 실행 (마젠타 배경 자동 투명화)
6. QC: 셀 침범·마젠타 잔여·투명 크롭·아바타 파츠 정면 구도 확인 (실패 시 해당 시트만 재생성)
7. 로컬 서버(`python3 -m http.server 8000`)에서 산책 지도·대화창·옷장·텃밭 실화면 확인
8. 이미지가 오기 전까지는 코드의 이모지/SVG 대체 표시로 정상 동작 (점진적 교체)

## 파일명 규칙

- 시트: `assets/img/flow/<이름>-sheet.jpg`
- 파츠: `assets/img/flow/parts/<이름>.png` (투명 배경)
- 코드 참조: `../assets/img/flow/parts/<이름>.png`, 없으면 이모지로 대체 표시
