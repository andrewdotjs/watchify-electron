import React from "react";
import "../styles/components/HorizontalSeriesContainer.css";

export default function HorizontalSeriesContainer({ children, title }) {
  return (
    <div className="horizontal-series-container">
      <h2 className="horizontal-series-slider-title">
        {title}
      </h2>
      <div className="horizontal-series-slider">
        {children}
      </div>
    </div>
  );
}