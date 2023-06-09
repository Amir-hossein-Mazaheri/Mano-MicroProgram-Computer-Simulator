import React from "react";

interface ErrorPanelProps {
  error?: string;
  warns: string[];
  className?: string;
}

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

      <div className="space-y-8 px-6 py-8">
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
