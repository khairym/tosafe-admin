import { CSpinner } from "@coreui/react";
import React from "react";

function Loader() {
  return (
    <div className="loader pt-3 text-center">
      <CSpinner variant="grow" style={{ width: "2rem", height: "2rem" }} />
      {/* <h5 className="mt-4 mb-4">{data.value}</h5> */}
    </div>
  );
}

export default Loader;
