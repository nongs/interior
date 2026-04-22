"use client";

import { Rect } from "react-konva";

type Props = {
  width: number;
  height: number;
};

/** 내보내기에 포함해도 되는 캔버스 배경 (도면만 캡처할 땐 Stage 바깥 CSS 배경이 보일 수 있음) */
export function BackgroundContent({ width, height }: Props) {
  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill="#f4f4f5"
    />
  );
}
