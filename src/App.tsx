import { useEffect } from "react";

import { Parser } from "./core/Parser";

function App() {
  useEffect(() => {
    const p = new Parser(
      `ORG 100 /something new\nLDA SUB\nCMA\nINC\nADD MIN /Add\nSTA DIF\nHLT\nMIN, DEC 83\nSUB, DEC -23\nDIF, HEX 0\nEND\n`
    );

    p.clearLabel().clearOperandsLabel();
  }, []);

  return <></>;
}

export default App;
