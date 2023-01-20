import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";

import req from "../../../axios";

function ChangePassword() {
  const [Password, SetPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");

  const [Error, setError] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState("");

  const { t } = useTranslation();
  const history = useHistory();

  function validate() {
    let PasswordErr = Password !== ConfirmPassword ? t("passwordErr") : null;
    return PasswordErr;
  }

  const ChangeNewPassword = async () => {
    const err = validate();

    if (!err) {
      const response = await req(
        {
          password: Password,
          id: JSON.parse(localStorage.getItem("orgAdmin")).masterRef,
        },
        "users/password",
        "POST"
      );
      console.log(response);
      if (response.status === 200) {
        history.push("/dashboard");
      } else {
        setError(true);
        setErrorMsg(response.statusText);
      }
    } else {
      setError(true);
      setErrorMsg(validate());
    }
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>{t("changePassword")}</h1>

                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder={t("password")}
                        autoComplete="password"
                        onChange={(e) => SetPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder={t("confirmPassword")}
                        autoComplete="confrim-password"
                        onChange={(e) => SetConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>

                    {Error ? (
                      <div className="toastFun" style={{ marginBottom: 10 }}>
                        <h5 className="m-0" style={{ color: "red" }}>
                          {ErrorMsg}
                        </h5>
                      </div>
                    ) : null}
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          onClick={ChangeNewPassword}
                          color="primary"
                          className="px-4"
                        >
                          {t("confirm")}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default ChangePassword;
