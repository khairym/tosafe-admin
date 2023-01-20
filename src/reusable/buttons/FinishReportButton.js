import { useMutation } from "@apollo/react-hooks";
import { CButton } from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaWindowClose } from "react-icons/fa";
import Loader from "../Loader";

const FinishReportButton = ({ mutation, variables, refetch }) => {
  const [trigger, { data, loading }] = useMutation(mutation, {
    onCompleted: () => {
      refetch();
    },
  });
  
  const { t } = useTranslation();
  if (loading) return <Loader />;

  return (
    <CButton
      color="danger"
      shape="outline"
      size="md"
      onClick={() => {
        trigger({
          variables: variables,
        });
      }}
    >
      <FaWindowClose width={60} /> {t("finishReport")}
    </CButton>
  );
};

export default FinishReportButton;
