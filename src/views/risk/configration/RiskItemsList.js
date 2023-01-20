import React, { useState } from "react";
import { useSubscription, useQuery, useMutation } from "react-apollo";
import {
  triggerNeglectedRiskItems,
  GetItemsCategoryRisk,
} from "../risk-query/RiskListQuery";
import {
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CCard,
  CButton,
  CDataTable,
  CCollapse,
  CButtonGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { getDate } from "src/utils";
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";
import NoData from "src/reusable/NoData";
import CreateUpdateRiskItems from "./CreateUpdateRiskItems";

function RiskItems(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [isNeglected, setIsNeglected] = useState(false);

  const { t } = useTranslation();

  const { loading, error, data } = useSubscription(GetItemsCategoryRisk, {
    variables: { category_id: props.match.params.id, isNeglected: isNeglected },
  });

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];

  const fields = ["title", "title_en", "updated_at", "actions"];
  let body;

  if (loading) body = <Loader />;
  else if (error) body = <Error />;
  else if (!data || !data.risk_assessment_items.length) {
    body = <NoData />;
  } else
    body = (
      <CDataTable
        items={data.risk_assessment_items}
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
          title: `${t("nameAr")}`,
          title_en: `${t("nameEn")}`,
          actions: `${t("actions")}`,
          updated_at: `${t("updatedAt")}`,
        }}
        scopedSlots={{
          percentage: (item) => <td>{item.percentage}</td>,
          created_at: (item) => <td>{getDate(item.created_at)}</td>,
          updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
          actions: (item, index) => (
            <td>
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  setIsOpen(true);
                  setCurrentItem(item);
                }}
              >
                {t("edit")}
              </CButton>{" "}
              <TriggerNeglectButton
                mutation={triggerNeglectedRiskItems}
                refetch={() => {
                  setIsNeglected(!isNeglected);
                }}
                isNegelected={item.is_neglected}
                variables={{
                  ItemId: item.id,
                  isNegelected: !item.is_neglected,
                }}
              />{" "}
              <CButton
                to={`/risk-item-non-normal-status/${item.id}`}
                color="info"
                shape="square"
                size="sm"
                onClick={() => {}}
              >
                {t("noneNormalState")}
              </CButton>
            </td>
          ),
        }}
      />
    );

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("riskItemsCategories")}</CNavbarBrand>

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
          <CreateUpdateRiskItems
            categoryId={props.match.params.id}
            item={currentItem}
            onFinish={() => {
              setIsOpen(false);
              setCurrentItem();
            }}
          />
        )}
        {body}
      </CCardBody>
    </CCard>
  );
}

export default RiskItems;
