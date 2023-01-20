import React, { useState } from "react";
import {
  CRow,
  CCol,
  CWidgetIcon,
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CBadge,
  CCard,
  CCardFooter,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";

import {
  ListperiodicRebort,
  GetPeriodicStatistics,
} from "./periodic-query/PeriodicQuery";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { FiCheck, FiAirplay, FiList, FiRewind, FiDelete } from "react-icons/fi";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import PrintButton from "src/reusable/buttons/PrintButton";
import { buildVariable, getDate } from "src/utils";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import SettingButton from "src/reusable/buttons/SettingButton";
import PaginationFooter from "src/reusable/paginated-list/PaginationFooter";
import { useLocation } from "react-router";
import TopFilter from "src/reusable/filters/TopFilter";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";
import NormalNonNormalDropDown from "src/reusable/filters/NormalNonNormalDropDown";

function PeriodicList() {
  const { t } = useTranslation();
  const { search } = useLocation();

  const { loading, error, data } = useQuery(ListperiodicRebort, {
    variables: buildVariable({
      filtersKeys: {
        status: "string",
        branch_id: "number",
        created_by: "string",
        created_d: "string",
        is_normal: "boolean",
      },
      querySearch: search,
    }),
  });

  const {
    loading: stLoading,
    error: stError,
    data: statistics,
  } = useQuery(GetPeriodicStatistics);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  const getBadge = (st) => {
    switch (st) {
      case 0:
        return "primary";
      case 1:
        return "warning";
      default:
        return "success";
    }
  };

  const pagesCount = data.reports.aggregate.count;

  const statusesList = [
    { value: -1, name: t("allReports") },
    { value: 0, name: t("new") },
    { value: 1, name: t("underReview") },
    { value: 2, name: t("done") },
  ];

  return (
    <div>
      {!stLoading && (
        <CRow>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetIcon
              text={t("allReports")}
              header={statistics.all.aggregate.count}
              color="primary"
              iconPadding={false}
            >
              <FiList width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetIcon
              text={t("new")}
              header={statistics.new.aggregate.count}
              color="info"
              iconPadding={false}
            >
              <FiAirplay width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetIcon
              text={t("underReview")}
              header={statistics.review.aggregate.count}
              color="warning"
              iconPadding={false}
            >
              <FiRewind width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetIcon
              text={t("done")}
              header={statistics.done.aggregate.count}
              color="danger"
              iconPadding={false}
            >
              <FiCheck width={24} />
            </CWidgetIcon>
          </CCol>
        </CRow>
      )}
      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("periodicReports")}</CNavbarBrand>

            <CCollapse
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                <SettingButton to={`/periodic-categories`} />
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardHeader>
        <CCardBody>
          <TopFilter
            titlesArray={[
              t("status"),
              t("branchName"),
              t("creator"),
              t("status"),
              t("createdAt"),
            ]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.periodic}
                reportType="periodic"
              />,

              <NormalNonNormalDropDown />,
              <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("branchName")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("updatedAt")}</th>
                <th>{t("creator")}</th>
                <th>{t("status")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.monthely_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>
                      {br.monthely_branch.name}/{br.monthely_branch.name_en}
                    </td>
                    <td>{getDate(br.created_at)}</td>
                    <td>{getDate(br.updated_at)}</td>
                    <td>{br.user.display_name}</td>
                    <td>
                      {
                        <CBadge color={getBadge(br.status)}>
                          {" "}
                          {br.status == 0
                            ? t("new")
                            : br.status == 1
                            ? t("underReview")
                            : t("done")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <div>
                        {" "}
                        {br.is_normal ? <FiCheck /> : <FiDelete />}{" "}
                        {br.is_normal ? t("normal") : t("nonNormal")}
                      </div>
                    </td>
                    <td>
                      <DetailsButton
                        to={`/periodic/${br.id}/${br.branch_id}`}
                      />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch_id}
                        schema="monthely"
                        name="report"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CCardBody>
        <CCardFooter>
          <PaginationFooter totalCount={pagesCount} />
        </CCardFooter>
      </CCard>
    </div>
  );
}

export default withTranslation()(PeriodicList);
