import React from "react";

interface BarProps {
  className?: string;
}

const Bar: React.FC<BarProps> = ({ className }) => {
  return (
    <div
      className={`w-full bg-green-500 text-gray-700 text-center py-3 ${className}`}
    >
      <p className="font-semibold">
        <span>Mano Micro Program Computer Simulator</span> By{" "}
        <span className="font-bold text-gray-800 underline underline-offset-4">
          <a href="https://amirhossein-mazaheri.ir" target="_blank">
            Amirhossein Mazaheri
          </a>
        </span>
      </p>
    </div>
  );
};

export default Bar;
