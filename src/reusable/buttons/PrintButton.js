import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { FiPrinter } from "react-icons/fi";
import { useHistory } from "react-router";


const PrintButton = ({ url, size = "sm", id, branch, schema, name }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [generating, setGenerating] = useState(false);

  return generating ? (
    <p>Generating ..</p>
  ) : (
    <CButton
      color="primary"
      variant="outline"
      shape="square"
      size={size}
      onClick={async () => {
        if (url && url.includes(".pdf")) {
          const tIrl = encodeURIComponent(url);
          history.push(`/viewer?q=${tIrl}`);
        } else {
          setGenerating(true);

          var myHeaders = new Headers();
          myHeaders.append(
            "x-api-key",
            "d2da3448a6812ddfc7bdddb7b6a5e8343f6ad798f8488b0d974b19de660c3ca8"
          );
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            branch_id: branch,
            id: id,
            schema: schema,
            name: name,
          });

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            // redirect: "follow",
          };

          fetch(
            "https://reports.tosafeapp.com/generate-pdf-report",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              setGenerating(false);
              const tIrl = encodeURIComponent(result);
              history.push(`/viewer?q=${tIrl}`);
            })
            .catch((error) => {
              console.log("error", error);
              setGenerating(false);
            });
        }
      }}
    >
      <FiPrinter /> {t("print")}
    </CButton>
  );
};

export default withTranslation()(PrintButton);
