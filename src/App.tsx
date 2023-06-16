import { ToastContainer } from "react-toastify";

import CodePanel from "./components/CodePanel";
import InspectorPanel from "./components/InspectorPanel";
import Bar from "./components/Bar";
import SignalContextProvider from "./context/SignalContextProvider";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <SignalContextProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white">
        <Bar />
        <div className="flex w-full grow flex-col-reverse justify-between py-8 pb-10 md:flex-row">
          <CodePanel className="mt-12 flex-1 md:mt-0" />
          <InspectorPanel className="flex-1" />
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </SignalContextProvider>
  );
}

export default App;
