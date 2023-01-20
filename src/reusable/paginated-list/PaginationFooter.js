import { CPagination, CSelect } from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { limits } from "src/const";
import {
  buildCurrentUrlSearchWithThisParams,
  navigateToLocation,
} from "src/utils";

const PaginationFooter = ({ totalCount }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { search, pathname } = useLocation();

  let queryParams = new URLSearchParams(search),
    limit = 10,
    page = 1;

  if (parseInt(queryParams.get("pg"), 10) > 0) {
    page = parseInt(queryParams.get("pg"), 10);
  }

  if (parseInt(queryParams.get("limit"), 10) > 0) {
    limit = parseInt(queryParams.get("limit"));
  }

  const pagesCount = Math.ceil(totalCount / limit);

  return (
    <div>
      <tr>
        <td>
          <CPagination
            size="sm"
            activePage={page}
            pages={pagesCount}
            onActivePageChange={(pg) => {
              // alert("Tesss ")

              navigateToLocation(
                `${pathname}${search}`,
                `${pathname}${buildCurrentUrlSearchWithThisParams(
                  "pg",
                  pg,
                  search
                )}`,
                history
              );
            }}
          />
        </td>
        <td colSpan={3}></td>
        <td style={{ paddingInlineStart: 10 }}>{t("pageSelector")}</td>
        <td>
          <CSelect
            custom
            className="mb-3"
            name="limit"
            id="limit"
            onChange={(event) => {
              // alert("Tesss ")

              navigateToLocation(
                `${pathname}${search}`,
                `${pathname}${buildCurrentUrlSearchWithThisParams(
                  "limit",
                  event.target.value,
                  search
                )}`,
                history
              );
            }}
            value={limit}
          >
            {limits.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </CSelect>
        </td>
      </tr>
    </div>
  );
};

export default PaginationFooter;
