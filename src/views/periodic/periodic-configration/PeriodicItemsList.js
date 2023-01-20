import React, { useState } from "react";
import { useSubscription, useQuery, useMutation } from "react-apollo";

import {
  CRow,
  CCol,
  CWidgetIcon,
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CBadge,
  CCard,
  CButton,
  CCollapse,
  CButtonGroup,
  CDataTable,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import {
  MontlyItems,
  PeriodicItemsTrigger,
} from "../periodic-query/PeriodicQuery";
import { getDate } from "src/utils";
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";
import NoData from "src/reusable/NoData";
import CreateUpdatePeriodicItems from "./CreateUpdatePeriodicItems";

function PeriodicItems(props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState();
  const [isNeglected, setIsNeglected] = useState(false);

  const { loading, error, data } = useSubscription(MontlyItems, {
    variables: {
      category_id: props.match.params.id,
      isNegelected: isNeglected,
    },
  });
  const fields = [
    "name",
    "name_en", // "created_at",
    "updated_at",
    "images_number",
    "actions",
  ];
  let body;
  if (loading) body = <Loader />;
  else if (error) body = <Error />;
  else if (!data || !data.monthely_items.length) {
    body = <NoData />;
    console.log(!data, !data.length, data.length);
  } else
    body = (
      <CDataTable
        items={data.monthely_items}
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
          images_number: `${t("imageCount")}`,
          updated_at: `${t("updatedAt")}`,
          actions: `${t("actions")}`,
        }}
        scopedSlots={{
          // created_at: (item) => <td>{getDate(item.created_at)}</td>,
          updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
          actions: (item, index) => (
            <td>
              {!item.isNegelected && (
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    console.log(item);
                    setIsOpen(true);
                    setItem(item)
                  }}
                >
                  {t("edit")}
                </CButton>
              )}{" "}
              <TriggerNeglectButton
                mutation={PeriodicItemsTrigger}
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
          ),
        }}
      />
    );

  const getBadge = (status) => {
    switch (status) {
      case "done":
        return "success";
      case "new":
        return "info";
    }
  };

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("periodicItemsCategories")}</CNavbarBrand>
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
                <span>{t("createNewItems")}</span>
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
          <CreateUpdatePeriodicItems
            categoryId={props.match.params.id}
            item={item}
            onFinish={() => {
              setIsOpen(false);
              setItem();
            }}
          />
        )}
        {body}
      </CCardBody>
    </CCard>
  );
}

export default withTranslation()(PeriodicItems);
