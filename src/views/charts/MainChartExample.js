import React from "react";
import { CChartLine } from "@coreui/react-chartjs";
// import { getStyle, hexToRgba } from "@coreui/utils";
import { withTranslation, useTranslation } from "react-i18next";

// const brandSuccess = getStyle("success") || "#4dbd74";
// const brandInfo = getStyle("info") || "#20a8d8";
// const brandDanger = getStyle("danger") || "#f86c6b";

const MainChartExample = (attributes) => {
  const { t } = useTranslation();
  // const random = (min, max) => {
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // };

  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              // stepSize: Math.ceil(250 / 5),
              // max: 250,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };
  })();

  // render
  return (
    <CChartLine
      {...attributes}
      // datasets={defaultDatasets}
      options={defaultOptions}
      labels={[
        t("periodic"),
        t("training"),
        t("riskAssessment"),
        t("incident"),
        t("internal"),
        t("external"),
        t("emergency"),
      ]}
    />
  );
};

export default withTranslation()(MainChartExample);
