import React, { useState } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CButton,
  CBadge,
  CCard,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import _ from "lodash";

import { FiInfo, FiList, FiMessageCircle } from "react-icons/fi";

import { GetEmergencyReportDetails } from "./emergancyQuery";
import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import { FaBug, FaImages } from "react-icons/fa";
import ImagesViewer from "src/reusable/ImagesViewer";
import CommentsQueries from "../comments/CommentsQueries";
import CommentsList from "../comments/CommentsList";

const EmergencyDetails = ({ match }) => {
  const { t, i18n } = useTranslation();
  // const history = useHistory();

  const { error, loading, data } = useQuery(GetEmergencyReportDetails, {
    variables: {
      reportId: match.params.id,
    },
  });

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData,
  } = useSubscription(CommentsQueries.emergency.get, {
    variables: { reportId: match.params.id },
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

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("emergencyDetails")} </CNavbarBrand>

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
                schema="emergency"
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

            <h5>
              <FaBug /> {t("problemDescription")} : <span></span>
            </h5>
            <p>{data.report.description}</p>
            <pre />

            <h5>
              <CIcon name="cil-lightbulb" />
              {t("TechDeps")}
            </h5>
            <p>
              {data.report.departments?.map((dept) => (
                <span>{{ dept }}/</span>
              ))}
            </p>
            <pre />

            <div>
              <h5>
                <FaImages />
                {t("images")}
              </h5>
              <ImagesViewer images={data.report.assets?.split(",")} />

              {/* {data.report.assets?.split(",").map((img) => (
                <img width="120" src={img} />
              ))} */}
            </div>
            <pre />
            <div>
              <h5>
                <FaImages />
                {t("engineerImages")}
              </h5>
              <ImagesViewer images={data.report.engineer_assets?.split(",")} />
              {/* {data.report.engineer_assets?.split(",").map((img) => (
                <img width="120" src={img} />
              ))} */}
            </div>

            {commentsLoading ? (
              <Loader />
            ) : commentsError ? (
              <Error />
            ) : (
              <CommentsList
                comments={commentsData.comments}
                mutation={CommentsQueries.emergency.insert}
                rootVars={{ reportId: match.params.id }}
              />
            )}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

EmergencyDetails.propTypes = {};

export default withTranslation()(EmergencyDetails);
