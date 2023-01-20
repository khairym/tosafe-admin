import React from "react";
import { CSelect } from "@coreui/react";
import { useSubscription } from "react-apollo";
import Loader from "../Loader";
import Error from "../Error";
import { useTranslation, withTranslation } from "react-i18next";
import { InternalMaintenanceEngineers } from "src/views/maintaince/internal-maintaince/QInternalMaintaince";

const MaintenanceEngineersDropDown = ({ engineer, setEngineer }) => {
  const { loading, error, data } = useSubscription(
    InternalMaintenanceEngineers
  );
  const { t } = useTranslation();

  if (loading) return <Loader />;
  if (error) return <Error />;

  const engineers = [
    { id: "", display_name: t("allEngineers") },
    ...data.engineers,
  ];
  return (
    <CSelect
      custom
      className="mb-3"
      name="engineer"
      id="engineer"
      onChange={(event) => {
        setEngineer(event.target.value);
      }}
      value={engineer}
    >
      {/* <option selected disabled>
        {t("selectEngineer")}
      </option> */}
      {engineers.map((item) => (
        <option key={item.id} value={item.id}>
          {item.display_name}
        </option>
      ))}
    </CSelect>
  );
};

export default withTranslation()(MaintenanceEngineersDropDown);
