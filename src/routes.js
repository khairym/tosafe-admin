import React from "react";
import i18n from "./i18n";

const Viewer = React.lazy(() =>
  import("./views/pdf-viewer/viewer")
);
const CompaniesMaintainOrganization = React.lazy(() =>
  import("./views/companies/CompaniesMaintainOrganization")
);

const Categories = React.lazy(() =>
  import("./views/risk/configration/CategoriesList")
);

const RiskItems = React.lazy(() =>
  import("./views/risk/configration/RiskItemsList")
);
const NoneNormalState = React.lazy(() =>
  import("./views/risk/configration/NoneNormalStateList")
);
const PeriodicCategories = React.lazy(() =>
  import("./views/periodic/periodic-configration/PeriodicCategoriesList")
);
const PeriodicItems = React.lazy(() =>
  import("./views/periodic/periodic-configration/PeriodicItemsList")
);
const MaintainceConfigration = React.lazy(() =>
  import(
    "./views/maintaince/external-maintaince/Maintaince-configration/MaintainceConfigration"
  )
);
const MaintainceItems = React.lazy(() =>
  import(
    "./views/maintaince/external-maintaince/Maintaince-configration/MaintainceItems"
  )
);

const EmergencyDetails = React.lazy(() =>
  import("./views/emergancy/EmergencyDetails")
);

const UpdateOrganizationInfo = React.lazy(() =>
  import("./views/pages/settings/Settings")
);

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/users/Users"));
const CreateUser = React.lazy(() => import("./views/users/CreateUser"));

const PeriodicList = React.lazy(() => import("./views/periodic/PeriodicList"));
const PeriodicDetails = React.lazy(() =>
  import("./views/periodic/periodic-details/PeriodicDetails")
);

const RiskList = React.lazy(() => import("./views/risk/risk-list/RiskList"));

const RiskDetails = React.lazy(() =>
  import("./views/risk/risk-details/RiskDetails")
);

const TrainingList = React.lazy(() =>
  import("./views/training/training-list/TariningList")
);

const TrainingDetails = React.lazy(() =>
  import("./views/training/TrainingDetails")
);

const Branches = React.lazy(() => import("./views/branches/BranchList"));

const CreateUpdateBranch = React.lazy(() =>
  import("./views/branches/CreateUpdateBranch")
);

const BranchSettings = React.lazy(() =>
  import("./views/branches/BranchSettings")
);

const DepartmentList = React.lazy(() =>
  import("./views/departments/DepartmentList")
);
const InternalMaintainceList = React.lazy(() =>
  import("./views/maintaince/internal-maintaince/InternalMaintainceList")
);

const InternalMaintenanceDetails = React.lazy(() =>
  import("./views/maintaince/internal-maintaince/InternalMaintenanceDetails")
);
const ExternalMaintainceList = React.lazy(() =>
  import("./views/maintaince/external-maintaince/ExternalMaintainceList")
);

const ExternalMaintenanceDetails = React.lazy(() =>
  import("./views/maintaince/external-maintaince/ExternalMaintainenceDetails")
);

const SparePartsStatistics = React.lazy(() =>
  import("./views/maintaince/external-maintaince/SparePartsStatistics")
);
const EmergancyList = React.lazy(() =>
  import("./views/emergancy/EmergancyList")
);
const ComplaimentList = React.lazy(() =>
  import("./views/complaiment/ComplaimentList")
);

const ComplaintsDetails = React.lazy(() =>
  import("./views/complaiment/ComplaintsDetails")
);

const IncidentList = React.lazy(() => import("./views/incident/IncidentList"));
const IncidentDetails = React.lazy(() =>
  import("./views/incident/IncidentDetails")
);

const CreateUpdateDepartment = React.lazy(() =>
  import("./views/departments/departmnet-query/CreateUpdateDepartment")
);

