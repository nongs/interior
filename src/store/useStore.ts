import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** 평면상의 꼭짓점 (벽이 연결되는 지점) */
export type Node = {
  id: string;
  x: number;
  y: number;
};

/** 두 Node를 잇는 벽 */
export type Wall = {
  id: string;
  startNodeId: string;
  endNodeId: string;
  /** 표시/충돌용 두께 (px 또는 동일 좌표계 단위) */
  thickness: number;
};

/**
 * 배치되는 가구. W/D/H는 사용자가 직접 수정 가능한 치수.
 * 좌표·회전은 캔버스(또는 mm 등) 단일 좌표계에 맞춰 사용.
 */
export type Furniture = {
  id: string;
  name?: string;
  x: number;
  y: number;
  /** 라디안 또는 도 단위 — 렌더 레이어에서 일관되게 사용 */
  rotation: number;
  /** 사용자가 직접 수정하는 치수 (동일 도면/실물 단위에 맞춤) */
  width: number;
  depth: number;
  height: number;
  lockAspectRatio?: boolean;
};

type InteriorState = {
  nodes: Node[];
  walls: Wall[];
  furniture: Furniture[];
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setWalls: (walls: Wall[] | ((prev: Wall[]) => Wall[])) => void;
  setFurniture: (furniture: Furniture[] | ((prev: Furniture[]) => Furniture[])) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, partial: Partial<Omit<Node, "id">>) => void;
  removeNode: (id: string) => void;
  addWall: (wall: Wall) => void;
  updateWall: (id: string, partial: Partial<Omit<Wall, "id">>) => void;
  removeWall: (id: string) => void;
  addFurniture: (item: Furniture) => void;
  updateFurniture: (id: string, partial: Partial<Omit<Furniture, "id">>) => void;
  removeFurniture: (id: string) => void;
  reset: () => void;
};

const initialState = {
  nodes: [] as Node[],
  walls: [] as Wall[],
  furniture: [] as Furniture[],
};

function applyArrayUpdate<T>(
  current: T[],
  next: T[] | ((prev: T[]) => T[]),
): T[] {
  return typeof next === "function" ? next(current) : next;
}

export const useStore = create<InteriorState>()(
  persist(
    (set) => ({
      ...initialState,

      setNodes: (next) =>
        set((s) => ({ nodes: applyArrayUpdate(s.nodes, next) })),

      setWalls: (next) =>
        set((s) => ({ walls: applyArrayUpdate(s.walls, next) })),

      setFurniture: (next) =>
        set((s) => ({ furniture: applyArrayUpdate(s.furniture, next) })),

      addNode: (node) =>
        set((s) => ({ nodes: [...s.nodes, node] })),

      updateNode: (id, partial) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, ...partial } : n,
          ),
        })),

      removeNode: (id) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== id),
          walls: s.walls.filter(
            (w) => w.startNodeId !== id && w.endNodeId !== id,
          ),
        })),

      addWall: (wall) =>
        set((s) => ({ walls: [...s.walls, wall] })),

      updateWall: (id, partial) =>
        set((s) => ({
          walls: s.walls.map((w) =>
            w.id === id ? { ...w, ...partial } : w,
          ),
        })),

      removeWall: (id) =>
        set((s) => ({
          walls: s.walls.filter((w) => w.id !== id),
        })),

      addFurniture: (item) =>
        set((s) => ({ furniture: [...s.furniture, item] })),

      updateFurniture: (id, partial) =>
        set((s) => ({
          furniture: s.furniture.map((f) =>
            f.id === id ? { ...f, ...partial } : f,
          ),
        })),

      removeFurniture: (id) =>
        set((s) => ({
          furniture: s.furniture.filter((f) => f.id !== id),
        })),

      reset: () => set({ ...initialState }),
    }),
    {
      name: "interior-planner",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        walls: state.walls,
        furniture: state.furniture,
      }),
    },
  ),
);
