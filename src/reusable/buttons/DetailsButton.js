import { CButton } from "@coreui/react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";

const DetailsButton = ({ to }) => {
  const { t } = useTranslation();
  return (
    <CButton  color="info" shape="square" size="sm" to={to}>
      {t("reportDetails")}
    </CButton>
  );
};

export default withTranslation()(DetailsButton);
