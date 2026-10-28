# 별숲 수학마을 전면 개선 구현 계획
> 원칙: localStorage 기반, 가입/설치 없는 원칙 유지. 모든 확장은 기존 마을 구조 안에 자연스럽게 녹인다. 점진적 순차 구현.

작성일: 2026-10-28

## 원칙
- 백엔드 없음, localStorage만 사용
- 설치·가입 불필요
- 기존 세계관/구조/UI 패턴 유지
- 저학년/고학년 트랙 구분 유지
- `btn-pulse`는 한 화면에 한 개만 (다음 단계 버튼)
- `prefers-reduced-motion` 존중
- 한국어 인터페이스 유지

## 전체 순서

### 1단계: 즉시 적용 가능 (기반)
| 순서 | 항목 | 목표 | 파일(예상) | 상태 |
|---|---|---|---|---|
| 1-1 | 키보드 완전 지원 | 문제 풀이/지도/메뉴에서 키보드만으로 조작 가능. 포커스 가시성, Tab 순서, Enter/Space, 숫자키패드 호환 | `assets/js/g3-pad.js`, `assets/js/low-app.js`, `assets/js/g3-ui.js`, `assets/css/*.css` | 대기 |
| 1-2 | 오프라인 완전성 강화 | SW 캐싱 범위 확장, 오프라인 상태 UI, 실패 시 안내, 자산 누락 방지 | `sw.js`, `assets/js/pwa.js`, `index.html`, `manifest.json` | 대기 |
| 1-3 | 데이터 내보내기/가져오기 | localStorage 데이터를 JSON으로 내보내기/가져오기 (기기 간 이어하기). 민감정보 없음 확인 | `assets/js/g3-store.js`, `low-app.js` 공용 유틸, UI(선생님 도구함/일지) | 대기 |

### 2단계: 단기 (학습/동기부여)
| 순서 | 항목 | 목표 | 파일(예상) | 상태 |
|---|---|---|---|---|
| 2-1 | 오답 자동 복습 시스템 | 틀린 문제를 모아 '오답 숲'(또는 오답 교실)에서 자동 출제. 틀린 횟수/마지막 오답 시각 기반 우선순위 | `assets/js/g3-store.js`, `assets/js/g3-dialog.js`, `assets/js/g3-understand.js`, `assets/js/low-app.js`, `assets/css/g3.css` | 대기 |
| 2-2 | 학습 리포트 강화 | 기존 리포트 확장 (주간 통계, 취약 개념 자동 제안, 출력 개선) | `assets/js/g3-report.js`, `low-app.js`(저학년), `assets/css/g3.css`, `index.html`(도구함) | 대기 |
| 2-3 | 계절 이벤트 | 계절별 한정 미션/아이템. 날짜 기반 활성화, localStorage로 수령 기록 | `assets/js/g3-quests.js`, `assets/js/g3-store.js`, `assets/js/g3-deco.js`, `assets/css/g3.css` | 대기 |

### 3단계: 중장기 (고도화/교사용)
| 순서 | 항목 | 목표 | 파일(예상) | 상태 |
|---|---|---|---|---|
| 3-1 | 적응형 난이도 고도화 | 정답률/반응/연속정답 기반 세밀 조절. 시각적 피드백 강화. 기존 `g3-tune.js`와 통합 | `assets/js/g3-tune.js`, `assets/js/g3-understand.js`, `assets/js/g3-questions.js`, `assets/js/low-app.js` | 대기 |
| 3-2 | 교사용 대시보드 | 반별 진도 요약(어떤 단원/개념에서 어려워하는지). 개인정보 최소화, localStorage 내 데이터만 집계, 인쇄/공유 중심 | `assets/js/g3-report.js` 확장, `assets/js/g3-understand.js`, `index.html`(교실 도구함), `assets/css/g3.css` | 대기 |
| 3-3 | 스토리 퀘스트 | NPC 활용 시나리오 퀘스트. 단원 학습과 자연스럽게 연결, 보상은 기존 성장 순환과 일관 | `assets/js/g3-quests.js`, `assets/js/g3-walk.js`, `assets/js/g3-dialog.js`, `assets/js/g3-store.js`, `assets/css/g3.css` | 대기 |

### 추가 고려
| 순서 | 항목 | 목표 | 파일(예상) | 상태 |
|---|---|---|---|---|
| 4-1 | 수학 일기/서술형 | 간단한 설명 쓰기/그림으로 설명하기. localStorage에 저장 | `assets/js/g3-journal.js` 확장, `assets/css/g3.css` | 대기 |
| 4-2 | 실생활 연계 문제 강화 | 기존 문항에 실생활 문맥 보강, 새 소품/장소와 연계 | `assets/js/*-data.js`, `assets/js/*-questions.js` | 대기 |
| 4-3 | 맞춤 학습 경로 | 진단→취약영역 추천. 기존 이해도 시스템과 통합 | `assets/js/g3-understand.js`, `assets/js/g3-map.js`, `assets/js/g3-dialog.js` | 대기 |

## 구현 규칙
- 각 단계 완료 후 `docs/UPDATELOG.md`에 기록
- 변경 파일은 기존 네이밍/패턴 따름
- 새 파일은 필요 최소한으로
- 모든 UI 문자열은 한국어
- `btn-pulse` 남용 금지
- localStorage 키는 기존 접두사 패턴 유지

## 검증 체크리스트
- [ ] 오프라인 재방문 동작
- [ ] 기기 변경 없는 상태에서 내보내기/가져오기
- [ ] 키보드만으로 주요 플로우 가능
- [ ] prefers-reduced-motion 동작
- [ ] 모바일(360~390) 가로스크롤 없음
- [ ] 콘솔 에러 없음
