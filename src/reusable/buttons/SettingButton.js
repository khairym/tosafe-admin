import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";

const SettingButton = ({ to, size = "sm" }) => {
  const { t } = useTranslation();
  return (
    <CButton color="dark" to={to}   size={size}>
      <CIcon size={size} name="cil-settings" /> {" "}
      {t("settings")}
    </CButton>
  );
};

export default withTranslation()(SettingButton);
