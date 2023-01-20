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

import { FiInfo, FiList, FiMessageCircle, FiUserCheck } from "react-icons/fi";

import { GetReportDetails, SetAppointment } from "./QInternalMaintaince";
import MaintenanceEngineersDropDown from "src/reusable/dropdowns/MaintenanceEngineersDropDown";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { getDate } from "src/utils";
import PrintButton from "src/reusable/buttons/PrintButton";
import ImagesViewer from "src/reusable/ImagesViewer";
import CommentsQueries from "src/views/comments/CommentsQueries";
import CommentsList from "src/views/comments/CommentsList";

const InternalMaintenanceDetails = ({ match }) => {
  const { t, i18n } = useTranslation();
  const [engineer, setEngineer] = useState();
  const [visitDate, setVisitDate] = useState();
  const history = useHistory();

  const { error, loading, data } = useQuery(GetReportDetails, {
    variables: {
      reportId: match.params.id,
    },
  });

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData,
  } = useSubscription(CommentsQueries.internal.get, {
    variables: { reportId: match.params.id },
  });

  const [saveAppointment, { loading: updating }] = useMutation(SetAppointment, {
    onCompleted: () => {
      history.goBack();
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

  const onSubmit = () => {
    saveAppointment({
      variables: {
        id: data.report.id,
        engineer: engineer,
        visit_date: visitDate,
      },
    });
  };
  const minDate = new Date();

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("internalMaintenanceDetails")} </CNavbarBrand>

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
                schema="internal_maintainance"
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
                  <b>{t("orderType")}</b>
                </td>
                <td>
                  <CBadge
                    style={{ fontSize: 13 }}
                    color={data.report.orderType == "0" ? "warning" : "danger"}
                  >
                    {" "}
                    {data.report.orderType == "0"
                      ? "New Item"
                      : "Maintenance"}{" "}
                  </CBadge>
                </td>
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

              {data.report.engineer && (
                <>
                  <tr>
                    <td>
                      <b> {t("engineer")} :</b>
                    </td>
                    <td>{data.report.engineer.display_name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>{t("visitDate")}:</b>
                    </td>
                    <td>{data.report.visit_date}</td>
                  </tr>
                </>
              )}
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
                {/* <CButton
                  color="primary"
                  variant="outline"
                  shape="pill"
                  size="md"
                  onClick={() => {}}
                >
                  <span></span>
                  <FiMessageCircle width={60} /> {t("discussion")}
                </CButton> */}
              </div>
            </div>
            <pre />
            <h3 className="report-section-header">
              <FiInfo /> {data.report.title}
            </h3>
            <p style={{ padding: 25 }}>{data.report.description}</p>
            <ImagesViewer images={data.report.images.split(",")} />
            {!data.report.engineer && (
              <>
                <br />
                <h5 style={{ margin: 10 }}>
                  <FiUserCheck /> {"   "}
                  {t("setAppointmentforThisOrder")}
                  <hr />
                </h5>
                <CFormGroup row>
                  <CCol md="6" lg="6" sm="12">
                    <CLabel style={{ marginLeft: 10, marginRight: 10 }}>
                      <b> Engineer</b>
                    </CLabel>
                    <MaintenanceEngineersDropDown
                      engineer={engineer}
                      setEngineer={(eng) => setEngineer(eng)}
                    />
                  </CCol>
                  <CCol style={{ paddingTop: 8 }} md="6" lg="6" sm="12">
                    <CLabel>
                      <b>{t("visitDate")}</b>
                    </CLabel>
                    <br />
                    <DatePicker
                      minDate={minDate}
                      className="form-control col-12"
                      selected={visitDate}
                      onChange={(date) => setVisitDate(date)}
                    />
                    {updating ? (
                      <p>Saving .. </p>
                    ) : (
                      <CButton
                        onClick={onSubmit}
                        active
                        color="success"
                        className="mr-2 ml-2"
                      >
                        {t("setAppointment")}
                      </CButton>
                    )}
                  </CCol>
                </CFormGroup>
              </>
            )}

            {commentsLoading ? (
              <Loader />
            ) : commentsError ? (
              <Error />
            ) : (
              <CommentsList
                comments={commentsData.comments}
                mutation={CommentsQueries.internal.insert}
                rootVars={{ reportId: match.params.id }}
              />
            )}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

InternalMaintenanceDetails.propTypes = {};

export default withTranslation()(InternalMaintenanceDetails);
