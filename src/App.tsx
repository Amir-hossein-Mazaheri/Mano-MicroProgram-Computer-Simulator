import { ToastContainer } from "react-toastify";

import CodePanel from "./components/CodePanel";
import MemoryInspector from "./components/MemoryInspector";
import Bar from "./components/Bar";
import SignalContextProvider from "./context/SignalContextProvider";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <SignalContextProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
        <Bar />
        <div className="flex w-full grow justify-between py-10">
          <CodePanel className="flex-1" />
          <MemoryInspector className="flex-1" />
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </SignalContextProvider>
  );
}

export default App;
