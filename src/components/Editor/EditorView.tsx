"use client";

import { useRef } from "react";
import { CanvasHost, type CanvasHostHandle } from "./CanvasHost";
import { useStore } from "@/store/useStore";

function loadDemo() {
  const { setNodes, setWalls, setFurniture } = useStore.getState();
  setNodes(() => [
    { id: "n1", x: 120, y: 120 },
    { id: "n2", x: 520, y: 120 },
    { id: "n3", x: 520, y: 420 },
    { id: "n4", x: 120, y: 420 },
  ]);
  setWalls(() => [
    { id: "w1", startNodeId: "n1", endNodeId: "n2", thickness: 8 },
    { id: "w2", startNodeId: "n2", endNodeId: "n3", thickness: 8 },
    { id: "w3", startNodeId: "n3", endNodeId: "n4", thickness: 8 },
    { id: "w4", startNodeId: "n4", endNodeId: "n1", thickness: 8 },
  ]);
  setFurniture(() => [
    {
      id: "f1",
      name: "데모",
      x: 280,
      y: 200,
      rotation: 0,
      width: 120,
      depth: 60,
      height: 70,
    },
  ]);
}

export default function EditorView() {
  const canvasRef = useRef<CanvasHostHandle | null>(null);
  const reset = useStore((s) => s.reset);

  const downloadPlanPng = () => {
    const url = canvasRef.current?.toPlanDataURL({ mimeType: "image/png" });
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "plan.png";
    a.click();
  };

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-100">
          Interactive Interior Planner
        </h1>
        <p className="text-sm text-zinc-400">
          그리드·가이드·툴 레이어는 캔버스에만 보이고, Plan만 PNG로
          내보내집니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
          onClick={loadDemo}
        >
          데모 도면 넣기
        </button>
        <button
          type="button"
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
          onClick={() => {
            reset();
          }}
        >
          비우기
        </button>
        <button
          type="button"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500"
          onClick={downloadPlanPng}
        >
          Plan을 PNG로 저장
        </button>
      </div>
      <CanvasHost ref={canvasRef} />
    </main>
  );
}
