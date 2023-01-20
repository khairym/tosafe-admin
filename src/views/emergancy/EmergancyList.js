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
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import { QueryEmergancyList, EmergancyRebortStaistic } from "./emergancyQuery";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import { FiCheck, FiList, FiAirplay } from "react-icons/fi";
import { buildVariable, getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import TopFilter from "src/reusable/filters/TopFilter";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";
import { useLocation } from "react-router";

const EmergancyList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { t } = useTranslation();
  const { search } = useLocation();

  const statusesList = [
    { value: "", name: t("allReports") },
    { value: true, name: t("new") },
    { value: false, name: t("finished") },
  ];

  const { loading, error, data } = useQuery(QueryEmergancyList, {
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
  } = useQuery(EmergancyRebortStaistic);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }
  console.log("Reports are :: ", data.emergency_report);

  const pagesCount = Math.ceil(data.reports.aggregate.count / limit);

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
            <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
            <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("emergancyReports")}</CNavbarBrand>

            <CCollapse
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                {/* <StatusesDropDown
                  statuses={statusesList}
                  status={status}
                  setStatus={(st) => {
                    setStatus(st);
                  }}
                />
                <BranchesDrobdown
                  branch={branch}
                  setBranch={(b) => setBranch(b)}
                /> */}
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
              t("createdAt"),
            ]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.emergency}
                reportType="emergency"
              />,
              <DatePickerFilter />,
              // <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("branchName")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("creator")}</th>
                <th>{t("departments")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.emergency_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>

                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>
                    <td>{getDate(br.created_at)}</td>
                    <td>{br.user.display_name}</td>
                    <td>
                      {br.report_departments.map((dep, ind) => {
                        return (
                          <span key={ind}>
                            {" "}
                            {dep.technical_department.name}/
                            {dep.technical_department.name_en}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      {
                        <CBadge color={br.status ? "info" : "success"}>
                          {" "}
                          {br.status ? t("new") : t("history")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <DetailsButton to={`emergency/${br.id}`} />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch.id}
                        schema="emergency"
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
};

export default withTranslation()(EmergancyList);
