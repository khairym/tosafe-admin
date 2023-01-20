import React, { useState } from "react";
import { useSubscription, useMutation } from "react-apollo";
import {
  GetRiskCategories,
  TriggerCatigoriesRisk,
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
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";
import CreateUpdateRiskCategories from "./CreateUpdateRiskCategories";
import NoData from "src/reusable/NoData";

function Categories(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNeglected, setIsNeglected] = useState(false);
  const [category, setCategory] = useState();
  const [maxPercentageAvailable, setMaxPercentageAvailable] = useState();

  const { t } = useTranslation();
  const { loading, error, data } = useSubscription(GetRiskCategories, {
    variables: { isNeglected: isNeglected },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      var total = 0;
      for (var i in data.risk_assessment_category) {
        total += data.risk_assessment_category[i].precentage;
      }
      setMaxPercentageAvailable(100 - total);
    },
  });
  if (loading) return <Loader />;
  if (error) return <Error />;

  const getDate = (isoDate) => {
    let date = new Date(isoDate).toLocaleString();
    date = date
      .split(",")[0]
      .split("/")
      .map((dat) => (dat < 10 && "0" + dat) || dat);
    date = date[1] + "/" + date[0] + "/" + date[2];

    return date;
  };

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];
  const fields = [
    "name",
    "name_en",
    // "created_at",
    "updated_at",
    "precentage",
    "actions",
  ];
  let body;

  if (loading) body = <Loader />;
  else if (error) body = <Error />;
  else if (!data || !data.risk_assessment_category.length) {
    body = <NoData />;
  } else
    body = (
      <CDataTable
        items={data.risk_assessment_category}
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
          // created_at: `${t("createdAt")}`,
          updated_at: `${t("updatedAt")}`,
          actions: `${t("actions")}`,
          precentage: `${t("precentage")}`,
        }}
        scopedSlots={{
          // created_at: (item) => <td>{getDate(item.created_at)}</td>,
          updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
          precentage: (item) => <td>{item.precentage} %</td>,
          actions: (item, index) => {
            return (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    setIsOpen(true);
                    setCategory(item);
                  }}
                >
                  {t("edit")}
                </CButton>{" "}
                <TriggerNeglectButton
                  mutation={TriggerCatigoriesRisk}
                  variables={{
                    ItemId: item.id,
                    isNegelected: !item.is_neglected,
                  }}
                  isNegelected={item.is_neglected}
                  refetch={() => {
                    setIsNeglected(!isNeglected);
                  }}
                />{" "}
                <CButton
                  color="info"
                  to={`/risk-category/${item.id}/items`}
                  shape="square"
                  size="sm"
                  onClick={() => {}}
                >
                  {t("view")}
                </CButton>
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
          <CNavbarBrand>{t("riskCategories")}</CNavbarBrand>
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
                <span>{t("createRiskCategory")}</span>
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
          <CreateUpdateRiskCategories
            maxPercentageAvailable={maxPercentageAvailable}
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
}

export default withTranslation()(Categories);
