import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { useVirtualizer } from "@tanstack/react-virtual";

import ErrorPanel from "./ErrorPanel";
import { useAssembler } from "../store/useAssembler";
import { Memory } from "../core/Memory";
import ActionsPanel from "./ActionsPanel";
import { SignalContext } from "../context/SignalContext";
import infoIllustration from "../assets/info.svg";

interface MemoryInspectorProps {
  className?: string;
}

const tableRow = "text-sm w-[20%] text-left py-4 px-6";
const desktopRow = " md:block hidden";

/**
 * This component shows current memory also ActionsPanel and ErrorPanel and
 * lets user to interact with the "Core Module"
 */
const InspectorPanel: React.FC<MemoryInspectorProps> = ({ className }) => {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const [readingLine, setReadingLine] = useState(-1);
  const [writingLine, setWritingLine] = useState(-1);

  const signalContext = useContext(SignalContext);

  const { warns, error, assembled, isAssembling, setMemory } = useAssembler(
    (store) => store,
    shallow
  );

  const memory = useMemo(() => new Memory(assembled), [assembled]);

  const { getVirtualItems, measureElement, getTotalSize, scrollToIndex } =
    useVirtualizer({
      count: memory.content.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 60,
      overscan: 5,
    });

  const items = getVirtualItems();

  useEffect(() => {
    setMemory(memory);
  }, [memory, setMemory]);

  useEffect(() => {
    if (memory.start === -1) return;

    scrollToIndex(memory.start, { align: "start" });
  }, [memory.start, scrollToIndex]);

  useEffect(() => {
    signalContext.signal.memoryWrite = (arr) => {
      const index = parseInt(arr, 2);
      setWritingLine(index);
      scrollToIndex(index, { align: "center" });

      setTimeout(() => setWritingLine(-1), 300);
    };

    signalContext.signal.memoryRead = (arr) => {
      const index = parseInt(arr, 2);
      setReadingLine(index);
      scrollToIndex(index, { align: "center" });

      setTimeout(() => setReadingLine(-1), 300);
    };
  }, [scrollToIndex, signalContext.signal]);

  if (!Object.keys(assembled).length || isAssembling) {
    return (
      <div className={`px-6 py-2 ${className}`}>
        <div className="rounded-xl border border-green-700 px-12 py-8 text-center">
          <div className="flex items-center justify-center">
            <img src={infoIllustration} alt="info-illustration" />
          </div>

          <p className="mt-12 font-semibold">
            You haven't assembled your code yet. Click on the{" "}
            <strong className="text-green-500">Assemble</strong> button
          </p>
        </div>

        <ErrorPanel className="mt-8" warns={warns} error={error} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-5 px-8 ${className}`}>
      <div className="font-xl mb-5 w-full rounded-xl border border-sky-500 px-6 py-3 text-center font-semibold text-sky-500">
        <h2>Memory Inspector</h2>
      </div>

      <div className="overflow-hidden rounded-xl">
        <div className="">
          <div className="w-full table-auto border-collapse bg-gray-800">
            <div className="sticky top-0 z-10 flex bg-gray-900">
              <div className={tableRow}>Number</div>
              <div className={`${tableRow} ${desktopRow}`}>Line Label</div>
              <div className={`${tableRow} ${desktopRow}`}>Instruction</div>
              <div className={tableRow}>Binary</div>
            </div>
            {memory.size > 0 && (
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
                        className={`flex border-b-[1.3px] border-white/30 ${
                          !memory.content[index].isEmpty() &&
                          readingLine !== index &&
                          writingLine !== index &&
                          "bg-green-500/30"
                        } ${readingLine === index && "bg-sky-500/30"} ${
                          writingLine === index && "bg-red-500/30"
                        }`}
                        data-index={index}
                      >
                        <div className={tableRow}>
                          {memory.content[index].ln}
                        </div>
                        <div className={`${tableRow} ${desktopRow}`}>
                          {memory.content[index].label}
                        </div>
                        <div className={`${tableRow} ${desktopRow}`}>
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
            )}
          </div>
        </div>
      </div>

      <ActionsPanel />

      <ErrorPanel warns={warns} error={error} />
    </div>
  );
};

export default InspectorPanel;
