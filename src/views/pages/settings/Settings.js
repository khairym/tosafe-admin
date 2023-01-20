import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CSelect,
  CTextarea,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";

import ImageUploading from "react-images-uploading";
import { FiPlusSquare } from "react-icons/fi";
import Axios from "../../../axios";
import Loader from "src/reusable/Loader";
import { parseId } from "src/utils";
import { withTranslation, useTranslation } from "react-i18next";
import OrganizationSettings from "./OrganizationSettings";
import ChangePassword from "./ChangePassword";

const UpdateOrganizationInfo = (data) => {
  const { t } = useTranslation();





  return (

    <CCol xs="12" md="12" className="mb-4">
      <CCard>
        <CCardHeader>
          <h3> {t("settings")}</h3>
        </CCardHeader>
        <CCardBody>
          <CTabs>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>{t("yourOrganizationSettings")}</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>{t("changePassword")}</CNavLink>
              </CNavItem>

            </CNav>
            <CTabContent>
              <CTabPane>
                <OrganizationSettings />
              </CTabPane>
              <CTabPane>
                <ChangePassword />
              </CTabPane>

            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </CCol>



  );
};

export default withTranslation()(UpdateOrganizationInfo);
