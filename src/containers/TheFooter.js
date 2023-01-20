import React from 'react'
import { CFooter } from '@coreui/react'
import {useTranslation, withTranslation} from "react-i18next"
import packageJson from '../../package.json';
 
const TheFooter = () => {
  const {t} = useTranslation();

  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://tosafeapp.com" target="_blank" rel="noopener noreferrer">{t("toSafe")}</a>
        <span className="ml-1"> - Version ({packageJson.version}) &copy; 2021  .</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">{t("poweredBy")}</span>
        <a href="https://trendsgcc.com" target="_blank" rel="noopener noreferrer">{t("trendsGCC")}</a>
      </div>
    </CFooter>
  )
}

export default React.memo(withTranslation()(TheFooter))
