import { createContext } from "react";

import { Signal } from "../core/Signal";

export const SignalContext = createContext<{ signal: Signal }>({
  signal: Signal.create(),
});
