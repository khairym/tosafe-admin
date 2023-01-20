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
import { QIncidentList, IncidentLenghtj } from "./IncidentQuery";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import { FiCheck, FiAirplay, FiList } from "react-icons/fi";
import PrintButton from "src/reusable/buttons/PrintButton";
import { buildVariable, getDate } from "src/utils";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import TopFilter from "src/reusable/filters/TopFilter";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import PaginationFooter from "src/reusable/paginated-list/PaginationFooter";
import { useLocation } from "react-router";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";

function IncidentList() {
  const { t } = useTranslation();

  const statusesList = [
    { value: "", name: t("allReports") },
    { value: 0, name: t("new") },
    { value: 1, name: t("finished") },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const { search } = useLocation();
  const { loading, error, data } = useQuery(QIncidentList, {
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
  } = useQuery(IncidentLenghtj);

  if (loading) return <Loader />;
  if (error) return <Error />;

  const pagesCount = data.reports.aggregate.count;

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
            <CNavbarBrand>{t("incidentReport")}</CNavbarBrand>

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
              t("createdAt"),
            ]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.incident}
                reportType="incident"
              />,

              <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("branchName")}</th>
                <th>{t("incidentDate")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("incidentDescription")}</th>
                <th>{t("creator")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.incident_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>
                    <td>{br.incident_date}</td>
                    <td>{getDate(br.created_at)}</td>
                    <td>{br.incident_description}</td>
                    <td>{br.user.display_name}</td>
                    <td>
                      {
                        <CBadge
                          style={{ padding: 10 }}
                          color={br.status ? "info" : "success"}
                        >
                          {" "}
                          {br.status == 0 ? t("new") : t("finished")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <DetailsButton to={`incident/${br.id}`} />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch.id}
                        schema="incident"
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

export default withTranslation()(IncidentList);
