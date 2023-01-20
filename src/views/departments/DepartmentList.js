import React, { useState } from "react";
import {
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CToggler,
  CCard,
  CButtonGroup,
  CButton,
  CDataTable,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { useMutation, useSubscription } from "react-apollo";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import {
  GetDepartmentsList,
  DepartmentTriggerNeglact,
} from "./departmnet-query/DepartmentQuery";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { getDate } from "src/utils";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";

function DepartmentList() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [isNeglected, setIsNeglected] = useState(false);

  const { loading, error, data } = useSubscription(GetDepartmentsList, {
    variables: { isNeglected: isNeglected },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];

  const fields = ["name", "name_en", "created_at", "updated_at", "actions"];

  return (
    <div>
      <CCard>
        <CCardHeader>
          <CNavbar expandable="sm" color="faded" light>
            <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
            <CIcon name="cil-list" customClasses="c-sidebar-nav-icon" />
            <CNavbarBrand>{t("TechDep")}</CNavbarBrand>
            <CCollapse
              show={isOpen}
              navbar
              style={{ justifyContent: "flex-end", display: "flex" }}
            >
              <CNavbarNav className="ml">
                <Link to="/technical/:id">
                  <CButton color="info" className="mr-1 ml-1">
                    <FiPlus />
                    <span>{t("createNewDepartment")}</span>
                  </CButton>
                </Link>
                <CButtonGroup className="float-right mr-3">
                  {statuses.map((item) => (
                    <CButton
                      color="outline-secondary"
                      key={item.name}
                      className="mx-0"
                      onClick={() => setIsNeglected(item.value)}
                      active={item.value == isNeglected}
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
            items={data.organization_technical_department}
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
            }}
            columnHeaderSlot={{
              name: `${t("nameAr")}`,
              name_en: `${t("nameEn")}`,
              created_at: `${t("created_at")}`,
              updated_at: `${t("updatedAt")}`,
              actions: t("actions"),
            }}
            scopedSlots={{
              created_at: (item) => <td>{getDate(item.created_at)}</td>,
              updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
              actions: (item, index) => {
                return (
                  <td className="py-2">
                    <Link to={`technical/${item.id}`}>
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
                      mutation={DepartmentTriggerNeglact}
                      variables={{
                        departmentID: item.id,
                        isNegelected: !item.isNeglected,
                      }}
                      refetch={() => {
                        setIsNeglected(!isNeglected);
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
}

export default withTranslation()(DepartmentList);
