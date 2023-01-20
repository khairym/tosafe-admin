import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useTranslation, withTranslation} from "react-i18next"

const TheHeaderDropdownNotif = () => {
  const itemsCount = 5
  const {t} = useTranslation()
  
  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        <CBadge shape="pill" color="danger">{itemsCount}</CBadge>
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>{t("youHave")} {itemsCount} {t("notifications")}</strong>
        </CDropdownItem>
        <CDropdownItem><CIcon name="cil-user-follow" className="mr-2 text-success" /> {t("newUserRegistered")}</CDropdownItem>
        <CDropdownItem><CIcon name="cil-user-unfollow" className="mr-2 text-danger" /> {t("userDeleted")}</CDropdownItem>
        <CDropdownItem><CIcon name="cil-chart-pie" className="mr-2 text-info" /> {t("salesReportIsReady")}</CDropdownItem>
        <CDropdownItem><CIcon name="cil-basket" className="mr-2 text-primary" /> {t("newClient")}</CDropdownItem>
        <CDropdownItem><CIcon name="cil-speedometer" className="mr-2 text-warning" /> {t("serverOverloaded")}</CDropdownItem>
        <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>{t("server")}</strong>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>{t("cpuUsage")}</b></small>
          </div>
          <CProgress size="xs" color="info" value={25} />
          <small className="text-muted">348 {t("processes")}. 1/4 {t("cores")}.</small>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>{t("memoryUsage")}</b></small>
          </div>
          <CProgress size="xs" color="warning" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>SSD 1 {t("usage")}</b></small>
          </div>
          <CProgress size="xs" color="danger" value={90} />
          <small className="text-muted">243GB/256GB</small>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default withTranslation()(TheHeaderDropdownNotif)