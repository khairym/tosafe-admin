import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import { withTranslation } from "react-i18next";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const currentModules =
    JSON.parse(localStorage.getItem("orgAdmin")).modules || [];


  const filteredNav = navigation.filter((n) => {
    if (n._tag == "CSidebarNavTitle" && n.module) {
      var intersection = currentModules.filter(function (c) {
        return n.module.indexOf(c) !== -1;
      });
      return intersection.length > 0;
    } else if (n.module) {
      return currentModules.indexOf(n.module) > -1;
    } else {
      return true;
    }
  });

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand
        style={{ background: "white" }}
        className="d-md-down-none"
        to="/"
      >
        <img
          style={{ width: 121 }}
          src="https://storage.googleapis.com/to-safe/assets/logo_transparent.png"
          alt=""
        />

        {/* <span>{t("toSafeOrganizationAdmin")}</span> */}
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={filteredNav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(withTranslation()(TheSidebar));
