import React from "react";
import { CSelect } from "@coreui/react";
import { useTranslation, withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import {
  getQueryParam,
  buildCurrentUrlSearchWithThisParams,
  removeQueryParam,
  navigateToLocation,
} from "src/utils";

function StatusesDropDown({ statuses }) {
  const history = useHistory();
  const { pathname, search } = useLocation();

  const currentStatus = getQueryParam(
    typeof statuses[1].value.toString().toLowerCase(),
    "status",
    search
  );

  return (
    <CSelect
      custom
      className="mb-3"
      name="status"
      id="status"
      onChange={(event) => {
        let newLocation;
        if (event.target.value == -1)
          newLocation = `${pathname}${removeQueryParam("status", search)}`;
        else
          newLocation = `${pathname}${buildCurrentUrlSearchWithThisParams(
            "status",
            event.target.value,
            search
          )}`;
        debugger;
        navigateToLocation(`${pathname}${search}`, newLocation, history);
      }}
      value={currentStatus}
    >
      {statuses.map((item) => (
        <option key={item.value} value={item.value}>
          {item.name}
        </option>
      ))}
    </CSelect>
  );
}
export default withTranslation()(StatusesDropDown);
