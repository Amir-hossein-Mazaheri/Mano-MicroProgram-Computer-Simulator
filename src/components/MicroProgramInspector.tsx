import { useContext, useEffect, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { SignalContext } from "../context/SignalContext";
import { useAssembler } from "../store/useAssembler";
import Button from "./Button";

interface MicroProgramInspectorProps {
  className?: string;
}

const tableRow = "text-sm w-[20%] text-left py-4 px-6";
const desktopRow = " md:block hidden";

const MicroProgramInspector: React.FC<MicroProgramInspectorProps> = ({
  className,
}) => {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const [readingLine, setReadingLine] = useState(-1);

  const signal = useContext(SignalContext);

  const [microProgramMemory, toggleShowCodePanel] = useAssembler((store) => [
    store.microProgramMemory,
    store.toggleShowCodePanel,
  ]);

  const { getVirtualItems, measureElement, getTotalSize, scrollToIndex } =
    useVirtualizer({
      count: microProgramMemory.arrContent.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 60,
      overscan: 5,
    });

  const items = getVirtualItems();

  useEffect(() => {
    signal.signal.microProgramRead = (arr) => {
      const index = parseInt(arr, 2);
      setReadingLine(index);
      scrollToIndex(index, { align: "center" });

      setTimeout(() => setReadingLine(-1), 300);
    };
  }, [scrollToIndex, signal.signal]);

  return (
    <div className={`px-6 md:px-14 ${className}`}>
      <div className="font-xl mb-5 w-full rounded-xl border border-sky-500 px-6 py-3 text-center font-semibold text-sky-500">
        <h2>Micro Program Memory Inspector</h2>
      </div>

      <div className="overflow-hidden rounded-xl">
        <div className="">
          <div className="w-full table-auto border-collapse bg-gray-800">
            <div className="sticky top-0 z-10 flex bg-gray-900">
              <div className={tableRow}>Number</div>
              <div className={`${tableRow} ${desktopRow}`}>Name</div>
              <div className={`${tableRow} ${desktopRow}`}>F1</div>
              <div className={tableRow}>F2</div>
              <div className={tableRow}>F3</div>
              <div className={tableRow}>CD</div>
              <div className={tableRow}>BR</div>
              <div className={tableRow}>AD</div>
            </div>

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
                        !microProgramMemory.arrContent[index][1].isEmpty() &&
                        readingLine !== index &&
                        "bg-green-500/30"
                      }  ${readingLine === index && "bg-sky-500/30"}`}
                      data-index={index}
                    >
                      <div className={`${tableRow} ${desktopRow}`}>
                        {microProgramMemory.arrContent[index][0]}
                      </div>
                      <div className={`${tableRow} ${desktopRow}`}>
                        {microProgramMemory.arrContent[index][1].name}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].F1.code}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].F2.code}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].F3.code}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].CD.code}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].BR.code}
                      </div>
                      <div className={`font-mono text-base ${tableRow}`}>
                        {microProgramMemory.arrContent[index][1].ADDR}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full">
        <Button
          className="flex w-full items-center justify-center gap-3 bg-red-500 fill-white"
          onClick={() => toggleShowCodePanel()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Back To Code Panel</span>
        </Button>
      </div>
    </div>
  );
};

export default MicroProgramInspector;
