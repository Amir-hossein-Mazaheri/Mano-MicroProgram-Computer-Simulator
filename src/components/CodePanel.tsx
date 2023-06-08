import { useState } from "react";

import Editor from "./Editor";
import { getBMPM } from "../utils/getBMPM";
import { SyntaxHighlighter } from "../core/SyntaxHighlighter";

interface PanelProps {
  className?: string;
}

const syntaxHighlighter = new SyntaxHighlighter("MicroProgram");

const CodePanel: React.FC<PanelProps> = ({ className }) => {
  const [microProgram, setMicroProgram] = useState(getBMPM());
  const [assembly, setAssembly] = useState("");

  return (
    <div className={`flex flex-col gap-12 px-14 ${className}`}>
      <Editor
        title="Micro Program Memory"
        value={microProgram}
        highlighter={(v) => syntaxHighlighter.highlight(v)}
        onChange={setMicroProgram}
        className="flex-[1.4]"
      />
      <Editor
        title="Assembly Code"
        value={assembly}
        onChange={setAssembly}
        className="flex-[2.6]"
      />
    </div>
  );
};

export default CodePanel;
