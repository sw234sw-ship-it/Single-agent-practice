# skills.md

## Document-First Policy (우선순위 규칙)
- `Plan.md`가 이 프로젝트의 최우선 기준이다.
- `skills.md`는 구현 규칙/스타일 가이드 역할을 하며, `Plan.md`와 충돌하면 `Plan.md`를 따른다.
- 새로운 요구가 들어오면 UI 구현보다 먼저 `Plan.md` 업데이트 + 승인 과정을 거친다.

## Required Skills
본 에이전트는 아래 3개 스킬을 사용한다.

- [$vercel-react-best-practices](~/.agents/skills/vercel-react-best-practices/SKILL.md)
- [$web-design-guidelines](~/.agents/skills/web-design-guidelines/SKILL.md)
- [$frontend-design](~/.agents/skills/frontend-design/SKILL.md)

## Skill Usage Policy

1. 구조 및 코드 품질 구현 단계에서는 `$vercel-react-best-practices`를 따른다.
   - 컴포넌트 구조
   - 상태 관리
   - 폴더 구조
   - React 패턴

2. UI 시각적 표현 및 감성 설계는 `$frontend-design`을 따른다.
   - 레이아웃 구성
   - 히어로 구조
   - 타이포그래피
   - 간격/여백
   - 인터랙션 방향

3. 최종 점검 단계에서 `$web-design-guidelines`로 검수한다.
   - 접근성
   - 일관성
   - UX 흐름
   - 시각적 위계

## Design Direction (Groove-style 기반)

이 웹사이트는 다음 스타일을 따른다.

### 1. Layout
- Full-width 레이아웃
- 중앙 정렬 기반 콘텐츠
- 섹션 간 충분한 vertical spacing (최소 120px 이상)
- 카드 남용 금지

### 2. Typography
- 메인 타이틀은 48px~72px
- 볼드체 사용
- 줄 길이는 60~75 characters 유지
- 문장은 짧고 강하게 작성

### 3. Color System
- 기본은 화이트/라이트 배경
- 블랙 텍스트
- 포인트 컬러 1개만 사용
- 그라데이션 남용 금지

### 4. Interaction
- 부드러운 스크롤 애니메이션
- 버튼 hover는 subtle한 변화
- 과도한 모션 금지

### 5. Information Hierarchy
- 한 화면에는 하나의 메시지만 강조
- 동시 강조 요소 2개 이상 금지
- 버튼은 섹션당 최대 1~2개

## UI Quality Checklist

구현 후 반드시 아래를 점검한다:

- 첫 화면에서 메시지가 3초 안에 이해되는가?
- 텍스트가 과도하게 많지 않은가?
- 시각적 무게 중심이 한 곳에 있는가?
- 버튼이 3개 이상 동시에 노출되지 않았는가?
- 여백이 충분한가?
