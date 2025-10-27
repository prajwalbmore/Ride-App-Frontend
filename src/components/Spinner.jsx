import React from "react";

const Spinner = () => {
  // size in Tailwind units (e.g., 16 = w-16 h-16)
  return (
    <div className={`flex justify-center items-center h-96`}>
      <div
        className={`
          border-4 border-t-transparent rounded-full animate-spin
          w-20 h-20 border-blue-400
        `}
      ></div>
    </div>
  );
};

export default Spinner;
