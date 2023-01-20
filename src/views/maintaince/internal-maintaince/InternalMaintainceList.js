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
  CToggler,
  CBadge,
  CCard,
  CCardFooter,
  CPagination,
  CFormGroup,
  CButton,
  CLabel,
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import {
  InternalReportQuery,
  InternalListStatistc,
} from "./QInternalMaintaince";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import { FiCheck, FiList, FiAirplay } from "react-icons/fi";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import MaintenanceEngineersDropDown from "src/reusable/dropdowns/MaintenanceEngineersDropDown";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { buildVariable, getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import TopFilter from "src/reusable/filters/TopFilter";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import { useLocation } from "react-router";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";

function InternalMaintainceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [engineer, setEngineer] = useState();
  const [visitDate, setVisitDate] = useState();

  const limit = 10;
  const { t } = useTranslation();

  const statusesList = [
    { value: "", name: t("allReports") },
    { value: 0, name: t("new") },
    { value: 1, name: t("History") },
  ];
  const { search } = useLocation();
  const { loading, error, data } = useQuery(InternalReportQuery, {
    variables: buildVariable({
      filtersKeys: {
        status: "string",
        branch_id: "number",
        created_by: "string",
        created_d: "string",
      },
      querySearch: search,
    }),
  });

  const {
    loading: stLoading,
    error: stError,
    data: statistics,
  } = useQuery(InternalListStatistc);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  const pagesCount = Math.ceil(data.reports.aggregate.count / limit);

  const getBadge = (status) => {
    switch (status) {
      case "0":
        return "success";
      case "1":
        return "info";
      case "Pending":
        return "warning";
      case "Banned":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <div>
      {!stLoading && (
        <CRow>
          <CCol xs="12" sm="6" lg="4">
            <CWidgetIcon
              text={t("allReports")}
              header={statistics.all.aggregate.count}
              color="primary"
              iconPadding={false}
            >
              <FiList width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="4">
            <CWidgetIcon
              text={t("new")}
              header={statistics.new.aggregate.count}
              color="info"
              iconPadding={false}
            >
              <FiAirplay width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="4">
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
            {/* <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} /> */}
            <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("internalMaintainceReports")}</CNavbarBrand>

            <CCollapse
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml"></CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardHeader>
        <CCardBody>
          <TopFilter
            titlesArray={[
              t("status"),
              t("branchName"),
              t("creator"),
              t("assignedEngineer"),
              t("visitDate"),
              t("createdAt"),
            ]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.internal}
                reportType="internal"
              />,
              <MaintenanceEngineersDropDown
                engineer={engineer}
                setEngineer={(eng) => setEngineer(eng)}
              />,
              <div>
                <DatePicker
                  className="form-control col-12"
                  selected={visitDate}
                  onChange={(date) => setVisitDate(date)}
                />
                <CButton onClick={() => setVisitDate()} variant="light">
                  X
                </CButton>
              </div>,
              <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("title")}</th>
                <th>{t("orderType")}</th>
                <th>{t("branchName")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("creator")}</th>
                <th>{t("assignedEngineer")}</th>
                <th>{t("visitDate")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.internal_maintainance_report.map((br, ind) => {
                console.log(br.branch);
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>{br.title}</td>
                    <td>
                      {
                        <CBadge
                          color={br.orderType == "0" ? "warning" : "danger"}
                        >
                          {" "}
                          {br.orderType == "0"
                            ? "New Item"
                            : "Maintenance"}{" "}
                        </CBadge>
                      }
                      {}
                    </td>
                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>
                    <td>{getDate(br.created_at)}</td>
                    <td>{br.user.display_name}</td>
                    <td>
                      {br.engineer
                        ? br.engineer.display_name
                        : t("notProvided")}
                    </td>
                    <td>
                      {br.visit_date
                        ? getDate(br.visit_date)
                        : t("notProvided")}
                    </td>
                    <td>
                      {
                        <CBadge color={getBadge(br.status)}>
                          {" "}
                          {br.status == 0 ? t("new") : t("history")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <CButton
                        to={`/internal/${br.id}`}
                        color="info"
                        // variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          // toggleDetails(index);
                        }}
                      >
                        {t("reportDetails")}
                      </CButton>{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch.id}
                        schema="internal_maintainance"
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
          <CPagination
            size="sm"
            activePage={currentPage}
            pages={pagesCount}
            onActivePageChange={(pg) => setCurrentPage(pg)}
          />
        </CCardFooter>
      </CCard>
    </div>
  );
}

export default withTranslation()(InternalMaintainceList);
