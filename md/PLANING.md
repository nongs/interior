1. 프로젝트 개요
명칭: Interactive Interior Planner (가칭)

목적: 사용자가 직접 방 치수를 입력하여 구조를 만들고, 커스텀 가구를 배치하여 이사 시뮬레이션을 진행하는 웹 도구.

핵심 가치: 정밀 치수 제어, 데이터 영속성(저장), 이미지 내보내기.

2. 핵심 기능 명세
벽체 시스템: 점(Node)과 선(Wall) 기반 좌표 시스템. 치수 직접 입력 수정 가능.

가구 커스텀: 가구의 W/D/H 치수 조절 및 회전, 비율 고정 기능.

데이터 저장: IndexedDB를 활용한 자동 저장 및 .json 파일 Export/Import.

이미지 내보내기: 현재 도면 영역을 JPG/PNG 파일로 렌더링하여 다운로드. (Konva의 toDataURL 활용)

가이드 시스템: 그리드 스냅 및 벽면과의 실시간 거리 표시.

3. 기술 스택
Framework: Next.js (App Router), TypeScript

Canvas Library: react-konva, konva

State Management: Zustand (with Middleware for Persistence)

Styling: Tailwind CSS

4. 파일 구조 제안
Plaintext
/src
  /store - useStore.ts (도면 데이터 및 Undo/Redo)
  /hooks - useExport.ts (이미지 및 JSON 내보내기 로직)
  /components
    /Editor - CanvasHost.tsx, Grid.tsx
    /Objects - Wall.tsx, Furniture.tsx, Room.tsx
    /UI - Sidebar.tsx, Inspector.tsx, Toolbar.tsx
  /utils - geometry.ts (거리/각도 계산), storage.ts (IndexedDB 관리)