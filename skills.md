# skills.md

## Required Skills
본 에이전트는 아래 2개 스킬을 사용한다.
- [$web-design-guidelines](/Users/sunwoo/.agents/skills/web-design-guidelines/SKILL.md)
- [$frontend-design](/Users/sunwoo/.agents/skills/frontend-design/SKILL.md)

## Skill Usage Policy
1. 기획 완료 후 UI 구현 단계에서 `$frontend-design`을 기본 제작 프레임으로 사용한다.
2. 구현 결과 점검 단계에서 `$web-design-guidelines`를 적용해 UI/UX/접근성/일관성을 리뷰한다.

## Design Direction
- 웹사이트는 **미니멀하고 심플한 방향**을 기본 원칙으로 한다.
- 정보 계층은 얕고 명확해야 하며, 첫 화면은 핵심 메시지 중심으로 구성한다.
- 웹사이트의 데이터 입력은 반드시 **실시간 저장(auto-save)** 방식이어야 한다.
- 별도의 저장 버튼 없이, 사용자가 입력하는 즉시 상태와 화면이 업데이트되어야 한다.

## Function Handling Rule
- 사용자가 요청하는 부가 기능(Function)은 메인 페이지 내부에서 **별도 창(overlay/modal/new panel)** 형태로 열어 제공한다.
- 목적은 메인 페이지를 최대한 심플하고 미니멀하게 유지하는 것이다.
- 메인 레이아웃은 핵심 컨텐츠 중심, 부가 기능은 분리 노출을 원칙으로 한다.
- 새로운 창은 반드시 메인 페이지에서 사용자가 원할 때만 열려야 한다.
- 예: 사용자가 `학습 시작` 같은 명시적 트리거를 눌렀을 때만 새로운 창을 연다.
- 열린 창은 사용자가 `x` 버튼으로 언제든 닫을 수 있어야 한다.
