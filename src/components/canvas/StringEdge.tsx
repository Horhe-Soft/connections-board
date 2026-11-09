import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import type { StringEdgeType } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

export function StringEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps<StringEdgeType>) {
  const updateEdgeData = useBoardStore((s) => s.updateEdgeData);
  const deleteEdge = useBoardStore((s) => s.deleteEdge);

  const [isFocused, setIsFocused] = useState(false);

  const startY = sourceY + 14;
  const endY = targetY + 14;

  const dx = targetX - sourceX;
  const dy = endY - startY;
  const dist = Math.hypot(dx, dy);

  const sag = - Math.min(Math.max(dist * 0.08, 15), 60);
  const controlX = (sourceX + targetX) / 2;
  const controlY = (startY + endY) / 2 + sag;

  const path = `M ${sourceX} ${startY} Q ${controlX} ${controlY} ${targetX} ${endY}`;

  // Координаты центра изгиба для ярлыка
  const labelX = 0.25 * sourceX + 0.5 * controlX + 0.25 * targetX;
  const labelY = 0.25 * startY + 0.5 * controlY + 0.25 * endY;

  const strokeColor = data?.color || '#587d58';
  const comment = data?.comment?.trim() || '';

  const isEditing = selected || isFocused;
  const shouldShowLabel = isEditing || comment.length > 0;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3.5 : 2,
          cursor: 'pointer',
        }}
      />

      {shouldShowLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan flex items-center gap-1.5 bg-[#1e251e] border border-[#3b4b3c] px-2.5 py-1 rounded-full shadow-lg transition-all"
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  autoFocus={selected && !comment}
                  value={data?.comment || ''}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => updateEdgeData(id, { comment: e.target.value })}
                  placeholder="Связь..."
                  className="w-24 text-[11px] text-stone-200 bg-transparent focus:outline-none focus:w-36 transition-all font-sans"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEdge(id);
                  }}
                  title="Удалить связь"
                  className="text-stone-400 hover:text-red-400 cursor-pointer p-0.5 rounded-full hover:bg-white/10"
                >
                  <X size={11} />
                </button>
              </>
            ) : (
              <span className="text-[11px] text-stone-300 font-sans px-1 select-none">
                {comment}
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
