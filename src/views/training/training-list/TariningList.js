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
  CButton,
  CBadge,
  CCard,
  CCardFooter,
  CPagination,
  CCollapse,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import {
  TrainingList,
  GetTrainingStatistics,
} from "../training-query/TrainingListQuery";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { FiDelete, FiList, FiAirplay, FiCheck } from "react-icons/fi";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import { buildVariable, getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import TopFilter from "src/reusable/filters/TopFilter";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import PaginationFooter from "src/reusable/paginated-list/PaginationFooter";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";

function TariningList() {
  const { t } = useTranslation();
  const { search } = useLocation();

  const { loading, error, data } = useQuery(TrainingList, {
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
  } = useQuery(GetTrainingStatistics);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }
  const getBadge = (status) => {
    switch (status) {
      case 0:
        return "info";
      case 1:
        return "success";
      case 2:
        return "danger";
    }
  };

  const statusesList = [
    { value: -1, name: t("allReports") },
    { value: 0, name: t("new") },
    { value: 1, name: t("done") },
    { value: 2, name: t("canceled") },
  ];

  // console.log(data);

  return (
    <div>
      {!stLoading && !stError && (
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
              text={t("canceled")}
              header={statistics.canceled.aggregate.count}
              color="success"
              iconPadding={false}
            >
              <FiCheck width={24} />
            </CWidgetIcon>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <CWidgetIcon
              text={t("done")}
              header={statistics.done.aggregate.count}
              color="danger"
              iconPadding={false}
            >
              <FiDelete width={24} />
            </CWidgetIcon>
          </CCol>
        </CRow>
      )}
      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CIcon name="cil-layers" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("trainingReports")}</CNavbarBrand>

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
              t("occuredAt"),
            ]}
            componentsArray={[
              <StatusesDropDown statuses={statusesList} />,
              <BranchesDrobdown />,
              <CreatorDropDown
                query={CreatorQuery.training}
                reportType="training"
              />,
              <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("trainingType")}</th>
                <th>{t("branchName")}</th>
                <th>{t("Creator")}</th>
                <th>{t("occuredAt")}</th>
                {/* <th>{t("creatat")}</th> */}
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.training_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>
                      <CBadge style={{ padding: 10 }} color="light">
                        {br.training_category}{" "}
                      </CBadge>
                    </td>

                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>

                    <td>{br.user?.display_name}</td>

                    {/* <td>{br.occured_at}</td> */}
                    <td>{getDate(br.created_at)}</td>
                    <td>
                      {
                        <CBadge color={getBadge(br.status)}>
                          {" "}
                          {br.status == 0
                            ? t("new")
                            : br.status == 1
                            ? t("finished")
                            : t("Canceled")}{" "}
                        </CBadge>
                      }
                    </td>
                    <td>
                      <DetailsButton to={`/training/${br.id}`} />{" "}
                      <PrintButton
                        url={br.report_url}
                        id={br.id}
                        branch={br.branch.id}
                        schema="training"
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

export default withTranslation()(TariningList);
