import React, { useState } from "react";
import { useSubscription } from "react-apollo";
import {
  GetNoneNormalState,
  NoneNormalStateTrigger,
} from "../risk-query/RiskListQuery";
import {
  CCollapse,
  CDataTable,
  CCardBody,
  CCardHeader,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CCard,
  CButton,
  CButtonGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { getDate } from "src/utils";
import { FiPlus } from "react-icons/fi";
import TriggerNeglectButton from "src/reusable/buttons/TriggerNeglectButton";
import NoData from "src/reusable/NoData";
import CreateUpdateNonNormState from "./CreateUpdateNonNormalState";

function NoneNormalState(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [nonNormal, setNonNormal] = useState();

  const { t } = useTranslation();
  const [isNeglected, setIsNeglected] = useState(false);

  const { loading, error, data } = useSubscription(GetNoneNormalState, {
    variables: { itemId: props.match.params.id, isNegelected: isNeglected },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const statuses = [
    { name: "active", value: false },
    { name: "neglected", value: true },
  ];

  const fields = ["title", "title_en", "created_at", "updated_at", "actions"];
  let body;

  if (loading) body = <Loader />;
  else if (error) body = <Error />;
  // else if (!data || !data.risk_assessment_item_non_normal_state.length) {
  //   body = <NoData />;
  // }
   else
    body = (
      <CDataTable
        items={data.risk_assessment_item_non_normal_state}
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
          created_at: `${t("createdAt")}`,
          updated_at: `${t("updatedAt")}`,
          actions: `${t("actions")}`,
        }}
        scopedSlots={{
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
                  setNonNormal(item);
                }}
              >
                {t("edit")}
              </CButton>{" "}
              <TriggerNeglectButton
                mutation={NoneNormalStateTrigger}
                variables={{
                  ItemId: item.id,
                  isNegelected: !item.is_neglected,
                }}
                isNegelected={item.is_neglected}
                refetch={() => {
                  setIsNeglected(!isNeglected);
                }}
              />{" "}
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
          <CNavbarBrand>{t("riskItemesNoneNormalState")} </CNavbarBrand>
          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <CButton
                color="info"
                onClick={() => {
                  setIsOpen(true);
                }}
                className="mr-1 ml-1"
              >
                <FiPlus />
                <span>{t("createNewNonNormalStatus")}</span>
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
          <CreateUpdateNonNormState
            itemId={props.match.params.id}
            nonNormal={nonNormal}
            onFinish={() => {
              setIsOpen(false);
              setNonNormal();
            }}
          />
        )}
        {body}
      </CCardBody>
    </CCard>
  );
}

export default withTranslation()(NoneNormalState);
