import { useEffect, useMemo, useRef } from "react";
import { shallow } from "zustand/shallow";
import { useVirtualizer } from "@tanstack/react-virtual";

import ErrorPanel from "./ErrorPanel";
import { useAssembler } from "../store/useAssembler";
import { Memory } from "../core/Memory";

interface MemoryInspectorProps {
  className?: string;
}

const tableRow = "text-sm w-[20%] text-left py-4 px-6";

const MemoryInspector: React.FC<MemoryInspectorProps> = ({ className }) => {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const { warns, error, assembled } = useAssembler((store) => store, shallow);

  const memory = useMemo(() => new Memory(assembled), [assembled]);

  const { getVirtualItems, measureElement, getTotalSize, scrollToIndex } =
    useVirtualizer({
      count: memory.content.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 60,
      overscan: 5,
      initialOffset: memory.start,
    });

  const items = getVirtualItems();

  return (
    <div className={`flex flex-col justify-between px-8 ${className}`}>
      <div className="overflow-hidden rounded-xl">
        <div className="">
          <div className="w-full table-auto border-collapse bg-gray-800">
            <div className="sticky top-0 z-10 flex bg-gray-900">
              <div className={tableRow}>Number</div>
              <div className={tableRow}>Line Label</div>
              <div className={tableRow}>Instruction</div>
              <div className={tableRow}>Binary</div>
            </div>
            {memory.size > 0 ? (
              <div
                className="w-full overflow-y-auto"
                style={{ contain: "strict", height: 380 }}
                ref={parentRef}
              >
                <div
                  style={{
                    height: getTotalSize(),
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(${items[0].start}px)`,
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                    }}
                  >
                    {items.map(({ key, index }) => (
                      <div
                        key={key}
                        ref={measureElement}
                        className="flex"
                        data-index={index}
                      >
                        <div className={tableRow}>
                          {memory.content[index].ln}
                        </div>
                        <div className={tableRow}>
                          {memory.content[index].label}
                        </div>
                        <div className={tableRow}>
                          {memory.content[index].instruction}
                        </div>
                        <div className={`font-mono text-base ${tableRow}`}>
                          {memory.content[index].binary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              "Empty"
            )}
          </div>
        </div>
      </div>

      <ErrorPanel warns={warns} error={error} />
    </div>
  );
};

export default MemoryInspector;
