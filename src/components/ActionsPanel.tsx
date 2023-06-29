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
 * This component shows current registers and lets user to interact with computer simulator through
 * three main action such as "Next Micro Operation", "Next Step" and "Fully Execute"
 * which are handled by the CPU class
 */
const ActionsPanel: React.FC<ActionsPanelProps> = ({ className }) => {
  const [readingRegister, setReadingRegister] = useState<Register | "">("");
  const [writingRegister, setWritingRegister] = useState<Register | "">("");

  const signalContext = useContext(SignalContext);

  const { microProgramMemory, memory, restart, setError } = useAssembler(
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
      <div className="mb-12 mt-5 grid-cols-3 gap-x-4 gap-y-6 space-y-6 rounded-xl px-6 py-4 outline outline-[1px] md:grid md:space-y-0">
        {registers.map((r) => (
          <div
            key={r}
            className={`${r === readingRegister && "text-sky-500"} ${
              r === writingRegister && "text-red-500"
            } flex items-center ${
              r === "DR" ? "md:justify-end" : ""
            } gap-2 fill-white`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64c-35.3 0-64 28.7-64 64H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64c0 35.3 28.7 64 64 64v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448c35.3 0 64-28.7 64-64h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V280h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V176h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448c0-35.3-28.7-64-64-64V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H280V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H176V24zM160 128H352c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32zm192 32H160V352H352V160z" />
              </svg>
            </span>
            <p className="flex gap-1">
              <span>{r}: </span>
              <span>{cpu[r]}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="items-center gap-6 space-y-6 md:flex md:space-y-0">
        <Button
          outline
          className="flex w-full grow items-center justify-center gap-3 fill-green-500"
          onClick={handleAction("micro")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
          >
            <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z" />
          </svg>
          <span>Micro</span>
        </Button>

        <Button
          outline
          className="flex w-full grow items-center justify-center gap-3 fill-green-500"
          onClick={handleAction("step")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z" />
          </svg>
          <span>Step</span>
        </Button>

        <Button
          outline
          className="flex w-full grow items-center justify-center gap-3 fill-green-500"
          onClick={handleAction("execute")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
          <span>Run</span>
        </Button>
      </div>

      <div className="mt-5">
        <Button
          outline
          className="flex w-full items-center justify-center gap-3 fill-green-500"
          onClick={restart}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
          </svg>
          <span>Restart</span>
        </Button>
      </div>
    </div>
  );
};

export default ActionsPanel;
