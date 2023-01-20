import React, { useEffect, useState } from "react";
import {
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CDataTable,
  CCard,
  CCardGroup,
  CWidgetProgressIcon,
  CButton,
  CButtonGroup,
  CBadge,
  CRow,
  CCol,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { useQuery, useSubscription } from "react-apollo";
import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { FiPlus } from "react-icons/fi";
import {
  TriggerUserNeglect,
  GetOrganizationUsers,
  GetUserBranch,
  GetUserDepartment,
} from "./UsersQueries";
import UserGroupsDropDown from "src/reusable/filters/UserGroupsDropDown";
import Axios from "../../axios";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { parseId } from "src/utils";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";

const UserBelongsTo = ({ user_group, belongsTo }) => {
  const { t } = useTranslation();

  const isBranch =
    user_group === "branch_employee" || user_group === "branch_manager";

  const isDepartment = user_group === "tech_user";

  const { loading, error, data } = useQuery(
    isBranch ? GetUserBranch : GetUserDepartment,
    { variables: { id: belongsTo } }
  );

  if (loading) return <p>{t("loading")}</p>;

  if (error || (!isBranch && !isDepartment)) {
    return (
      <CBadge style={{ padding: 10 }} color="light">
        (Not Provided)
      </CBadge>
    );
  }

  return (
    <CBadge style={{ padding: 10 }} color={isBranch ? "primary" : "success"}>
      {isBranch ? t("Branch:") : t("departments")}{" "}
      {data.belongs ? data.belongs.name_en : t("notFound")}
    </CBadge>
  );
};

const Users = () => {
  const [isNeglected, setIsNeglected] = useState(true);
  const [userGroup, setUserGroup] = useState('');
  const [quotas, setQuotas] = useState([0, 0]);

  const statuses = [
    { name: "active", value: true },
    { name: "neglected", value: false },
  ];

  const { t } = useTranslation();

  const filter = {
    is_activated: { _eq: isNeglected },
  };
  if (userGroup !== "all") filter["user_group"] = { _eq: userGroup };
  const { loading, error, data } = useSubscription(GetOrganizationUsers, {
    variables: {
      filter: filter,
    },
  });

  function fetchData() {
    Axios(null, "organizations/quota/" + parseId(), "GET")
      .then((response) => {
        setQuotas([
          response.data.consumedQuota,
          response.data.quota - response.data.consumedQuota,
        ]);
      })
      .catch((err) => {
        console.log("err ---", err);
      });
  }

  useEffect(() => {
    fetchData();
  }, [ ]);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  const fields = [
    "avatar",
    "display_name",
    "employeeNumber",
    "permission_group",
    "belongsTo",
    "actions",
  ];

  return (
    <div>
      {" "}
      <CCardGroup>
        <CChartDoughnut
          style={{ backgroundColor: "ThreeDHighlight" }}
          datasets={[
            {
              backgroundColor: ["#00D8FF", "#F0F0F4"],
              data: quotas,
            },
          ]}
          labels={[t("consumedQuota"), t("balance")]}
          options={{
            tooltips: {
              enabled: true,
            },
          }}
        />
        <CWidgetProgressIcon
          header={data.branch_users.aggregate.count}
          text={t("branchUsers")}
          color="gradient-info"
          style={{ fontSize: 12 }}
          inverse
        >
          <CIcon name="cil-people" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon
          header={data.maintainence_engineers.aggregate.count}
          text={t("maintenanceEngineer")}
          style={{ fontSize: 12 }}
          color="gradient-success"
          inverse
        >
          <CIcon name="cil-settings" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon
          header={data.tech_user.aggregate.count}
          text={t("techuser")}
          style={{ fontSize: 12 }}
          color="gradient-warning"
          inverse
        >
          <CIcon name="cil-basket" height="36" />
        </CWidgetProgressIcon>
        <CWidgetProgressIcon
          header={data.safety_engineers.aggregate.count}
          text={t("safetyEngineer")}
          style={{ fontSize: 12 }}
          color="gradient-primary"
          inverse
        >
          <CIcon name="cil-chartPie" height="36" />
        </CWidgetProgressIcon>
      </CCardGroup>
      <CCard>
        <CRow>
          <CCol md="8"></CCol>
          <CCol md="4">
            {/* <center>
              <b>
                {quotas[0]} / {quotas[1]} of Users Consumed
              </b>
            </center> */}
          </CCol>
        </CRow>
      </CCard>
      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CIcon name="cil-list" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("users")}</CNavbarBrand>
            <CCollapse
              show={true}
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml pull-left">
                <Link to="/create-user">
                  <CButton color="info" className="mr-1 ml-1">
                    <FiPlus />
                    <span>{t("addNewUser")}</span>
                  </CButton>
                </Link>

                <CButtonGroup className="float-right mr-3">
                  {statuses.map((item) => (
                    <CButton
                      color="outline-secondary"
                      key={item.name}
                      className="mx-0"
                      onClick={() => setIsNeglected(item.value)}
                      active={item.value === isNeglected}
                    >
                      {t(item.name)}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="5">
              <UserGroupsDropDown
                group={userGroup}
                setGroup={(group) => setUserGroup(group)}
              />
            </CCol>
            <CCol md="7"></CCol>
          </CRow>

          <CDataTable
            items={data.users}
            fields={fields}
            striped
            columnFilter
            // tableFilter
            // footer
            // itemsPerPageSelect
            itemsPerPage={10}
            hover
            sorter
            pagination
            columnFilterSlot={{
              actions: (item) => <th> `${t("actions")}`</th>,
              avatar: (item) => <th> `${t("avatar")}`</th>,
              belongsTo: (item) => <th> `${t("belongsTo")}`</th>,
              permission_group: (item) => <th></th>,
            }}
            columnHeaderSlot={{
              avatar: t("avatar"),
              employeeNumber: t("empNumber"),
              display_name: t("displayName"),
              actions: t("actions"),
              permission_group: t("permissions"),
              belongsTo: t("belongsTo"),
            }}
            scopedSlots={{
              avatar: (item) => (
                <div style={{ margin: 10 }} className="c-avatar">
                  <img
                    src={item.avatar}
                    className="c-avatar-img"
                    alt="admin@bootstrapmaster.com"
                  />
                  {/* <span className="c-avatar-status bg-success"></span> */}
                </div>
              ),
              permission_group: (item) => (
                <td>
                  <CBadge style={{ padding: 10 }} color="light">
                    {item.permission_group?.title}
                  </CBadge>
                </td>
              ),
              employeeNumber: (item) => (
                <td>
                  <CBadge style={{ padding: 10 }} color="light">
                    {item.employeeNumber
                      ? item.employeeNumber
                      : t("notProvided")}
                  </CBadge>
                </td>
              ),
              belongsTo: (item) => {
                return (
                  <td>
                    {item.belongsTo ? (
                      <UserBelongsTo
                        user_group={item.user_group}
                        belongsTo={item.belongsTo}
                      />
                    ) : (
                      <CBadge style={{ padding: 10 }} color="light">
                        {t("notProvided")}
                      </CBadge>
                    )}
                  </td>
                );
              },
              actions: (item, index) => {
                return (
                  <td className="py-2">
                    <CButton
                      to={`users/${item.id}/${item.master_ref}`}
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      onClick={() => {
                        // toggleDetails(index);
                      }}
                    >
                      {t("edit")}
                    </CButton>{" "}
                    <TriggerNeglectButton
                      refetch={() => {
                        setIsNeglected(!isNeglected);
                      }}
                      mutation={TriggerUserNeglect}
                      variables={{
                        userId: item.id,
                        masterRef: item.master_ref,
                        isNegelected: !item.is_activated,
                      }}
                    />
                  </td>
                );
              },
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default withTranslation()(Users);
