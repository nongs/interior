# Interactive Interior Planner — 진행 상황

`md/PLANING.md`에 따른 **목표·스택**을 기준으로, 지금까지의 작업을 **시간 순(진행 흐름)**으로 정리한 문서입니다. (문서 갱신일: 2026-04-22 기준)

---

## 1. 기획·구조 합의

1. **프로젝트 개요**  
   - 방 치수·벽·가구를 직접 다루는 인테리어 도면(평면도) 도구, 데이터 저장·이미지 내보내기 등을 전제로 함.  
2. **기획 문서**  
   - `md/PLANING.md`: 목적, 핵심 기능(벽/가구, 데이터 저장, 이미지 내보내기, 가이드), 기술 스택, 폴더 구조 제안.
3. **레이어 설계(논의)**  
   - Konva `Stage` 위에서 **내보내기에 넣을 도면(Plan)** 과 **화면에만 보이는 UI(그리드·가이드·툴)** 를 **서로 다른 `Layer`**로 나누는 방향으로 합의.  
   - 내보내기는 `Plan` 레이어에 대해서만 `toDataURL` 등을 호출해 그리드/가이드는 제외.

---

## 2. 상태 관리: Zustand 스토어

1. **파일**  
   - `src/store/useStore.ts`  
2. **데이터 타입**  
   - `Node`: 벽이 만나는 점 (`id`, `x`, `y`)  
   - `Wall`: `startNodeId` / `endNodeId`로 노드 연결, `thickness`  
   - `Furniture`: 배치 `x`·`y`·`rotation` 및 **사용자가 수정하는 `width`·`depth`·`height`**(필수), 선택 `name`·`lockAspectRatio`  
3. **기능**  
   - `nodes` / `walls` / `furniture` 배열 CRUD, `set*`·`add*`·`update*`·`remove*`, `reset`  
4. **영속성**  
   - `zustand/middleware`의 **persist** + `localStorage` (키: `interior-planner`)  
   - `partialize`로 함수는 제외·데이터만 직렬화  

**미구현(기획 대비):** `PLANING.md`에 적힌 **IndexedDB·JSON Import/Export**, **Undo/Redo** 스토어는 아직 별도로 두지 않음.

---

## 3. Next.js 앱·빌드

1. **스택**  
   - Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, react-konva, Konva, Zustand  
2. **구성**  
   - `src/app/layout.tsx` — 전역 스타일·메타  
   - `src/app/page.tsx` — `EditorClient`만 렌더  
   - `src/app/EditorClient.tsx` — **클라이언트 전용**에서 `next/dynamic` + `ssr: false`로 캔버스 로딩 (Konva는 브라우저 전제)  
3. **Konva + Next**  
   - `next.config.ts`에 webpack `resolve.fallback: { canvas: false }` — Node 쪽 `canvas` 모듈 요구를 막기 위함.  
4. **스크립트**  
   - `dev` / `build` / `start` / `typecheck` (`package.json`)  

**참고:** `persist` 사용 시 **SSR과 초기·재수화** 타이밍이 어긋날 수 있어, 캔버스·도구 UI는 이후 **hydration** 정책을 정해도 됨(현재는 Konva를 클라이언트에만 둔 상태).

---

## 4. 에디터 캔버스: 레이어 분리·렌더

1. **레이어 순서(아래 → 위)** — `src/components/Editor/CanvasHost.tsx`  
   - `background` — 배경 사각형 (`BackgroundContent`)  
   - `plan` — 벽·가구 (`PlanContent`), **내보내기 ref가 가리키는 레이어**  
   - `grid` — 격자 (`GridContent`), 선택 `showGrid`  
   - `guides` — 예시 가이드(점선·문구) (`GuidesContent`), `showGuides`  
   - `tools` — 이후 선택·핸들용 빈 `Group` (`ToolsContent`)  

2. **기본 치수**  
   - `src/components/Editor/editorLayout.ts`: 스테이지 기본 너비·높이, 그리드 셀 크기 상수.  

3. **Plan 콘텐츠**  
   - `PlanContent`가 스토어의 `nodes` / `walls` / `furniture`를 읽어 `Line`·`Rect(회전 Group)`로 표시.  
   - 가구 `rotation`은 **react-konva(도) 단위**로 사용하도록 주석.  

4. **내보내기**  
   - `src/hooks/usePlanExport.ts`: `planLayerToDataURL`, `usePlanLayerExport`  
   - `CanvasHost`는 `forwardRef` + `useImperativeHandle`로 `toPlanDataURL` / `getPlanLayer` 노출.  
   - **주의:** 배경(회색)은 `background` 레이어이므로 **`toPlanDataURL`에 포함되지 않음** — 배경까지 한 장이면 `Stage` 전체 캡처·합성 등이 추가로 필요(코드 주석에 동일 설명).  

5. **페이지·데모**  
   - `src/components/Editor/EditorView.tsx` — “데모 도면 넣기”, “비우기”, “Plan을 PNG로 저장” 버튼.  

---

## 5. 주요 소스 경로(참고)

```
src/
  app/
    layout.tsx
    page.tsx
    EditorClient.tsx
    globals.css
  store/
    useStore.ts
  hooks/
    usePlanExport.ts
  components/Editor/
    CanvasHost.tsx
    CanvasHost.types.ts
    editorLayout.ts
    EditorView.tsx
    layers/
      BackgroundContent.tsx
      PlanContent.tsx
      GridContent.tsx
      GuidesContent.tsx
      ToolsContent.tsx
md/
  PLANING.md
  PROGRESS.md   ← 이 문서
```

이 문서는 이후 스프린트·PR 설명용으로 갱신해도 됩니다.
