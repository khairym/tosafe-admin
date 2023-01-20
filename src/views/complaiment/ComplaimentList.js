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
  CToggler,
  CForm,
  CInput,
  CBadge,
  CCard,
  CCardFooter,
  CPagination,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "react-apollo";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import { QComplaimentList } from "./ComlaimentQuery";
import { buildVariable, getDate } from "src/utils";
import { useLocation } from "react-router";
import TopFilter from "src/reusable/filters/TopFilter";
import StatusesDropDown from "src/reusable/filters/StatusesDropDown";
import CreatorDropDown from "src/reusable/filters/CreatorDropDown";
import PaginationFooter from "src/reusable/paginated-list/PaginationFooter";
import { CreatorQuery } from "src/reusable/filters/CreatorQuery";
import DetailsButton from "src/reusable/buttons/DetailsButton";
import DatePickerFilter from "src/reusable/filters/DatePickerFilter";

function ComplaimentList() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { search } = useLocation();

  const { loading, error, data } = useQuery(QComplaimentList, {
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
  if (loading) return <Loader />;
  if (error) return <Error />;

  const getBadge = (status) => {
    switch (status) {
      case false:
        return "success";
      case true:
        return "info";
      default:
        return "primary";
    }
  };

  const pagesCount = data.all.aggregate.count;

  const statusesList = [
    { value: -1, name: t("allReports") },
    { value: false, name: t("new") },
    { value: true, name: t("done") },
  ];

  //complaints_report
  return (
    <div>
      <CRow>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text={t("allReports")}
            header={data.all.aggregate.count}
            color="primary"
            iconPadding={false}
          >
            <CIcon width={24} name="cil-settings" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text={t("new")}
            header={data.new.aggregate.count}
            color="info"
            iconPadding={false}
          >
            <CIcon width={24} name="cil-laptop" />
          </CWidgetIcon>
        </CCol>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text={t("done")}
            header={data.done.aggregate.count}
            color="warning"
            iconPadding={false}
          >
            <CIcon width={24} name="cil-moon" />
          </CWidgetIcon>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
            <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("complaintsReport")}</CNavbarBrand>
            <CCollapse show={isOpen} navbar>
              <CNavbarNav className="ml-auto"></CNavbarNav>
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
                query={CreatorQuery.periodic}
                reportType="periodic"
              />,
              <DatePickerFilter />,
            ]}
          />
          <Table responsive hover style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("branchName")}</th>
                <th>{t("problemDescription")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("updatedAt")}</th>
                <th>{t("creator")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.complaints_report.map((br, ind) => {
                return (
                  <tr style={{ alignItems: "center" }} key={ind}>
                    <th scope="row">{br.org_level_serial}</th>
                    <td>
                      {br.branch.name}/{br.branch.name_en}
                    </td>
                    <td>{br.description}</td>

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
                      <DetailsButton to={`/complaints/${br.id}`} />{" "}
                      {/* <PrintButton url={`periodic/${br.id}/${br.branch_id}`} /> */}
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

export default withTranslation()(ComplaimentList);
