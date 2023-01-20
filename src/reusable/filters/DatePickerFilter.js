import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { CButton } from "@coreui/react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import {
  buildCurrentUrlSearchWithThisParams,
  getQueryParam,
  navigateToLocation,
  removeQueryParam,
} from "src/utils";

const DatePickerFilter = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { pathname, search } = useLocation();

  const currentDate = Date.parse(getQueryParam("string", "created_d", search));

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  return (
    <div style={{ marginTop: 8 }}>
      <DatePicker
        className="form-control col-12"
        selected={currentDate}
        onChange={(date) => {
          navigateToLocation(
            `${pathname}${search}`,
            `${pathname}${buildCurrentUrlSearchWithThisParams(
              "created_d",
              convert(date),
              search
            )}`,
            history
          );
        }}
      />

      <CButton
        onClick={() =>
          navigateToLocation(
            `${pathname}${search}`,
            `${pathname}${removeQueryParam("created_d", search)}`,
            history
          )
        }
        variant="light"
      >
        X {/* {t("reset")} */}
      </CButton>
    </div>
  );
};

export default DatePickerFilter;
