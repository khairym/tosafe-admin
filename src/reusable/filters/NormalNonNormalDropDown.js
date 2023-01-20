import { CSelect } from "@coreui/react";
import React from "react";

import { useTranslation, withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import {
  getQueryParam,
  buildCurrentUrlSearchWithThisParams,
  removeQueryParam,
  navigateToLocation,
} from "src/utils";

const NormalNonNormalDropDown = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();

  const statuses = [
    { name: t("allReports"), value: -1 },
    { name: t("normal"), value: true },
    {
      name: t("nonNormal"),
      value: false,
    },
  ];
  const currentStatus = getQueryParam("boolean", "is_normal", search);
  // console.log(currentStatus);
  // alert(currentStatus);
  return (
    <CSelect
      custom
      className="mb-3"
      name="is_normal"
      id="is_normal"
      onChange={(event) => {
        debugger;

        let newLocation;
        if (event.target.value == -1)
          newLocation = `${pathname}${removeQueryParam("is_normal", search)}`;
        else
          newLocation = `${pathname}${buildCurrentUrlSearchWithThisParams(
            "is_normal",
            event.target.value,
            search
          )}`;
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
};

export default NormalNonNormalDropDown;
