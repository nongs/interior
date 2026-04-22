"use client";

import { useMemo } from "react";
import { Group, Line } from "react-konva";

type Props = {
  width: number;
  height: number;
  /** 셀 한 변 길이 (px) */
  cell: number;
  stroke?: string;
  strokeWidth?: number;
};

/** 편집용 그리드 — Plan 레이어에 넣지 말고 Grid 레이어에만 그릴 것 */
export function GridContent({
  width,
  height,
  cell,
  stroke = "rgba(24, 24, 27, 0.12)",
  strokeWidth = 1,
}: Props) {
  const lines = useMemo(() => {
    const v: number[] = [];
    const h: number[] = [];
    for (let x = 0; x <= width; x += cell) v.push(x);
    for (let y = 0; y <= height; y += cell) h.push(y);
    return { v, h };
  }, [width, height, cell]);

  return (
    <Group name="grid-root" listening={false}>
      {lines.v.map((x) => (
        <Line
          key={`gvx-${x}`}
          points={[x, 0, x, height]}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {lines.h.map((y) => (
        <Line
          key={`ghy-${y}`}
          points={[0, y, width, y]}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
    </Group>
  );
}
