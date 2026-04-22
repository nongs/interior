"use client";

import { Group } from "react-konva";

type Props = {
  width: number;
  height: number;
};

/**
 * 선택, 변형 핸들, 임시 하이라이트 등 — 내보내기에서 제외
 */
export function ToolsContent(_props: Props) {
  return <Group name="tools-root" />;
}
