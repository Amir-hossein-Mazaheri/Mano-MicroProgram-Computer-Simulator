import React from "react";

interface ErrorPanelProps {
  error?: string;
  warns: string[];
  className?: string;
}

/**
 * ErrorPanel shows error and warns after assembling the code wether there is any
 */
const ErrorPanel: React.FC<ErrorPanelProps> = ({ error, warns, className }) => {
  if (!error && !warns.length) {
    return <></>;
  }

  return (
    <div className={`overflow-hidden rounded-xl bg-gray-800 ${className}`}>
      <h3
        className={`w-full px-4 py-3 font-bold ${
          error ? "bg-red-500" : "bg-orange-500"
        }`}
      >
        {error ? "Errors" : "Warns"}
      </h3>

      <div className="max-h-60  space-y-8 overflow-auto px-6 py-8">
        {error ? (
          <p className="font-bold text-red-500">{error}</p>
        ) : (
          warns.map((warn) => (
            <p className="font-semibold text-orange-500">{warn}</p>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorPanel;
