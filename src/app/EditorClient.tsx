"use client";

import dynamic from "next/dynamic";

const EditorView = dynamic(
  () => import("@/components/Editor/EditorView"),
  {
    ssr: false,
    loading: () => (
      <p className="p-6 text-sm text-zinc-400">캔버스 로딩…</p>
    ),
  },
);

export function EditorClient() {
  return <EditorView />;
}
