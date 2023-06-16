import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";

import Editor from "./Editor";
import { SyntaxHighlighter } from "../core/SyntaxHighlighter";
import Button from "./Button";
import { useAssembler } from "../store/useAssembler";
import { Assembler } from "../core/Assembler";
import { getBMPM } from "../utils/getBMPM";

interface PanelProps {
  className?: string;
}

const syntaxHighlighter = new SyntaxHighlighter("MicroProgram");

/**
 * CodePanel lets user write and modify two major things "Micro Program Memory" and "Assembly Code"
 * through a nice and pretty syntax highlighted editor also it lets user to assemble the code
 */
const CodePanel: React.FC<PanelProps> = ({ className }) => {
  const [assembly, setAssembly] = useState("");
  const [microProgram, setMicroProgram] = useState(getBMPM());

  const {
    isAssembling,
    microProgramMemory,
    restart,
    setAssembled,
    setIsAssembling,
    setError,
    setWarns,
    setRestart,
  } = useAssembler((store) => store, shallow);

  const handleAssembling = useCallback(
    (withTimeout = true) => {
      setError("");
      setWarns([]);
      setAssembled({});
      setIsAssembling(true);

      const main = () => {
        microProgramMemory.instructions = microProgram;

        microProgramMemory.load();

        const assembler = new Assembler(microProgramMemory, assembly);

        const [assembled, warns] = assembler.assemble();

        setWarns(warns);
        setAssembled(assembled);
      };

      if (!withTimeout) {
        main();
        setIsAssembling(false);
        return;
      }

      setTimeout(() => {
        try {
          main();

          toast("Assembled successfully!", {
            type: "success",
          });
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }

          toast("An error occurred while trying to assemble your code", {
            type: "error",
          });
        }

        setIsAssembling(false);
      }, 1000);
    },
    [
      assembly,
      microProgram,
      microProgramMemory,
      setAssembled,
      setError,
      setIsAssembling,
      setWarns,
    ]
  );

  useEffect(() => {
    if (restart) {
      setRestart(false);
      handleAssembling(false);
    }
  }, [handleAssembling, restart, setRestart]);

  return (
    <div className={`flex flex-col gap-5 px-6 md:px-14 ${className}`}>
      <Editor
        name="micro-program-editor"
        title="Micro Program Memory"
        value={microProgram}
        highlighter={(v) => syntaxHighlighter.highlight(v)}
        onChange={setMicroProgram}
        className="flex-[2]"
      />
      <Editor
        name="assembly-editor"
        title="Assembly Code"
        value={assembly}
        highlighter={(v) => syntaxHighlighter.setType("Assembly").highlight(v)}
        onChange={setAssembly}
        className="flex-[3]"
      />

      <Button
        className="flex items-center justify-center gap-3 fill-white"
        isLoading={isAssembling}
        onClick={handleAssembling}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1.3em"
          viewBox="0 0 576 512"
        >
          <path d="M413.5 237.5c-28.2 4.8-58.2-3.6-80-25.4l-38.1-38.1C280.4 159 272 138.8 272 117.6V105.5L192.3 62c-5.3-2.9-8.6-8.6-8.3-14.7s3.9-11.5 9.5-14l47.2-21C259.1 4.2 279 0 299.2 0h18.1c36.7 0 72 14 98.7 39.1l44.6 42c24.2 22.8 33.2 55.7 26.6 86L503 183l8-8c9.4-9.4 24.6-9.4 33.9 0l24 24c9.4 9.4 9.4 24.6 0 33.9l-88 88c-9.4 9.4-24.6 9.4-33.9 0l-24-24c-9.4-9.4-9.4-24.6 0-33.9l8-8-17.5-17.5zM27.4 377.1L260.9 182.6c3.5 4.9 7.5 9.6 11.8 14l38.1 38.1c6 6 12.4 11.2 19.2 15.7L134.9 484.6c-14.5 17.4-36 27.4-58.6 27.4C34.1 512 0 477.8 0 435.7c0-22.6 10.1-44.1 27.4-58.6z" />
        </svg>
        <span>Assemble</span>
      </Button>
    </div>
  );
};

export default CodePanel;
