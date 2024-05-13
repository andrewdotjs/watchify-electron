import React from "react";
import "../styles/components/VerticalSeriesContainer.css";

export default function VerticalSeriesContainer({ children }) {
  return (
    <div className="vertical-series-container">
      {children}
    </div>
  );
}