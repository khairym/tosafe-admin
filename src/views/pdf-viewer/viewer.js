import React from "react";
import { useLocation } from "react-router";

const Viewer = () => {
  const { search } = useLocation();

  const url = decodeURIComponent(new URLSearchParams(search).get("q"));

  return (
    <object data={url} type="application/pdf" width="100%" style={{height:'90vh'}}>
      <iframe src={url} style={{ border: "none" }}>
        <p>
          It seems your browser doesn't support pdf viewing .
          <a href={url}>Download the Report</a>
        </p>
      </iframe>
    </object>
  );
};

export default Viewer;
