import { Handle, NodeResizer, Position, type NodeProps } from '@xyflow/react';
import { Trash2, GripHorizontal } from 'lucide-react';
import type { EvidenceNodeType } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

const M3_PALETTE = [
  { bg: '#1e251e', border: '#3b4b3c', accent: '#a3cfa2' },
  { bg: '#252824', border: '#424840', accent: '#c2c9bd' },
  { bg: '#27242a', border: '#463f4b', accent: '#d7bee0' },
  { bg: '#2a2420', border: '#4d413a', accent: '#e8beac' },
  { bg: '#1c2429', border: '#37454f', accent: '#a6cbe3' },
];

export function EvidenceNode({ id, data, selected }: NodeProps<EvidenceNodeType>) {
  const updateNodeData = useBoardStore((s) => s.updateNodeData);
  const deleteNode = useBoardStore((s) => s.deleteNode);

  const currentTheme =
    M3_PALETTE.find((p) => p.bg === data.color) || M3_PALETTE[0];

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={220}
        minHeight={140}
        lineClassName="!border-[#a3cfa2]/40"
        handleClassName="!w-2.5 !h-2.5 !bg-[#a3cfa2] !border-2 !border-[#0b0f0b] !rounded-full"
      />
      <div
        style={{
          backgroundColor: data.color || currentTheme.bg,
          borderColor: selected ? currentTheme.accent : currentTheme.border,
        }}
        className={`relative w-full h-full min-w-55 min-h-35 flex flex-col p-4 rounded-[26px] border transition-all duration-200 select-none shadow-lg ${
          selected
            ? 'ring-2 shadow-2xl scale-[1.01]'
            : 'hover:border-stone-500'
        }`}
      >
        {/* Точка соединения */}
        <div
          title="Drag to connect..."
          style={{ backgroundColor: currentTheme.accent }}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 h-7 px-3 rounded-full flex items-center justify-center gap-1.5 cursor-crosshair shadow-md transition-transform hover:scale-105 z-10"
        >
          <GripHorizontal size={14} className="text-stone-900 pointer-events-none" />

          <Handle
            type="source"
            position={Position.Top}
            className="absolute! top-1/2! left-0! w-full! h-0! opacity-0! border-0! transform-none! before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-7 before:cursor-crosshair"
          />
          <Handle
            type="target"
            position={Position.Top}
            className="absolute! top-1/2! left-0! w-full! h-0! opacity-0! border-0! transform-none! before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-7 before:cursor-crosshair"
          />
        </div>

        {/* Верхний служебный бар */}
        <div
          data-noexport="true"
          className={`flex items-center justify-between mt-1 mb-3 shrink-0 transition-opacity duration-150 ${
            selected ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="nodrag flex gap-1.5 bg-black/25 p-1 rounded-full border border-white/5">
            {M3_PALETTE.map((p) => (
              <button
                key={p.bg}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateNodeData(id, { color: p.bg });
                }}
                style={{ backgroundColor: p.accent }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-transform ${
                  data.color === p.bg ? 'scale-125 ring-1 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(id);
            }}
            className="nodrag text-stone-400 hover:text-red-400 cursor-pointer p-1 rounded-full hover:bg-white/5 transition"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Изображение */}
        {data.imageUrl && (
          <div className="mb-3 overflow-hidden rounded-2xl bg-black/40 border border-white/10 shrink-0 pointer-events-none">
            <img
              src={data.imageUrl}
              alt={data.title}
              draggable={false}
              className="w-full max-h-48 object-cover pointer-events-none select-none"
            />
          </div>
        )}

        {/* Заголовок карточки */}
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateNodeData(id, { title: e.target.value })}
          placeholder="Title..."
          className="nodrag w-full text-stone-100 font-medium tracking-wide bg-transparent focus:outline-none mb-1.5 text-sm placeholder:text-stone-500 font-sans shrink-0"
        />

        {/* Текст заметки */}
        <textarea
          value={data.content}
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
          placeholder="Note or details..."
          className="nodrag nowheel w-full flex-1 text-xs text-stone-300 bg-black/20 p-2.5 rounded-xl border border-white/5 resize-none focus:outline-none focus:border-white/20 transition-colors font-sans leading-relaxed placeholder:text-stone-600"
        />
      </div>
    </>
  );
}
