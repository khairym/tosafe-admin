import {
  CCard,
  CCol,
  CCardHeader,
  CNavItem,
  CNavLink,
  CTabPane,
  CTabContent,
  CCardBody,
  CTabs,
  CNav,
} from "@coreui/react";
import React from "react";
import Companies from "./settings/Companies";
import PeriodicItems from "./settings/PeriodicItems";
import RiskItems from "./settings/RiskItems";
import { withTranslation, useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";

const BranchSettings = ({ match }) => {
  const { t } = useTranslation();
  return (
    <CCol xs="12" md="12" className="mb-4">
      <CCard>
        <CCardHeader>
          <h3>
            <FiSettings /> {" "}
            {t("branchSettings")} [{match.params.name}]
          </h3>
        </CCardHeader>
        <CCardBody>
          <CTabs>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>{t("maintainanceCompany")}</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>{t("periodicItems")}</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>{t("riskItems")}</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane>
                <pre />
                <Companies id={match.params.id} />
              </CTabPane>
              <CTabPane>
                <PeriodicItems id={match.params.id} />
              </CTabPane>
              <CTabPane>
                <RiskItems id={match.params.id} />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default withTranslation()(BranchSettings);
