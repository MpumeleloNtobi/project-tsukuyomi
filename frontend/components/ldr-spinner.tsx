"use cleint";

import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LineSpinner size="150" stroke="5" speed="1" color="#FF4FA7" />
    </div>
  );
}
