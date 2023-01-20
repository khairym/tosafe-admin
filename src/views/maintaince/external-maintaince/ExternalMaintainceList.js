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
  CButton,
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import { QexternalReportLis, externalListStatistc } from "./QueryExMaintain";
import { FiCheck, FiList, FiAirplay } from "react-icons/fi";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import { Link } from "react-router-dom";
import { getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import SettingButton from "src/reusable/buttons/SettingButton";
import TopFilter from "src/reusable/filters/TopFilter";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";

function ExternalMaintainceList() {
  const [isOpen, setIsOpen] = useState(false);
  const [branch, setBranch] = useState();
  const [status, setStatus] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { t } = useTranslation();

  const statusesList = [
    { value: "", name: t("allReports") },
    { value: true, name: t("new") },
    { value: false, name: t("finished") },
  ];

  const buildVariable = () => {
    let filter = {};
    console.log(status);
    if (status) filter.status = { _eq: status };
    if (branch && branch != 0) filter.branch_id = { _eq: branch };

    const offset = (currentPage - 1) * limit;
    let vars = { offset: offset < 0 ? 0 : offset };

    if (filter) vars.filter = filter;
    console.log(vars);
    return vars;
  };

  const { loading, error, data } = useQuery(QexternalReportLis, {
    variables: buildVariable(),
  });

  const {
    loading: stLoading,
    error: stError,
    data: statistics,
  } = useQuery(externalListStatistc);

  if (loading) return <Loader />;
  if (error) return <Error />;

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
            <CNavbarBrand>{t("externalMaintenanceReport")}</CNavbarBrand>

            <CCollapse
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                {/* <StatusesDropDown
                  statuses={statusesList}
                  status={status}
                  setStatus={(st) => {
                    console.log(st);
                    setStatus(st);
                  }}
                />

                <BranchesDrobdown
                  branch={branch}
                  setBranch={(b) => setBranch(b)}
                /> */}

                <SettingButton to={`/spare-parts`} />
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardHeader>
        <CCardBody>
          <TopFilter
            titlesArray={[t("status"), t("branchName"), t("creator")]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.external}
                reportType="external"
              />,
              // <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("maintainance_date")}</th>
                <th>{t("visit_type")}</th>
                <th>{t("system_type")}</th>
                <th>{t("problem_description")}</th>
                <th>{t("creatat")}</th>
                <th>{t("statu")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.external_maintainance_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>{br.maintainance_date}</td>
                    <td>{br.visit_type}</td>
                    <td>{br.system_type}</td>
                    <td>{br.problem_description}</td>
                    <td>{getDate(br.created_at)}</td>
                    <td>
                      {
                        <CBadge color={br.status ? "info" : "success"}>
                          {" "}
                          {br.status ? t("new") : t("finished")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <DetailsButton to={`/external/${br.id}`} />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch.id}
                        schema="external_maintainance"
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

export default withTranslation()(ExternalMaintainceList);
