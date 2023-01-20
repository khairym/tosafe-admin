import React, { useState } from "react";
import { useSubscription, useMutation } from "react-apollo";
import {
  CRow,
  CCol,
  CDataTable,
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CButtonGroup,
  CCard,
  CButton,
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { PeriodicCats, TriggerPeriodic } from "../periodic-query/PeriodicQuery";
import { getDate } from "src/utils";
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";
import NoData from "src/reusable/NoData";
import CreateUpdatePeriodicCats from "./CreateUpdatePeriodicCategories";

const PeriodicCategoriesList = (props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState();
  const [isNeglected, setIsNeglected] = useState(false);

  const { loading, error, data } = useSubscription(PeriodicCats, {
    variables: { isNeglected: isNeglected },
  });

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];

  const fields = ["name", "name_en", "created_at", "updated_at", "actions"];
  let body;
  if (loading) body = <Loader />;
  else if (error) body = <Error />;
  else if (!data || !data.monthely_categories.length) {
    body = <NoData />;
    console.log(!data, !data.length, data.length);
  } else
    body = (
      <CDataTable
        items={data.monthely_categories}
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
          name: `${t("nameAr")}`,
          name_en: `${t("nameEn")}`,
          created_at: `${t("createdAt")}`,
          updated_at: `${t("updatedAt")}`,
          actions: `${t("actions")}`,
        }}
        scopedSlots={{
          created_at: (item) => <td>{getDate(item.created_at)}</td>,
          updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
          actions: (item, index) => {
            return (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    // toggleDetails(index);
                    setIsOpen(true);
                    setCategory(item);
                  }}
                >
                  {t("edit")}
                </CButton>
                {" "}
                <CButton
                  color="info"
                  to={`/periodic-category-items/${item.id}`}
                  shape="square"
                  size="sm"
                  onClick={() => {}}
                >
                  {t("view")}
                </CButton>{" "}
                <TriggerNeglectButton
                  mutation={TriggerPeriodic}
                  variables={{
                    ItemId: item.id,
                    isNegelected: !item.isNegelected,
                  }}
                  isNegelected={item.is_neglected}
                  refetch={() => {
                    setIsNeglected(!isNeglected);
                  }}
                />
              </td>
            );
          },
        }}
      />
    );

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("periodicCategories")}</CNavbarBrand>
          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <CButton
                onClick={() => {
                  setIsOpen(true);
                }}
                color="info"
                className="mr-1 ml-1"
              >
                <FiPlus />
                <span>{t("createNewCategory")}</span>
              </CButton>

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
        {isOpen && (
          <CreateUpdatePeriodicCats
            category={category}
            onFinish={() => {
              setIsOpen(false);
              setCategory();
            }}
          />
        )}
        {body}
      </CCardBody>
    </CCard>
  );
};

export default withTranslation()(PeriodicCategoriesList);
