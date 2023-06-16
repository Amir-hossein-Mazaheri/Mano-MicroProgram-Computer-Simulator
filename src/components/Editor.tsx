import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface EditorProps {
  title: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  highlighter?: (val: string) => string;
  className?: string;
}

/**
 * Super editor like with syntax highlighting and line counter support
 */
const Editor: React.FC<EditorProps> = ({
  title,
  value,
  name,
  onChange,
  highlighter,
  className,
}) => {
  const [height, setHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lineCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);

      window.addEventListener("resize", () => {
        if (containerRef.current) {
          setHeight(containerRef.current.clientHeight);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [containerRef.current?.clientHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    handleScroll();
  };

  const handleScroll = () => {
    if (preRef.current && textAreaRef.current && lineCounterRef.current) {
      preRef.current.scrollTop = textAreaRef.current.scrollTop;
      preRef.current.scrollLeft = textAreaRef.current.scrollLeft;

      lineCounterRef.current.scrollTop = preRef.current.scrollTop;
      lineCounterRef.current.scrollLeft = preRef.current.scrollLeft;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-hidden rounded-xl text-sm ${className}`}
    >
      <h3 className="w-full bg-red-500 px-4 py-[0.8rem] text-sm font-semibold">
        {title}
      </h3>

      <div className="relative py-16">
        <div
          ref={lineCounterRef}
          style={{
            height: height,
          }}
          className="absolute top-0 z-10 flex flex-col overflow-hidden bg-gray-600/40 px-4 py-3 text-right leading-loose"
        >
          <div>
            {value.split("\n").map((v, i) => (
              <p key={v}>{i + 1}</p>
            ))}
          </div>
        </div>

        <textarea
          ref={textAreaRef}
          name={name}
          className={`absolute left-0 top-0 z-[1] w-full resize-none overflow-auto whitespace-nowrap rounded-b-xl bg-transparent px-16 py-3 font-light leading-loose text-transparent caret-white outline-none `}
          onInput={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
          value={value}
          style={{ height }}
        ></textarea>

        <pre
          aria-hidden
          ref={preRef}
          style={{ height }}
          className="absolute top-0 z-0 w-full overflow-auto whitespace-nowrap rounded-b-xl bg-gray-700/50 px-16 py-3 font-light leading-loose"
        >
          <code
            className="leading-loose"
            dangerouslySetInnerHTML={{
              __html: highlighter ? highlighter(value) : value,
            }}
          ></code>
        </pre>
      </div>
    </div>
  );
};

export default Editor;
