import { useQuery } from "@apollo/react-hooks";
import { CCard, CCardBody, CRow, CCol } from "@coreui/react";
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import { RiskAssessmentPercentagePerBranch } from "../risk-query/RiskListQuery";

const RiskAssessmentMeasures = () => {
  const { loading, error, data } = useQuery(RiskAssessmentPercentagePerBranch);
  const { t, i18n } = useTranslation();

  if (loading) return <Loader />;
  if (error) return <Error />;

  const labels = [];
  const percentages = [];
  for (let i = 0; i < data.branches.length; i++) {
    const branch = data.branches[i];
    let categoriesPercentageMap = {};
    let catItemsPercentageMap = {};
    let reportItemPercentageMap = {};
    let systemTotalPercentage = 0.0;
    let totalCatPercentage = 0.0;
    // getting system configurations .
    const report = branch.latest_report[0];

    labels.push(
      `${i18n.language === "ar" ? branch.name : branch.name_en} (${
        report ? report.created_at.split("T")[0] : "No Reports"
      })`
    );

    if (branch.branch_items.length == 0 || !report || report.length == 0) {
      percentages.push(0);
      continue;
    }

    const reportDetails = report.report_details;

    for (let k = 0; k < reportDetails.length; k++) {
      const det = reportDetails[k];
      reportItemPercentageMap[det.item_id] = det.status;
    }

    for (let b = 0; b < branch.branch_items.length; b++) {
      const item = branch.branch_items[b];
      const catPercentage = item.category.precentage;
      const itmPercentage = item.percentage;

      const isNormal = reportItemPercentageMap[item.item_id];

      if (catPercentage === 0) continue;

      if (!categoriesPercentageMap[item.category_id]) {
        categoriesPercentageMap[item.category_id] = catPercentage;
        totalCatPercentage += catPercentage;
        catItemsPercentageMap[item.category_id] = itmPercentage;
      } else {
        catItemsPercentageMap[item.category_id] += itmPercentage;
      }

      if (isNormal)
        systemTotalPercentage += (itmPercentage / 100) * catPercentage;
    }

    // finalize ...
    for (const c in categoriesPercentageMap) {
      if (Object.hasOwnProperty.call(categoriesPercentageMap, c)) {
        const catPercentage = categoriesPercentageMap[c];
        const theRest = 100 - catItemsPercentageMap[c];

        if (theRest) systemTotalPercentage += (theRest / 100) * catPercentage;
      }
    }

    systemTotalPercentage += 100 - totalCatPercentage;
    percentages.push(systemTotalPercentage);
  }
  const categoriesPercentages = percentages.filter((f) => f != 0);
  let safetyPercentage = 0,
    safetyTotal = 0,
    riskPercentage = 0;
  const totalPercentages = categoriesPercentages.length * 100;

  categoriesPercentages.forEach((p) => {
    safetyTotal += p;
  });

  safetyPercentage = Math.round((safetyTotal / totalPercentages) * 100);

  riskPercentage = Math.round(
    ((totalPercentages - safetyTotal) / totalPercentages) * 100
  );

  return (
    <CCard>
      <CCardBody>
        <div>
          <h4 id="traffic" className="card-title mb-0">
            {t("safetyIndicators")}
          </h4>
          <div className="small text-muted">
            {t("safetyIndicatorsDescription")}
          </div>
        </div>

        <CRow>
          <CCol md="5">
            <CChartDoughnut
              style={{ paddingTop: 50 }}
              datasets={[
                {
                  backgroundColor: ["#0ca99f", "#f87979"],
                  data: [safetyPercentage, riskPercentage],
                },
              ]}
              labels={[t("safetyPercentage"), t("riskPercentage")]}
              options={{
                tooltips: {
                  enabled: true,
                },
              }}
            />
            {/* <center>
              <b>{t("ofUsersConsumed")}</b>
            </center> */}
          </CCol>
          <CCol md="7">
            <CChartBar
              height="80px"
              datasets={[
                {
                  label: t("safetyIndicators"),
                  backgroundColor: "#0ca99f",
                  data: percentages,
                },
              ]}
              labels={labels}
              options={{
                tooltips: {
                  enabled: true,
                },
              }}
            />
          </CCol>
        </CRow>
      </CCardBody>{" "}
    </CCard>
  );
};

export default RiskAssessmentMeasures;
