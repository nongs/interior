import type { Layer } from "konva/lib/Layer";
import type { PlanExportOptions } from "@/hooks/usePlanExport";

export type CanvasHostHandle = {
  /** Plan 레이어를 PNG/JPEG data URL로 (그리드·가이드·툴 미포함) */
  toPlanDataURL: (options?: PlanExportOptions) => string | undefined;
  getPlanLayer: () => Layer | null;
};
