import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
  CRow,
  CCol,
  CFormGroup,
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CButton,
  CBadge,
  CCard,
  CLabel,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import _ from "lodash";

import { FiInfo, FiList, FiMessageCircle } from "react-icons/fi";

import { GetExternalReportDetails } from "./QueryExMaintain";
import { Table } from "reactstrap";
import { getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import { FaBug, FaCogs, FaImages, FaTools, FaWrench } from "react-icons/fa";
import ImagesViewer from "src/reusable/ImagesViewer";

const ExternalMaintenanceDetails = ({ match }) => {
  const { t, i18n } = useTranslation();
  const { error, loading, data } = useQuery(GetExternalReportDetails, {
    variables: {
      reportId: match.params.id,
    },
  });

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

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
  console.log(data);
  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("externalMaintenanceReport")} </CNavbarBrand>

          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <PrintButton
                size="md"
                url={data.report.report_url}
                id={data.report.id}
                branch={data.report.branch.id}
                schema="external_maintainance"
                name="report"
              />
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="4" lg="3" sm="12">
            <h5>
              <FiInfo /> {t("generalInformation")}
            </h5>
            <Table responsive>
              <tr>
                <td>
                  <b>{t("visitType")}</b>
                </td>
                <td>{data.report.visit_type}</td>
              </tr>
              <tr>
                <td>
                  <b>{t("status")}</b>
                </td>
                <td>
                  <CBadge
                    style={{ fontSize: 13 }}
                    color={getBadge(data.report.status)}
                  >
                    {" "}
                    {data.report.status == 0 ? t("new") : t("history")}{" "}
                  </CBadge>{" "}
                </td>
              </tr>
              <tr>
                <td>
                  <b>{t("branch")}</b>
                </td>
                <td>
                  {i18n.language == "ar"
                    ? data.report.branch.name
                    : data.report.branch.name_en}
                </td>
              </tr>
              <tr>
                <td>
                  <b>{t("createdBy")}</b>
                </td>
                <td>{data.report.user?.display_name}</td>
              </tr>
              <tr>
                <td>
                  <b> {t("maintainance_date")}</b>
                </td>
                <td>{data.report.maintainance_date}</td>
              </tr>
              <tr>
                <td>
                  <b>{t("createdAt")}</b>
                </td>

                <td>{getDate(data.report.created_at)}</td>
              </tr>
            </Table>
          </CCol>
          <CCol md="8" lg="9" sm="12">
            <div className="row">
              <div className="col">
                <h5>
                  <FiList /> {t("detail")}
                </h5>
              </div>
              <div className="col-md-auto"> </div>
              <div className="col col-lg-3">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="pill"
                  size="md"
                  onClick={() => {}}
                >
                  <span></span>
                  <FiMessageCircle width={60} /> {t("discussion")}
                </CButton>
              </div>
            </div>
            <pre />
            <h6>
              <FaCogs /> {t("systemType")} : <span></span>
              {data.report.problem_description}
            </h6>
            <pre />
            <h6>
              <FaBug /> {t("problemDescription")} : <span></span>
              {data.report.problem_description}
            </h6>
            <pre />

            <h6>
              <FaTools /> {t("problemDescription")} : <span></span>
            </h6>
            <p style={{ padding: 25 }}>{data.report.problem_solution}</p>
            <pre />
            <h6>
              <FaImages /> {t("sparePartsImages")} : <span></span>
            </h6>
            {!data.report.images && (
              <p className="text-center">{t("notProvided")}</p>
            )}

            <ImagesViewer images={data.report.images.split(",")} />
            <div>
              <h5>
                <FaWrench /> {t("spareParts")}
              </h5>
              <table className="table striped">
                <thead>
                  <tr>
                    <th>{t("category")}</th>
                    <th>{t("item")}</th>
                    <th>{t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.report.items.map((item) => (
                    <tr>
                      <td>
                        {i18n.language == "ar"
                          ? item.item.category.name
                          : item.item.category.name_en}
                      </td>
                      <td>
                        {i18n.language == "ar"
                          ? item.item.name
                          : item.item.name_en}
                      </td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

ExternalMaintenanceDetails.propTypes = {};

export default withTranslation()(ExternalMaintenanceDetails);
