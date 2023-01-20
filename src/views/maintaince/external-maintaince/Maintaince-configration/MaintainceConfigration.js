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
import { Table } from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import {
  GetCategoriesExternalMaintaince,
  TriggerCategories,
} from "../QueryExMaintain";
import { getDate } from "src/utils";
import { FiPlus } from "react-icons/fi";

function TriggerNeglectButton({ ItemId, isNegelected, refetch }) {
  const [trigger, { data, loading }] = useMutation(TriggerCategories, {
    onCompleted: () => {
      refetch();
    },
  });
  if (loading) return <Loader />;
  return (
    <CButton
      color="danger"
      shape="square"
      size="sm"
      onClick={() => {
        trigger({ variables: { ItemId, isNegelected: !isNegelected } });
      }}
    >
      {isNegelected ? "Restore" : "Mark as Deleted"}
    </CButton>
  );
}

const MaintainceConfigration = (props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [isNeglected, setIsNeglected] = useState(false);

  const { loading, error, data } = useSubscription(
    GetCategoriesExternalMaintaince,
    { variables: { isNeglected: isNeglected } }
  );

  if (loading) return <Loader />;
  if (error) return <Error />;

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

  const fields = ["name", "name_en", "created_at", "updated_at", "actions"];

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("externalMaintainceCategories")}</CNavbarBrand>
          <CCollapse
            show={isOpen}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <Link to={{ pathname: "/createUpdateexternalCats/:id" }}>
                <CButton color="info" className="mr-1 ml-1">
                  <FiPlus />
                  <span>{t("createNewCategory")}</span>
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
          items={data.external_maintainance_categories}
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
          }}
          scopedSlots={{
            created_at: (item) => <td>{getDate(item.created_at)}</td>,
            updated_at: (item) => <td>{getDate(item.updated_at)}</td>,
            actions: (item, index) => {
              return (
                <td className="py-2">
                  <Link
                    to={{
                      pathname: `/createUpdateexternalCats/${item.id}`,
                      idss: props.match.params.id,
                    }}
                  >
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      onClick={() => {
                        // toggleDetails(index);
                      }}
                    >
                      Edit
                    </CButton>
                  </Link>
                  {" "}
                  <TriggerNeglectButton
                    ItemId={item.id}
                    isNegelected={item.isNeglected}
                    refetch={() => {
                      setIsNeglected(!isNeglected);
                    }}
                  />
                  <Link to={`/spare-parts/${item.id}`}>
                    <CButton
                      color="info"
                      // variant="outline"
                      shape="square"
                      size="sm"
                      onClick={() => { }}
                    >
                      {t("View")}
                    </CButton>
                  </Link>
                </td>
              );
            },
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default withTranslation()(MaintainceConfigration);
