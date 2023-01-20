import React, { useState } from "react";
import {
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CToggler,
  CDataTable,
  CCard,
  CButton,
  CButtonGroup,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { useMutation, useSubscription } from "react-apollo";
import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  GetBranches,
  TriggerBranchNeglect,
} from "./branch-query/BranchQueries";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";

function BranchList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNeglected, setIsNeglected] = useState(false);
  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];
  const { t } = useTranslation();

  const { loading, error, data } = useSubscription(GetBranches, {
    variables: { isNeglected: isNeglected },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const fields = ["name", "name_en", "user", "branch_number", "actions"];

  return (
    <div>
      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
            <CIcon name="cil-list" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("branches")}</CNavbarBrand>
            <CCollapse
              show={isOpen}
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                <Link to="/branch/:id">
                  <CButton color="info" className="mr-1 ml-1">
                    <FiPlus />
                    <span>{t("createBranch")}</span>
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
          <CDataTable
            items={data.organization_branch}
            fields={fields}
            striped
            columnFilter
            itemsPerPage={10}
            hover
            sorter
            pagination
            columnFilterSlot={{
              actions: (item) => <th> `${t("actions")}`</th>,
            }}
            columnHeaderSlot={{
              name: t("nameAr"),
              name_en: t("nameEn"),
              user: t("branchManager"),
              branch_number: t("branchNumber"),
              actions: t("actions"),
              updated_at: t("updatedAt"),
            }}
            scopedSlots={{
              // neighborhood: (item) => <td>{item.neighborhood.name}</td>,
              user: (item) => <td>{item.user?.display_name}</td>,
              actions: (item, index) => {
                return (
                  <td className="py-2">
                    <Link to={`branch/${item.id}`}>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          // toggleDetails(index);
                        }}
                      >
                        {t("edit")}
                      </CButton>
                    </Link>{" "}
                    <TriggerNeglectButton
                      mutation={TriggerBranchNeglect}
                      refetch={() => {
                        setIsNeglected(!isNeglected);
                      }}
                      variables={{
                        branchId: item.id,
                        isNegelected: !item.isNeglected,
                      }}
                    />
                    <CButton
                      color="dark"
                      to={`/branch/settings/${item.id}/${item.name}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // toggleDetails(index);
                      }}
                    >
                      <CIcon size={20} name="cil-settings" />
                      {t("settings")}
                    </CButton>
                  </td>
                );
              },
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
}

export default withTranslation()(BranchList);
