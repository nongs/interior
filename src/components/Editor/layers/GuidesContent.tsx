"use client";

import { Group, Line, Text } from "react-konva";

type Props = {
  width: number;
  height: number;
  /** UI에서 가이드 표시 on/off (내보내기 제외는 레이어 분리로 이미 달성) */
  visible?: boolean;
};

/**
 * 스냅 보조선, 거리 표시 등 — Plan과 분리해 두면 toDataURL 대상에서 제외됨
 */
export function GuidesContent({ width, height, visible = true }: Props) {
  if (!visible) return null;

  return (
    <Group name="guides-root" listening={false}>
      <Line
        name="center-guide-h"
        points={[0, height / 2, width, height / 2]}
        stroke="rgba(59, 130, 246, 0.25)"
        strokeWidth={1}
        dash={[6, 6]}
      />
      <Line
        name="center-guide-v"
        points={[width / 2, 0, width / 2, height]}
        stroke="rgba(59, 130, 246, 0.25)"
        strokeWidth={1}
        dash={[6, 6]}
      />
      <Text
        x={8}
        y={8}
        text="가이드(내보내기 제외)"
        fontSize={12}
        fill="rgba(59, 130, 246, 0.6)"
        listening={false}
      />
    </Group>
  );
}
