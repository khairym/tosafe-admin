import React, { useState } from "react";
import {
  CRow,
  CCol,
  CWidgetIcon,
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CBadge,
  CCard,
  CCardFooter,
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { QRiskList } from "../risk-query/RiskListQuery";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";

import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";

import { FiCheck, FiAirplay, FiList, FiDelete } from "react-icons/fi";
import PrintButton from "src/reusable/buttons/PrintButton";
import { buildVariable, getDate } from "src/utils";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import SettingButton from "src/reusable/buttons/SettingButton";
import RiskAssessmentMeasures from "./RiskAssessmentMeasures";
import PaginationFooter from "src/reusable/paginated-list/PaginationFooter";
import { useLocation } from "react-router";
import TopFilter from "src/reusable/filters/TopFilter";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";
import NormalNonNormalDropDown from "src/reusable/filters/NormalNonNormalDropDown";

function RiskList() {
  const { t } = useTranslation();
  const { search } = useLocation();

  const { loading, error, data } = useQuery(QRiskList, {
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

  if (loading) return <Loader />;

  if (error) {
    console.log(error);
    return <Error />;
  }

  const getBadge = (status) => {
    switch (status) {
      case "done":
        return "success";
      case "new":
        return "info";
    }
  };

  const statusesList = [
    { value: "", name: t("allReports") },
    { value: "new", name: t("new") },
    { value: "done", name: t("done") },
  ];

  return (
    <div>
      <RiskAssessmentMeasures />
      <CRow>
        <CCol xs="12" sm="12" lg="4">
          <CWidgetIcon
            text={t("allReports")}
            header={data.all.aggregate.count}
            color="primary"
            iconPadding={false}
          >
            <FiList width={24} />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="12" lg="4">
          <CWidgetIcon
            text={t("new")}
            header={data.new.aggregate.count}
            color="info"
            iconPadding={false}
          >
            <FiAirplay width={24} />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="12" lg="4">
          <CWidgetIcon
            text={t("done")}
            header={data.done.aggregate.count}
            color="success"
            iconPadding={false}
          >
            <FiCheck width={24} />
          </CWidgetIcon>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("riskAssessmentReports")}</CNavbarBrand>
            <CCollapse
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                <SettingButton to={`/risk-categories`} />
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
              <CreatorDropDown query={CreatorQuery.risk} reportType="risk" />,
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
                <th>{t("normal")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.risk_assessment_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>

                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>
                    <td>{getDate(br.created_at)}</td>
                    <td>{getDate(br.updated_at)}</td>
                    <td>{br.user.display_name}</td>
                    <td>
                      {
                        <CBadge color={getBadge(br.status)}>
                          {" "}
                          {t(br.status)}{" "}
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
                      <DetailsButton to={`/risk/${br.id}/${br.branch_id}`} />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch_id}
                        schema="risk_assessment"
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
          <PaginationFooter totalCount={data.reports.aggregate.count} />
        </CCardFooter>
      </CCard>
    </div>
  );
}

export default withTranslation()(RiskList);
