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
import {
  FiAlertOctagon,
  FiInfo,
  FiList,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";
import { Table } from "reactstrap";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import PrintButton from "src/reusable/buttons/PrintButton";
import { getDate } from "src/utils";
import { GetTrainingDetails } from "./training-query/TrainingListQuery";
import { FaCcAmex, FaCommentsDollar } from "react-icons/fa";

const TrainingDetails = ({ match }) => {
  const { error, loading, data } = useQuery(GetTrainingDetails, {
    variables: { traingId: match.params.id },
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
            {t("trainingDetails")} [ {data.report.branch.name_en} ]
          </CNavbarBrand>
          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <PrintButton
                url={data.report.report_url}
                id={data.report.id}
                branch={data.report.branch.id}
                schema="training"
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
            <div className="text-center">
              <h3>
                {i18n.language == "ar"
                  ? data.report.category_description.title
                  : data.report.category_description.title_en}
              </h3>
            </div>
            <pre />

            <p style={{ fontSize: 15 }}>
              <FiAlertOctagon />{" "}
              {i18n.language == "ar"
                ? data.report.category_description.description
                : data.report.category_description.description_en}
            </p>
            <pre />
            <Table>
              <thead>
                <tr>
                  <th colSpan={2}>
                    <FiUsers /> {t("reportMembers")}
                  </th>
                  <th className="text-center">{t("employeeSignature")}</th>
                </tr>
              </thead>
              {data.report.members.map((emp) => (
                <tr>
                  <td width={70}>
                    <div className="c-avatar">
                      <img
                        src={
                          emp.user.avatar ??
                          `https://ui-avatars.com/api/?name=${emp.user.display_name}&background=random&size=120`
                        }
                        className="c-avatar-img"
                        alt={emp.user.display_name}
                      />
                    </div>
                  </td>
                  <td>
                    <h5>{emp.user.display_name}</h5>
                    <div className="small text-muted">
                      <span>
                        {i18n.language == "ar"
                          ? emp.user.permission_group.title
                          : emp.user.permission_group.title_en}{" "}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <img
                      width={100}
                      src={emp.signature}
                      alt={emp.user.display_name}
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default withTranslation()(TrainingDetails);

{
  /* report: training_report_by_pk(id: $traingId) {
      category_description {
        title_en
        description_en
      }
      members: report_members {
        signature
        training_report_id
        user {
          employeeNumber
          avatar
          display_name
          id
        }
      }
    }
  } */
}
