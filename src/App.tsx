import { ToastContainer } from "react-toastify";

import CodePanel from "./components/CodePanel";
import InspectorPanel from "./components/InspectorPanel";
import Bar from "./components/Bar";
import SignalContextProvider from "./context/SignalContextProvider";
import { useAssembler } from "./store/useAssembler";

import "react-toastify/dist/ReactToastify.css";
import MicroProgramInspector from "./components/MicroProgramInspector";

function App() {
  const showCodePanel = useAssembler((store) => store.showCodePanel);

  return (
    <SignalContextProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
        <Bar />
        <div className="flex w-full grow flex-col-reverse justify-between py-8 pb-10 md:flex-row">
          {showCodePanel ? (
            <CodePanel className="flex-1" />
          ) : (
            <MicroProgramInspector className="flex-1" />
          )}
          <InspectorPanel className="flex-1" />
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </SignalContextProvider>
  );
}

export default App;
