import { useContext, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import Button from "./Button";
import { CPU } from "../core/CPU";
import { useAssembler } from "../store/useAssembler";
import { SignalContext } from "../context/SignalContext";
import { registers } from "../constants";
import { Register } from "../types";

interface ActionsPanelProps {
  className?: string;
}

/**
 * This component shows current registers and lets user to interact with through
 * three main action such as "Next Micro Operation", "Next Step" and "Fully Execute"
 * which are handled by the CPU class
 */
const ActionsPanel: React.FC<ActionsPanelProps> = ({ className }) => {
  const [readingRegister, setReadingRegister] = useState<Register | "">("");
  const [writingRegister, setWritingRegister] = useState<Register | "">("");

  const signalContext = useContext(SignalContext);

  const { microProgramMemory, memory, setError } = useAssembler(
    (store) => store,
    shallow
  );

  const cpu = useMemo(
    () => new CPU(microProgramMemory, memory),
    [memory, microProgramMemory]
  );

  const handleAction = (type: "step" | "micro" | "execute") => () => {
    try {
      cpu[type]();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    signalContext.signal.registerWrite = (register) => {
      setWritingRegister(register);

      setTimeout(() => setWritingRegister(""), 300);
    };

    signalContext.signal.registerRead = (register) => {
      setReadingRegister(register);

      setTimeout(() => setReadingRegister(""), 300);
    };
  }, [signalContext.signal]);

  return (
    <div className={`${className}`}>
      <div className="mb-12 mt-5 flex flex-wrap gap-6 rounded-xl px-6 py-4 outline outline-[1px]">
        {registers.map((r) => (
          <p
            key={r}
            className={`basis-[calc(33.33% - 1.5rem)] grow ${
              r === readingRegister && "text-sky-500"
            } ${r === writingRegister && "text-red-500"}`}
          >
            <span>{r}: </span>
            <span>{cpu[r]}</span>
          </p>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Button outline className="grow" onClick={handleAction("micro")}>
          Next Micro Operation
        </Button>

        <Button outline className="grow" onClick={handleAction("step")}>
          Next Step
        </Button>

        <Button outline className="grow" onClick={handleAction("execute")}>
          Fully Execute
        </Button>
      </div>
    </div>
  );
};

export default ActionsPanel;
