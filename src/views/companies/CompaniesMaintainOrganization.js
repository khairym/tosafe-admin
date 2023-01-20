import React from "react";
import { useTranslation } from "react-i18next";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import { FaCheck, FaClock, FaList, FaWrench } from "react-icons/fa";
import OtherCompanies from "./OtherCompanies";
import CompaniesInTheSystem from "./CompaniesInTheSystem";

const CompaniesMaintainOrganization = () => {
  const { t } = useTranslation();

  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
            <h5>
              <FaWrench /> {t("companyMaintainOrgHeader")}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CompaniesInTheSystem
              isConfirmed={true}
              title={
                <h5>
                  <FaCheck /> {t("companiesSubscribed")}
                </h5>
              }
            />

            <CompaniesInTheSystem
              isConfirmed={false}
              title={
                <h5>
                  <FaClock /> {t("companiesUnderReview")}
                </h5>
              }
            />

            <OtherCompanies
              title={
                <h5>
                  <FaList /> {t("companiesNotSubscribed")}
                </h5>
              }
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CompaniesMaintainOrganization;
