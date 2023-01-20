import React from "react";
import CIcon from "@coreui/icons-react";
import i18n from "../i18n";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaBuilding, FaFireAlt } from "react-icons/fa";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("dashboard"),
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavTitle",
    _children: [i18n.t("reports")],
    module: [
      "609f1905b120024ba18f3793",
      "609f1951b120024ba18f3796",
      "609f0955db30ee45d0a60bde",
      "609f19a1b120024ba18f37a4",
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("periodicReports"),
    module: "609f1905b120024ba18f3793",
    to: "/periodic",
    icon: <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("riskReport"),
    module: "609f1951b120024ba18f3796",
    to: "/risk",
    icon: "cil-tags",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("traiiningReport"),
    to: "/training",
    module: "609f0955db30ee45d0a60bde",
    icon: "cil-layers",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("incidentReport"),
    to: "/incident",
    module: "609f19a1b120024ba18f37a4",
    icon: <FaFireAlt className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavTitle",
    _children: [i18n.t("maintain")],
    module: ["609f1a36b120024ba18f37aa", "609f1a5ab120024ba18f37ad"],
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("internalMaintenance"),
    to: "/internal",
    module: "609f1a36b120024ba18f37aa",
    icon: <FiArrowRight className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("externalMaintainance"),
    to: "/external",
    module: "609f1a5ab120024ba18f37ad",
    icon: <FiArrowLeft className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("sparePartsStatistics"),
    to: "/spare-parts-statistics",
    module: "609f1a5ab120024ba18f37ad",
    icon: <CIcon name="cil-chartPie" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavTitle",
    _children: [i18n.t("miscellaneous")],
    module: ["609f1dfcb120024ba18f37b3"],
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("emergancyReport"),
    to: "/emergency",
    module: "609f1dfcb120024ba18f37b3",
    icon: "cil-chevron-top",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("complaintsReport"),
    to: "/complaints",
    module: "60ec1d540c427d0032580abd",
    icon: "cil-credit-card",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: [i18n.t("settings")],
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("users"),
    to: "/users",
    icon: "cil-user-follow",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("technicalDepartment"),
    to: "/technical",
    module: "609f1dfcb120024ba18f37b3",
    icon: "cil-lightbulb",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("branches"),
    to: "/branches",
    icon: "cil-list",
  },
  {
    _tag: "CSidebarNavItem",
    name: i18n.t("maintainanceCompany"),
    to: "/companies",
    module: "609f1a5ab120024ba18f37ad",
    icon: <FaBuilding className="c-sidebar-nav-icon" />,
  },
];

export default _nav;
