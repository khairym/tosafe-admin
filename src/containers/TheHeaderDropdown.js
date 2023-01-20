import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { withTranslation, useTranslation } from "react-i18next";
import { FaLanguage } from "react-icons/fa";

const TheHeaderDropdown = () => {
  const user = JSON.parse(localStorage.getItem("orgAdmin"));
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    localStorage.setItem("lang", lng);
    window.location.reload();
    // i18n.changeLanguage(lng);
  };
  const language = i18n.language;

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={user.avatar}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>{t("account")}</strong>
        </CDropdownItem>

        <CDropdownItem>
          <Link to="/settings">
            <CIcon name="cil-settings" className="mfe-2" />
            {t("settings")}
          </Link>
        </CDropdownItem>

        <CDropdownItem
          onClick={() => changeLanguage(language === "ar" ? "en" : "ar")}
        >
          <FaLanguage className="mfe-2" />
          {language === "ar" ? "Switch to English" : "التغيير للغة العربية"}
        </CDropdownItem>

        <CDropdownItem divider />
        <CDropdownItem
          onClick={() => {
            localStorage.removeItem("orgAdmin");
            window.location.reload();
          }}
        >
          <CIcon name="cil-lock-locked" className="mfe-2" />
          {t("logOut")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default withTranslation()(TheHeaderDropdown);
