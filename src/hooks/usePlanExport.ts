import { useCallback, type RefObject } from "react";
import type { Layer } from "konva/lib/Layer";

export type PlanExportOptions = {
  /** 기본 2 (레티나) */
  pixelRatio?: number;
  mimeType?: "image/png" | "image/jpeg";
  quality?: number;
};

export function planLayerToDataURL(
  layer: Layer | null | undefined,
  options: PlanExportOptions = {},
): string | undefined {
  if (!layer) return undefined;
  const { pixelRatio = 2, mimeType = "image/png", quality = 0.92 } = options;
  return layer.toDataURL({ pixelRatio, mimeType, quality });
}

export function usePlanLayerExport(
  planLayerRef: RefObject<Layer | null>,
) {
  const toDataURL = useCallback(
    (options?: PlanExportOptions) => planLayerToDataURL(planLayerRef.current, options),
    [planLayerRef],
  );
  return { toDataURL };
}
