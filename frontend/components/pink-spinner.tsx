import React from "react";

const HotPinkLineSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Outer spinner */}
      <div className="w-20 h-20 border-4 border-transparent text-pink-900 text-4xl animate-spin flex items-center justify-center border-t-pink-900 rounded-full">
        {/* Inner spinner */}
        <div className="w-16 h-16 border-4 border-transparent text-pink-500 text-2xl animate-spin flex items-center justify-center border-t-pink-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default HotPinkLineSpinner;
