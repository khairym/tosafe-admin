import { CButton } from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiMessageCircle } from "react-icons/fi";

const DiscussionButton = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <CButton
      color="dark"
      shape="pill"
      size="md"
      onClick={onClick}
    >
      <FiMessageCircle width={60} /> {t("discussion")}
    </CButton>
  );
};

export default DiscussionButton;
