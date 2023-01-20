import { useMutation } from "@apollo/react-hooks";
import { CButton } from "@coreui/react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "../Loader";

const TriggerNeglectButton = ({
  mutation,
  variables,
  isNegelected,
  refetch,
}) => {
  const { t } = useTranslation();

  const [trigger, { data, loading }] = useMutation(mutation, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading) return <Loader />;

  return (
    <CButton
      color="danger"
      shape="square"
      size="sm"
      onClick={() => {
        trigger({ variables });
      }}
    >
      {isNegelected ? t("restore") : t("markAsDeleted")}
    </CButton>
  );
};

export default withTranslation()(TriggerNeglectButton);
