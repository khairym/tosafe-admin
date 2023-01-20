import { useQuery } from "@apollo/react-hooks";
import React from "react";
import Loader from "../Loader";
import Error from "../Error";
import { CSelect } from "@coreui/react";
import { useHistory, useLocation } from "react-router";
import {
  buildCurrentUrlSearchWithThisParams,
  getQueryParam,
  navigateToLocation,
  removeQueryParam,
} from "src/utils";
import { useTranslation } from "react-i18next";

const CreatorDropDown = ({ query, reportType }) => {
  const { error, loading, data } = useQuery(query);
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  if (error) {
    return <Error />;
  }

  if (loading) return <Loader />;

  const users = [
    { id: 0, display_name: t("allUser") },
    ...data.report.map((u) => u.user),
  ];

  const user = getQueryParam(
    "string",
    reportType === "internal" ? "user_id" : "created_by",
    search
  );

  return (
    <CSelect
      custom
      className="mb-3"
      name="creator"
      id="creator"
      onChange={(event) => {
          
        let newLocation;
        if (event.target.value == 0)
          newLocation = `${pathname}${removeQueryParam(
            reportType === "internal" ? "user_id" : "created_by",
            search
          )}`;
        else
          newLocation = `${pathname}${buildCurrentUrlSearchWithThisParams(
            reportType === "internal" ? "user_id" : "created_by",
            event.target.value,
            search
          )}`;

        navigateToLocation(`${pathname}${search}`, newLocation, history);
      }}
      value={user}
    >
      {users.map((item) => (
        <option key={item.id} value={item.id}>
          {item.display_name}
        </option>
      ))}
    </CSelect>
  );
};

export default CreatorDropDown;