const routes = [
  { path: "/", exact: true, name: i18n.t("home") },
  {
    path: "/settings",
    exact: true,
    name: i18n.t("home"),
    component: UpdateOrganizationInfo,
  },
  {
    path: "/dashboard",
    name: i18n.t("dashboard"),
    component: Dashboard,
    exact: true,
  },
  {
    path: "/periodic",
    name: i18n.t("periodic"),
    component: PeriodicList,
    exact: true,
  },
  {
    path: "/periodic-categories",
    name: i18n.t("periodicCategories"),
    component: PeriodicCategories,
    exact: true,
  },
  {
    path: "/periodic-category-items/:id",
    name: i18n.t("periodicItemsCategories"),
    component: PeriodicItems,
    exact: true,
  },
  {
    path: "/periodic/:reportId/:branchId",
    name: i18n.t("periodicReportDetails"),
    component: PeriodicDetails,
    exact: true,
  },
  {
    path: "/incident",
    name: i18n.t("incident"),
    component: IncidentList,
    exact: true,
  },
  {
    path: "/incident/:id",
    name: i18n.t("incident"),
    component: IncidentDetails,
    exact: true,
  },
  { path: "/risk", name: i18n.t("risk"), component: RiskList, exact: true },
  {
    path: "/risk/:reportId/:branchId",
    name: "Risk Report Details",
    component: RiskDetails,
    exact: true,
  },
  {
    path: "/training",
    name: i18n.t("training"),
    component: TrainingList,
    exact: true,
  },
  {
    path: "/training/:id",
    name: i18n.t("trainingDetails"),
    component: TrainingDetails,
    exact: true,
  },
  {
    path: "/technical",
    name: i18n.t("TechDeps"),
    component: DepartmentList,
    exact: true,
  },
  {
    path: "/technical/:id",
    name: i18n.t("TechDep"),
    component: CreateUpdateDepartment,
    exact: true,
  },
  {
    path: "/internal",
    name: i18n.t("internalMaintaince"),
    component: InternalMaintainceList,
    exact: true,
  },
  {
    path: "/internal/:id",
    name: i18n.t("internalMaintainceDetails"),
    component: InternalMaintenanceDetails,
    exact: true,
  },
  {
    path: "/external",
    name: i18n.t("externalMaintainance"),
    component: ExternalMaintainceList,
    exact: true,
  },
  {
    path: "/external/:id",
    name: i18n.t("externalMaintainance"),
    component: ExternalMaintenanceDetails,
    exact: true,
  },
  {
    path: "/companies",
    name: i18n.t("maintainanceCompany"),
    component: CompaniesMaintainOrganization,
    exact: true,
  },
  {
    path: "/spare-parts",
    name: i18n.t("externalMaintainceCategories"),
    component: MaintainceConfigration,
    exact: true,
  },
  {
    path: "/spare-parts/:id",
    name: i18n.t("externalMaintainceItems"),
    component: MaintainceItems,
    exact: true,
  },
  // {
  //   path: "/comments/:id",
  //   name: "Comments",
  //   component: Comment,
  //   exact: true,
  // },
  {
    path: "/spare-parts-statistics",
    name: i18n.t("sparePartsStatisticsperBranch"),
    component: SparePartsStatistics,
    exact: true,
  },
  {
    path: "/spare-parts-drta",
    name: i18n.t("sparePartsStatisticsperBranch"),
    component: SparePartsStatistics,
    exact: true,
  },
  {
    path: "/emergency",
    name: i18n.t("emergancyReport"),
    component: EmergancyList,
    exact: true,
  },
  {
    path: "/emergency/:id",
    name: i18n.t("emergancyReport"),
    component: EmergencyDetails,
    exact: true,
  },
  {
    path: "/complaints",
    name: i18n.t("complaintsReport"),
    component: ComplaimentList,
    exact: true,
  },
  {
    path: "/complaints/:id",
    name: i18n.t("complaintsReport"),
    component: ComplaintsDetails,
    exact: true,
  },
  {
    path: "/risk-categories",
    name: i18n.t("riskCategories"),
    component: Categories,
    exact: true,
  },
  {
    path: "/risk-category/:id/items",
    name: i18n.t("riskItemsCategories"),
    component: RiskItems,
    exact: true,
  },
  {
    path: "/risk-item-non-normal-status/:id",
    exact: true,
    name: i18n.t("riskItemesNoneNormalState"),
    component: NoneNormalState,
  },
  {
    path: "/training",
    name: i18n.t("training"),
    component: TrainingList,
    exact: true,
  },
  {
    path: "/branches",
    name: i18n.t("branches"),
    component: Branches,
    exact: true,
  },
  {
    path: "/branch/:id",
    name: i18n.t("branch"),
    component: CreateUpdateBranch,
    exact: true,
  },
  {
    path: "/branch/settings/:id/:name",
    name: i18n.t("branchSettings"),
    component: BranchSettings,
    exact: true,
  },
  { path: "/users", exact: true, name: i18n.t("users"), component: Users },
  {
    path: "/create-user",
    exact: true,
    name: i18n.t("createNewUser"),
    component: CreateUser,
  },
  {
    path: "/users/:id/:master",
    exact: true,
    name: i18n.t("editUser"),
    component: CreateUser,
  },
  {
    path: "/viewer",
    exact: true,
    name: i18n.t("Report Viewer"),
    component: Viewer,
  },
];

export default routes;
