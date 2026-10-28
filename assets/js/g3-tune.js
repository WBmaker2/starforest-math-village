(function () {
  // 별숲 수학마을 게임 밸런스 조정판.
  // 교실 테스트 후 수치만 여기에서 바꾸면 콤보·보스·보물상자·펫 진화가 함께 바뀝니다.
  // 저학년(low-app.js 별 +5/+10)은 별도 트랙이라 여기 숫자와 무관합니다.
  window.G3TUNE = {
    comboFeverAt: 3,      // 몇 콤보부터 피버 보너스
    comboBonus: 4,        // 피버 시 추가 별
    bossDoubleFrom: 2,    // 보스전에서 이전 콤보가 이 값 이상이면 별 2배
    bossHp: 3,            // 수호자 HP
    bossTotal: 5,          // 대결 문제 수
    bossWinAt: 3,          // 첫 시도 몇 문제 성공하면 승리
    bossStars: 25,         // 승리 보상 별
    bossSeeds: 2,          // 승리 보상 씨앗
    bossExp: 3,            // 승리 보상 펫 경험치
    bossRainbow: 1,        // 승리 보상 무지개 씨앗
    bossConsolation: 5,    // 패배 위로 보상 별 (2026-10-17 교실 테스트 반영)
    streakAt: 3,           // 하루 몇 문제 풀면 출석 도장
    candyEvery: 3,         // 몇 문제마다 별사탕 1개
    feedExp: 2,            // 별사탕 1개당 경험치
    petNeed: [0, 3, 7, 12, 18, 25], // 펫 6단계 진화 필요 EXP
    festMult: 2,           // 별빛 축제 별 배율
    festMins: 10,           // 별빛 축제 지속 시간(분)
    weeklyBoss: 3,         // 주간 미션: 수호자 격파 수
    weeklyPerfect: 3,      // 주간 미션: 실수 없이 끝낸 차시 수
    weeklyStars: 30,       // 주간 미션 완료 보상 별
    weeklySeeds: 3,        // 주간 미션 완료 보상 씨앗
    starTotal: 5,          // 도전왕 문제 수
    starWinAt: 4,          // 도전왕 승리 기준 (첫 시도 성공 수)
    starSecs: 20,          // 도전왕 문제당 제한 시간(초)
    starWinStars: 20,      // 도전왕 승리 보상 별
    adaptUp: 0.8,          // 적응형: 최근 성공률이 이 이상이면 3단계
    adaptDown: 0.4,        // 적응형: 이 미만이면 1단계
    adaptWindow: 10,       // 적응형: 최근 몇 문제로 판단
    chest: [              // 보물상자 확률 (순서대로 누적 경계, 2026-10-17 교실 테스트 반영)
      { upto: 0.30, stars: 20, msg: "별 20개!" },
      { upto: 0.60, seeds: 3, msg: "씨앗 3개!" },
      { upto: 0.75, candies: 2, msg: "별사탕 2개!" },
      { upto: 1.01, rainbow: 1, seeds: 1, msg: "🌈 무지개 씨앗 1개! 텃밭에 심어 보세요!" }
    ],
    // 적응형 난이도 고도화 기본값
    adaptWindow: 12,
    adaptUp: 0.82,
    adaptDown: 0.38,
    streakBonus: true
  };
})();
