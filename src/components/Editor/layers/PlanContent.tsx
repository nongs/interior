"use client";

import { useMemo } from "react";
import { Group, Line, Rect } from "react-konva";
import { useStore } from "@/store/useStore";

type Props = {
  width: number;
  height: number;
};

/**
 * export 대상: 벽, 가구.
 * `rotation`은 react-konva(도) 기준으로 사용합니다.
 */
export function PlanContent({ width, height }: Props) {
  void width;
  void height;
  const nodes = useStore((s) => s.nodes);
  const walls = useStore((s) => s.walls);
  const furniture = useStore((s) => s.furniture);

  const nodeById = useMemo(() => {
    const m = new Map<string, (typeof nodes)[0]>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  return (
    <Group name="plan-root">
      {walls.map((w) => {
        const a = nodeById.get(w.startNodeId);
        const b = nodeById.get(w.endNodeId);
        if (!a || !b) return null;
        return (
          <Line
            key={w.id}
            name={`wall-${w.id}`}
            points={[a.x, a.y, b.x, b.y]}
            stroke="#27272a"
            strokeWidth={w.thickness}
            lineCap="round"
            lineJoin="round"
          />
        );
      })}

      {furniture.map((f) => (
        <Group
          key={f.id}
          name={`furniture-${f.id}`}
          x={f.x + f.width / 2}
          y={f.y + f.depth / 2}
          rotation={f.rotation}
        >
          <Rect
            x={-f.width / 2}
            y={-f.depth / 2}
            width={f.width}
            height={f.depth}
            fill="#a1a1aa"
            stroke="#3f3f46"
            strokeWidth={1}
            cornerRadius={2}
          />
        </Group>
      ))}
    </Group>
  );
}
