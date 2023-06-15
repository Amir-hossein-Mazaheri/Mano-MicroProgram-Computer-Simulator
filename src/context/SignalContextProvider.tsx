import { Signal } from "../core/Signal";
import { SignalContext } from "./SignalContext";

interface SignalContextProviderProps {
  children: React.ReactNode;
}

/**
 * Provides an instance of Signal class to its children
 */
const SignalContextProvider: React.FC<SignalContextProviderProps> = ({
  children,
}) => {
  return (
    <SignalContext.Provider value={{ signal: Signal.create() }}>
      {children}
    </SignalContext.Provider>
  );
};

export default SignalContextProvider;
