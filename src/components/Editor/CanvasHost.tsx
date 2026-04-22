"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Layer, Stage } from "react-konva";
import type { Layer as KonvaLayer } from "konva/lib/Layer";
import { planLayerToDataURL } from "@/hooks/usePlanExport";
import { BackgroundContent } from "./layers/BackgroundContent";
import { PlanContent } from "./layers/PlanContent";
import { GridContent } from "./layers/GridContent";
import { GuidesContent } from "./layers/GuidesContent";
import { ToolsContent } from "./layers/ToolsContent";
import type { CanvasHostHandle } from "./CanvasHost.types";
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_STAGE_HEIGHT,
  DEFAULT_STAGE_WIDTH,
} from "./editorLayout";

export type { CanvasHostHandle } from "./CanvasHost.types";

type CanvasHostProps = {
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  showGuides?: boolean;
};

/**
 * Layer 순서(아래 → 위):
 * 1) background — 도면 배경
 * 2) plan — 벽/가구 (내보내기 기본 대상)
 * 3) grid / guides / tools — 편집 UI (내보내기에서 제외)
 *
 * toPlanDataURL()은 2)만 캡처합니다. 배경을 포함하려면 별도 합성(Stage 전체 캡처
 * 또는 background+plan 합쳐 그리기)이 필요합니다.
 */
export const CanvasHost = forwardRef<CanvasHostHandle, CanvasHostProps>(
  function CanvasHost(
    {
      width = DEFAULT_STAGE_WIDTH,
      height = DEFAULT_STAGE_HEIGHT,
      gridSize = DEFAULT_GRID_SIZE,
      showGrid = true,
      showGuides = true,
    },
    ref,
  ) {
    const planLayerRef = useRef<KonvaLayer>(null);

    useImperativeHandle(
      ref,
      () => ({
        toPlanDataURL: (options) => planLayerToDataURL(planLayerRef.current, options),
        getPlanLayer: () => planLayerRef.current,
      }),
      [],
    );

    return (
      <Stage width={width} height={height} className="rounded-lg shadow-lg">
        <Layer name="background" listening={false}>
          <BackgroundContent width={width} height={height} />
        </Layer>
        <Layer ref={planLayerRef} name="plan">
          <PlanContent width={width} height={height} />
        </Layer>
        {showGrid && (
          <Layer name="grid" listening={false}>
            <GridContent width={width} height={height} cell={gridSize} />
          </Layer>
        )}
        <Layer name="guides" listening={false}>
          <GuidesContent
            width={width}
            height={height}
            visible={showGuides}
          />
        </Layer>
        <Layer name="tools" listening={false}>
          <ToolsContent width={width} height={height} />
        </Layer>
      </Stage>
    );
  },
);
