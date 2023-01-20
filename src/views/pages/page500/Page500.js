import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useTranslation, withTranslation } from "react-i18next";

const Page500 = () => {
const { t } = useTranslation();

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <span className="clearfix">
              <h1 className="float-left display-3 mr-4">500</h1>
              {/* <h4 className="pt-3">{t('houstonwehaveaproblem')}</h4> */}
              {/* <p className="text-muted float-left">{t('thepageyouarelookingforistemporarilyunavailable')}</p> */}
            </span>
            <CInputGroup className="input-prepend">
              <CInputGroupPrepend>
                <CInputGroupText>
                  <CIcon name="cil-magnifying-glass" />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput size="16" type="text" placeholder={`${t("whatAreYouLookingFor")}?`} />
              <CInputGroupAppend>
                {/* <CButton color="info">{t('search')}</CButton> */}
              </CInputGroupAppend>
            </CInputGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default withTranslation()(Page500)
