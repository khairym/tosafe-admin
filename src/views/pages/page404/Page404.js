import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupAppend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useTranslation, withTranslation } from "react-i18next";

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">404</h1>
              <h4 className="pt-3">{t("oops")}! {t("youAreLost")}.</h4>
              {/* <p className="text-muted float-left">{t('thepageyouarelookingforwasnotfound')}</p> */}
            </div>
            <CInputGroup className="input-prepend">
              <CInputGroupPrepend>
                <CInputGroupText>
                  <CIcon name="cil-magnifying-glass" />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput size="16" type="text" placeholder={`${t("whatAreYouLookingFor")}?`} />
              <CInputGroupAppend>
                <CButton color="info">{t("search")}</CButton>
              </CInputGroupAppend>
            </CInputGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default withTranslation()(Page404)
