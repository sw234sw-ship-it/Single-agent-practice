# Single-agent-practice

미니멀/심플 UI 기반 가계부 웹사이트입니다.

## 핵심 기능
- 초기 자본, 월 고정 수입 설정
- 월별 추가 수입/지출 입력 및 삭제
- 월별 현금흐름 테이블 자동 계산
- 잉여 자본 기반 월 성장률 시각화(분석 모달)
- 데이터 로컬 저장(`localStorage`)

## 성장률 계산식
- 월 성장률 = `(해당 월 잉여 자본 / 해당 월 시작 자본) × 100`
- 예시: 시작 자본 100만원, 월 잉여 10만원이면 `+10%`

## 실행 방법
1. 브라우저에서 `/Users/sunwoo/Documents/AI공부/Single-agent-practice/index.html` 열기
2. 또는 정적 서버 실행:
   - `cd /Users/sunwoo/Documents/AI공부/Single-agent-practice`
   - `python3 -m http.server 5500`
   - `http://localhost:5500` 접속
