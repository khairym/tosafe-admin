import React, { useEffect, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CLabel,
  CProgress,
  CRow,
} from "@coreui/react";
import MainChartExample from "../charts/MainChartExample.js";
import { useTranslation, withTranslation } from "react-i18next";
import {
  CChartBar,
  CChartDoughnut,
  CChartPolarArea,
} from "@coreui/react-chartjs";
import { useQuery } from "@apollo/react-hooks";
import { GetDashboardStatistics } from "./DashboardQuery.js";
import Loader from "src/reusable/Loader.js";
import Error from "src/reusable/Error.js";
import { hexToRgba } from "@coreui/utils";
import Axios from "../../axios";
import { parseId } from "src/utils.js";
import { Link } from "react-router-dom";
import RiskAssessmentMeasures from "../risk/risk-list/RiskAssessmentMeasures";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [quotas, setQuotas] = useState([0, 0]);
  const [orgInfo, setOrgInfo] = useState({});
  const { error, loading, data } = useQuery(GetDashboardStatistics, {
    pollInterval: 10000,
  });

  const id = parseId();

  useEffect(() => {
    function fetchData() {
      Axios(null, "organizations/quota/" + id, "GET")
        .then((response) => {
          setQuotas([
            response.data.consumedQuota,
            response.data.quota - response.data.consumedQuota,
          ]);
        })
        .catch((err) => {
          console.log("err ---", err);
        });
      Axios(null, "organizations/" + id, "GET")
        .then((response) => {
          const org = response.data;
          delete org.subscriptionHistory;

          setOrgInfo(org);
        })
        .catch((err) => {
          console.log("err ---", err);
        });
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  let totalPeriodic = 0,
    totalRisk = 0,
    totalTraining = 0,
    totalIncidents = 0,
    totalEmergency = 0,
    totalInternal = 0,
    totalExternal = 0;

  const { branches_reports: branches, technichal_departments } = data;

  console.log(branches);

  const departmentsReportChartValues = [];
  const departmentsReportChartLabels = [];

  for (let i = 0; i < technichal_departments.length; i++) {
    const t = technichal_departments[i];
    departmentsReportChartLabels.push(t.name_en);
    departmentsReportChartValues.push(
      t.report_departments_aggregate.aggregate.count
    );
  }

  const branchReportChartValues = [];
  const branchReportChartLabels = [];
  const fullDataBranchesReports = [];

  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    totalRisk += b.risk.aggregate.count;
    totalPeriodic += b.monthely.aggregate.count;
    totalTraining += b.training.aggregate.count;
    totalIncidents += b.incident.aggregate.count;
    totalInternal += b.internal.aggregate.count;
    totalExternal += b.external.aggregate.count;
    totalEmergency += b.emergency.aggregate.count;

    const allBranchReports =
      b.monthely.aggregate.count +
      b.risk.aggregate.count +
      b.training.aggregate.count +
      b.incident.aggregate.count +
      b.emergency.aggregate.count +
      b.internal.aggregate.count +
      b.external.aggregate.count;

    branchReportChartValues.push(allBranchReports);
    branchReportChartLabels.push(i18n.language == "ar" ? b.name : b.name_en);

    const color = getRandomColor();
    fullDataBranchesReports.push({
      label: i18n.language == "ar" ? b.name : b.name_en,
      backgroundColor: hexToRgba(color, 10),
      borderColor: color,
      pointHoverBackgroundColor: color,
      borderWidth: 2,
      data: [
        b.monthely.aggregate.count,
        b.training.aggregate.count,
        b.risk.aggregate.count,
        b.incident.aggregate.count,
        b.internal.aggregate.count,
        b.external.aggregate.count,
        b.emergency.aggregate.count,
      ],
    });
  }

  const allReports =
    totalPeriodic +
    totalRisk +
    totalTraining +
    totalIncidents +
    totalEmergency +
    totalInternal +
    totalExternal;

  return (
    <>
      <CCard>
        <CRow>
          <CCol>
            <img src={orgInfo.logo} alt="" className="w-100 h-100" />
          </CCol>
          <CCol md="6" style={{ padding: 34 }}>
            <h1>
              {t("welcome")}, {orgInfo.name}{" "}
            </h1>
            <div style={{ padding: 8 }}>
              <CLabel>
                <b style={{ fontSize: 19 }}>{t("yourCurrentPlanis")} :</b>{" "}
                <CBadge style={{ padding: 10, fontSize: 19 }} color="light">
                  {orgInfo.activeSubscription &&
                    orgInfo.activeSubscription.plan}
                </CBadge>
              </CLabel>
              <br />

              <CLabel>
                <b>{t("yourSubscriptionEndsAt")} :</b>{" "}
                <span style={{ fontSize: 16, fontWeight: "bolder" }}>
                  {orgInfo.activeSubscription &&
                    orgInfo.activeSubscription.endsAt.split("T")[0]}
                </span>
              </CLabel>
            </div>
          </CCol>
          <CCol md="4">
            <CChartDoughnut
              datasets={[
                {
                  backgroundColor: ["#00D8FF", "#F0F0F4"],
                  data: quotas,
                },
              ]}
              labels={[t("consumedQuota"), t("balance")]}
              options={{
                tooltips: {
                  enabled: true,
                },
              }}
            />
            <center>
              <b>
                {quotas[0]} / {quotas[0] + quotas[1]} {t("ofUsersConsumed")}
              </b>
            </center>
          </CCol>
        </CRow>
      </CCard>
      <RiskAssessmentMeasures />
      <CRow>
        <CCol md="6">
          <CCard>
            <CCardBody>
              <div>
                <h4 id="traffic" className="card-title mb-0">
                  {t("reportsCountOverBranches")}
                </h4>
                <div className="small text-muted">
                  {t("totalReportCountOverBranches")}
                </div>
              </div>
              <CChartBar
                datasets={[
                  {
                    label: t("reports"),
                    backgroundColor: "#f87979",
                    data: branchReportChartValues,
                  },
                ]}
                labels={branchReportChartLabels}
                options={{
                  tooltips: {
                    enabled: true,
                  },
                }}
              />
            </CCardBody>{" "}
          </CCard>{" "}
        </CCol>
        <CCol md="6">
          <CCard>
            <CCardBody>
              <div>
                <h4 id="traffic" className="card-title mb-0">
                  {t("reportsCountforTechDepartments")}
                </h4>
                <div className="small text-muted">
                  {t("totalReportCountforeachDepartment")}
                </div>
              </div>
              <CChartPolarArea
                datasets={[
                  {
                    label: t("departmentCount"),
                    backgroundColor: "rgba(179,181,198,0.2)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "rgba(179,181,198,1)",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: departmentsReportChartValues,
                  },
                ]}
                options={{
                  aspectRatio: 1.5,
                  tooltips: {
                    enabled: true,
                  },
                }}
                labels={departmentsReportChartLabels}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <div>
            <h4 id="traffic" className="card-title mb-0">
              {t("reportsSummaryforBranches")}
            </h4>
            <div className="small text-muted">
              {t("totalReportCountOverBranches")}
            </div>
          </div>
          <MainChartExample
            datasets={fullDataBranchesReports}
            style={{ height: "300px", marginTop: "40px" }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <Link to="/periodic">
                <div className="text-muted">{t("periodic")}</div>
                <strong>
                  {totalPeriodic} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  color="success"
                  value={(totalPeriodic / allReports) * 100}
                />
              </Link>
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <Link to="/risk">
                <div className="text-muted">{t("riskAssessment")}</div>
                <strong>
                  {totalRisk} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  color="success"
                  value={(totalRisk / allReports) * 100}
                />
              </Link>
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <Link to="/training">
                <div className="text-muted">{t("training")}</div>
                <strong>
                  {totalTraining} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  color="info"
                  value={(totalTraining / allReports) * 100}
                />
              </Link>
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <Link to="/incident">
                <div className="text-muted">{t("incident")}</div>
                <strong>
                  {totalIncidents} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  color="warning"
                  value={(totalIncidents / allReports) * 100}
                />
              </Link>
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <Link to="/emergency">
                <div className="text-muted">{t("emergency")}</div>
                <strong>
                  {totalEmergency} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  color="danger"
                  value={(totalEmergency / allReports) * 100}
                />
              </Link>
            </CCol>

            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <Link to="/internal">
                <div className="text-muted">{t("internal")}</div>
                <strong>
                  {totalInternal} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  value={(totalInternal / allReports) * 100}
                />{" "}
              </Link>
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <Link to="/external">
                <div className="text-muted">{t("external")}</div>
                <strong>
                  {totalExternal} {t("reports")}
                </strong>
                <CProgress
                  className="progress-xs mt-2"
                  precision={1}
                  value={(totalExternal / allReports) * 100}
                />
              </Link>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>{" "}
    </>
  );
};

export default withTranslation()(Dashboard);
