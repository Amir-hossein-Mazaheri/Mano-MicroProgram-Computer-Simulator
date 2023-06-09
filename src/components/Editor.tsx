import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface EditorProps {
  title: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  highlighter?: (val: string) => string;
  className?: string;
}

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

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    handleScroll();
  };

  const handleScroll = () => {
    if (preRef.current && textAreaRef.current) {
      preRef.current.scrollTop = textAreaRef.current.scrollTop;
      preRef.current.scrollLeft = textAreaRef.current.scrollLeft;
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

      <div className="relative py-24">
        <textarea
          ref={textAreaRef}
          name={name}
          className={`absolute left-0 top-0 z-[1] w-full resize-none overflow-auto whitespace-nowrap rounded-b-xl bg-transparent px-6 py-4 font-light leading-loose text-transparent caret-white outline-none `}
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
          className="absolute top-0 z-0 w-full overflow-auto whitespace-nowrap rounded-b-xl bg-gray-700/50 px-6 py-4 font-light leading-loose"
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
