(function () {
  var ITEMS = [
    { date: "2026-10-16", title: "마을 지도·집 그림 새 단장", desc: "4·5·6학년 마을 지도를 천문대·과수원·물감 아틀리에 컨셉으로 새로 그리고 집 버튼 위치를 맞췄습니다. 단원 집 그림 18종도 컨셉에 맞게 새로 그렸고, 업데이트 내역 창에 X 닫기 버튼을 달았습니다." },
    { date: "2026-10-16", title: "1·2학년 지도 분리", desc: "1학년 햇살 새싹 정원과 2학년 자리수 텃밭·시계탑 마을 지도를 각각 새로 그려 연결하고 집 버튼 위치를 맞췄습니다." },
    { date: "2026-10-16", title: "전 학년 마을 완성", desc: "새싹숲 1·2학년 분리 12곳·36문항과 4·5·6학년 별숲 3곳·각 72문항을 열었습니다. 아바타·별·씨앗은 공유하고 진도는 학년별로 저장되며 소수점 키패드를 지원합니다." },
    { date: "2026-10-16", title: "전 화면 일러스트 교체·추가", desc: "파스텔 치비 시트 5종(꾸미기 6종·놀이 8종·마을 4종·학습 3종·저학년 집 6종)을 새로 그려 꾸미기·도감·놀이·랜딩 액자에 적용하고 집 그림 잘림을 고쳤습니다." },
    { date: "2026-10-16", title: "조작 교구·저학년 마을·칠판모드·졸업상장 추가", desc: "문제 그림을 직접 눌러 배우는 양방향 수학 교구, 1·2학년 저학년 산책 마을(6개 집·18문항), 전자칠판 발표 모드, 6단원 스탬프 보드와 명예 졸업 상장을 추가했습니다." },
    { date: "2026-10-16", title: "학년 자동입장·구역도크·낮밤조명·친밀도·컬러펜·문장제 추가", desc: "학년 주소 자동 입장, 3학년 구역 집중 도크, 마을 낮·노을·밤 조명, 주민 친밀도 하트, 손글씨 컬러펜·지우개, 6단원 실생활 문장제 차시를 추가했습니다." },
    { date: "2026-10-16", title: "키패드·손글씨·무한연습·건물성장·꽃배합·감별실·주민증인쇄 추가", desc: "온스크린 숫자 키패드와 손글씨 연습장, 6단원 무한 연습 모드, 지도 위 단원 건물 성장 연출, 꽃 배합·모눈 그림 감별 놀이, 명예 주민증 인쇄 기능을 추가했습니다." },
    { date: "2026-10-16", title: "오늘 할 일 길잡이·부엌/장터/강가 놀이·명예 주민증 추가", desc: "지도 왼쪽 위 오늘 할 일 자동 안내, 문제 화면 단계별 힌트 펼치기, 효과음 스위치, 수확물 장터·부엌과 강가 길이·무게 채집 놀이, 8레이어 아바타 명예 주민증과 이어하기 코드를 추가했습니다." },
    { date: "2026-10-16", title: "시각 도해·오답 교실·오늘의 도전 및 마을 꾸미기 시각화", desc: "6개 단원 문제마다 맞춤 그림 도해가 함께 나오고, 오답 노트 교실과 오늘의 도전, 텃밭 작물 그림·성장바, 마을 지도 위 꾸미기 소품 배치, 주민 부탁 8종·수집 카드 10종을 추가했습니다." },
    { date: "2026-10-16", title: "인게임 아바타 등장 및 6개 전 단원 개방", desc: "옷장에서 꾸민 8레이어 아바타(신발·표정·안경·장식·황금세트 포함)가 마을 산책 화면과 단원 집 대화창에 그대로 등장하며, 3학년 2학기 6개 단원 집 문제를 모두 풀 수 있습니다." },
    { date: "2026-10-16", title: "아바타 코디 정밀 합성", desc: "머리·표정·상의·하의·신발·모자·장식 28종 파츠의 투명도와 착용 위치를 정밀 보정해 어떤 조합도 자연스럽게 어우러집니다." },
    { date: "2026-10-15", title: "2D 마을 전환", desc: "통통 튀는 2D 산책, 주민 부탁 5종, 수집 카드 7종을 묶었습니다. 무거운 3D 대신 가볍게 열립니다." },
    { date: "2026-10-15", title: "재미 요소 추가", desc: "씨앗 텃밭, 집 꾸미기, 일지와 지도, 기록을 별숲 마을 생활 요소로 만들었습니다." },
    { date: "2026-10-15", title: "3학년 마을 추가", desc: "주민 만들기, 마을 산책, 곱셈 방앗간 풀이를 새로 만들었습니다." }
  ];
  function ensure() {
    var d = document.getElementById("historyDialog");
    if (d) return d;
    d = document.createElement("dialog");
    d.id = "historyDialog";
    d.innerHTML = "<button id='closeHistoryX' class='dlg-x' type='button' aria-label='업데이트 내역 닫기'>✕</button><h3>업데이트 내역</h3><div id='historyList'></div><button id='closeHistory' type='button'>닫기</button>";
    document.body.appendChild(d);
    d.querySelector("#closeHistory").addEventListener("click", function () { d.close(); });
    d.querySelector("#closeHistoryX").addEventListener("click", function () { d.close(); });
    return d;
  }
  function render() {
    var box = document.getElementById("historyList");
    if (!box) return;
    box.innerHTML = "";
    for (var i = 0; i < ITEMS.length; i++) {
      var dv = document.createElement("div");
      var b = document.createElement("b");
      b.textContent = ITEMS[i].date + " · " + ITEMS[i].title;
      var p = document.createElement("p");
      p.textContent = ITEMS[i].desc;
      dv.appendChild(b); dv.appendChild(p);
      box.appendChild(dv);
    }
  }
  var btn = document.getElementById("historyBtn");
  if (btn) btn.addEventListener("click", function () {
    var d = ensure(); render();
    if (d.showModal) d.showModal();
  });
})();
