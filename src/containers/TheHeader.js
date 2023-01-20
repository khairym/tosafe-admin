import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import packageJson from "../../package.json";

// routes config
import routes from "../routes";

import { TheHeaderDropdown } from "./index";
import { withTranslation, useTranslation } from "react-i18next";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const { t } = useTranslation();

  // const changeLanguage = (lng) => {
  //   localStorage.setItem("lang", lng);
  //   i18n.changeLanguage(lng);
  //   document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  // };

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  // const setLang = async lang => {
  //   await localStorage.setItem('lang', lang).then(() => {
  //     console.log('lang', lang);
  //   });
  // };
  const user = JSON.parse(localStorage.getItem("orgAdmin"));

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <img
          style={{ width: 110 }}
          src="https://storage.googleapis.com/to-safe/assets/logo_transparent.png"
          alt=""
        />
      </CHeaderBrand>
      <span style={{paddingTop:17}}>version-{packageJson.version}</span>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/dashboard">{t("dashboard")}</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/users">{t("users")}</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>{t("settings")}</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <b>{user.displayName}</b>
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          {/* <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink> */}
          <CLink
            className="c-subheader-nav-link"
            aria-current="page"
            to="/dashboard"
          >
            <CIcon name="cil-graph" alt={"dashboard"} />
            &nbsp;{t("dashboard")}
          </CLink>
          <CLink to="/settings" className="c-subheader-nav-link">
            <CIcon name="cil-settings" alt={t("settings")} />
            &nbsp;{t("settings")}
          </CLink>
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default withTranslation()(TheHeader);
