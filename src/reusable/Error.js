import React from "react";
import {useTranslation, withTranslation} from "react-i18next"

let style = {
  div: {
    position: "relative",
    top: "65%",
    fontSize: "20px",
    fontWeight: "700",
    textAlign: "center",
  },
  img: {},
};

const ErrorComponent = ({ num = 1 }) => {
  const {t} = useTranslation()
  return (
    <div style={style.div}>
      <div style={{ fontSize: "150px" }}>
        <i className="fa fa-plug" aria-hidden="true"></i>
      </div>
      <div>
        {t("error")} )-:
        <br />
        {t("pleaseTryAgainOrContactTechSupport")}
      </div>
    </div>
  );
}
export default withTranslation()(ErrorComponent);
