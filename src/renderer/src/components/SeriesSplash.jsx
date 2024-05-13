import "../styles/components/SeriesSplash.css";

import React from "react";

import { Button } from "@mui/material";

export default function SeriesSplash({ series }) {
  return (
    <div className="series-splash-container">
      <img
        className="series-splash-image"
        src={`http://127.0.0.1/api/v1/series/${series?.id}/splash`}
        loading="lazy"
      />
      <div className="series-splash-info">
        <div className="series-splash-text">
          <h1>
            {series?.title}
          </h1>
          <p>
            {series?.description}
          </p>
        </div>
        <Button href={`#/series/${series?.id}`}>
          WATCH NOW
        </Button>
      </div>
    </div>
  );
}