import { useQuery } from "@apollo/react-hooks";
import CIcon from "@coreui/icons-react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarBrand,
  CCollapse,
  CNavbarNav,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { FiInfo, FiList, FiMessageCircle } from "react-icons/fi";
import { Table } from "reactstrap";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import PrintButton from "src/reusable/buttons/PrintButton";
import { getDate } from "src/utils";
import { GetIncidentDetails } from "./IncidentQuery";
import ImagesViewer from "src/reusable/ImagesViewer";

const IncidentDetails = ({ match }) => {
  const { error, loading, data } = useQuery(GetIncidentDetails, {
    variables: { reportId: match.params.id },
  });
  const { t, i18n } = useTranslation();
  if (error) {
    console.log(error);
    return <Error />;
  }
  if (loading) return <Loader />;

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />

          <CNavbarBrand>
            {t("incidentReportDetails")} [ {data.report.branch.name_en} ]
          </CNavbarBrand>
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
                schema="incident"
                name="report"
              />
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="4" lg="3" sm="12">
            <h5 className="report-section-header">
              <FiInfo /> {t("generalInformation")}
            </h5>
            <Table responsive>
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
                {/* <CButton
                  color="primary"
                  variant="outline"
                  shape="pill"
                  size="md"
                  onClick={() => {}}
                >
                  <span></span>
                  <FiMessageCircle width={60} />
                  {" "}
                  {t("discussion")}
                </CButton> */}
              </div>
            </div>
            <pre />
            <div>
              <hr />
              <h4 className="text-center">{t("filledByEmployee")}</h4>
              <hr />

              <ul style={{ listStyleType: "⇨ " }}>
                <li className="question">
                  <b>{t("reporting")} </b>
                  {data.report.report_for ? (
                    <p>{t("fire")}</p>
                  ) : (
                    <p>{t("incident")}</p>
                  )}
                </li>

                <li className="question">
                  <b>{t("toldAManager")} </b>
                  {data.report.reported_for_manager ? (
                    <p>{t("yes")}</p>
                  ) : (
                    <p>{t("no")}</p>
                  )}
                </li>

                <li className="question">
                  <b>{t("timeAndDate")} </b>
                  <p>{getDate(data.report.incident_date)}</p>
                </li>

                <li className="question">
                  <b>{t("nameOfWitnesses")}</b>
                  <p>{data.report.witnesses_names}</p>
                </li>

                <li className="question">
                  <b>{t("whereItHappen")}</b>
                  <p>{data.report.occurence_location}</p>
                </li>

                <li className="question">
                  <b> {t("whatWereYouDoing")} </b>
                  <p>{data.report.what_were_you_doing}</p>
                </li>

                <li className="question">
                  <b>{t("detailsDescription")}</b>
                  <p>{data.report.incident_description}</p>
                </li>

                <li className="question">
                  <b>{t("actionTowardIncident")}</b>
                  <p>{data.report.your_action}</p>
                </li>

                <li className="question">
                  <b>{t("anyOneInjured")}</b>
                  {data.report.anyone_injured ? (
                    <p>{t("yes")}</p>
                  ) : (
                    <p>{t("no")}</p>
                  )}
                </li>

                <li className="question">
                  <b> {t("chanceRecurring")} </b>
                  <p>{data.report.chance_of_occurence}</p>
                </li>

                <li className="question">
                  <b> {t("incidentImage")} </b>
                  <div style={{ marginTop: 20 }}>
                    <ImagesViewer images={data.report.images.split(",")} />
                  </div>
                </li>

                <li className="question">
                  <b> {t("employeeSignature")} </b>
                  <br />
                  <img width="120" src={data.report.employee_signature} />
                </li>
              </ul>
              <div
                className="seperator"
                style={{ marginTop: 20, marginBottom: 12 }}
              ></div>
            </div>
            <hr />

            <div style={{ marginTop: 20 }}>
              <h4 className="text-center">{t("filledByBranchManager")}</h4>
              <hr />
              <ul style={{ listStyleType: "⇨ " }}>
                <li className="question">
                  <b> {t("incidentCause")} </b>
                  <p>{data.report.manager_incident_cause}</p>
                </li>

                <li className="question">
                  <b> {t("requireRevision")}</b>
                  {data.report.manager_require_revision ? (
                    <p>{t("yes")}</p>
                  ) : (
                    <p>{t("no")}</p>
                  )}
                </li>

                <li className="question">
                  <b> {t("actionToPervent")} </b>
                  <p>{data.report.manager_action_to_prevent}</p>
                </li>

                <li className="question">
                  <b> {t("managerSignature")} </b>
                  <br />
                  <img width="120" src={data.report.manager_signature} />
                </li>
              </ul>

              <div
                className="seperator"
                style={{ marginTop: 20, marginBottom: 12 }}
              ></div>
            </div>
            <hr />

            <div style={{ marginTop: 20 }}>
              <h4 className="text-center">{t("filledByEngineer")}</h4>
              <hr />

              <ul style={{ listStyleType: "⇨ " }}>
                <li className="question">
                  <b>{t("reportedToSafety")}</b>
                  {data.report.engineer_reported_to_dept ? (
                    <p>{t("yes")}</p>
                  ) : (
                    <p>{t("no")}</p>
                  )}
                </li>

                <li className="question">
                  <b> {t("actionTaken")}</b>
                  <p>{data.report.manager_action_to_prevent}</p>
                </li>
                <li className="question">
                  <b> {t("correctiveActions")} </b>
                  <p>{data.report.engineer_corrective_actions}</p>
                </li>

                <li className="question">
                  <b> {t("engineerSignature")} </b>
                  <br />
                  <img width="120" src={data.report.manager_signature} />
                </li>
              </ul>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default withTranslation()(IncidentDetails);
