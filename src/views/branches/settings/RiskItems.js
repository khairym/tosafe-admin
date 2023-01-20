import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
  CRow,
  CCol,
  CButton,
  CInput,
  CContainer,
  CFormGroup,
  CInputGroup,
  CInputGroupAppend,
} from "@coreui/react";
import React, { useState } from "react";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";

import {
  GetBranchRiskItems,
  InsertBranchRiskItem,
  RemoveRiskItem,
  UpdateBranchRiskItem,
} from "../branch-query/BranchQueries";
import { withTranslation, useTranslation } from "react-i18next";
import { FaAdjust, FaCheckSquare, FaClock, FaSquare } from "react-icons/fa";
import { FiPercent } from "react-icons/fi";

const RiskItems = ({ id }) => {
  const { t, i18n } = useTranslation();
  const [incremental, setIncremental] = useState(0);
  const { loading, error, data, refetch } = useQuery(GetBranchRiskItems, {
    variables: {
      branchId: id,
    },
    pollInterval: 1000,
  });

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  const selectedItems = data.items.map((c) => c.item_id);
  const idPercentageMap = {};
  data.items.forEach((element, index) => {
    idPercentageMap[element.item_id] = element.percentage;
  });

  const filteredCategories = data.categories.filter((c) => c.items.length);

  return (
    <div>
      <br />

      <ol>
        {filteredCategories.map((cat) => {
          let totalPercentage = 0;
          cat.items.forEach((itm) => {
            console.log(idPercentageMap[itm.id]);
            totalPercentage += idPercentageMap[itm.id]
              ? idPercentageMap[itm.id]
              : 0;
          });
          const restPercentage = 100 - totalPercentage;

          return (
            <>
              <CRow
                style={{
                  backgroundColor: "grey",
                  color: "wheat",
                  padding: 10,
                  paddingBottom: 5,
                }}
              >
                <CCol md="9">
                  <h4>
                    {" "}
                    <FaAdjust />{" "}
                    {i18n.language == "en" ? cat.name_en : cat.name}
                  </h4>
                </CCol>
                <CCol>
                  <h4>{cat.precentage} %</h4>
                </CCol>
              </CRow>
              <ol>
                {cat.items.map((itm) => {
                  const isInBranch = selectedItems.indexOf(itm.id) > -1;
                  console.log(itm.id);
                  return (
                    <AddRemovePeriodicItems
                      t={t}
                      percentage={idPercentageMap[itm.id]}
                      maxPercentageAvailable={restPercentage}
                      isInBranch={isInBranch}
                      categoryId={cat.id}
                      itemId={itm.id}
                      branchId={id}
                      name={i18n.language == "en" ? itm.name_en : itm.name}
                      refetch={() => {
                        setIncremental(incremental + 1);
                        refetch();
                      }}
                    />
                  );
                })}
              </ol>
            </>
          );
        })}
      </ol>
    </div>
  );
};

export const AddRemovePeriodicItems = ({
  t,
  isInBranch,
  maxPercentageAvailable,
  percentage,
  categoryId,
  itemId,
  branchId,
  name,
  refetch,
}) => {
  const [checked, setChecked] = useState(isInBranch);
  const [percent, setPercent] = useState(percentage || 0);
  const [editing, setEditing] = useState(!isInBranch);
  const [onAdd, { loading: addLoading }] = useMutation(InsertBranchRiskItem, {
    onCompleted: (da) => {
      refetch();
      setEditing(false);
    },
  });

  const [onUpdate, { loading: editLoading }] = useMutation(
    UpdateBranchRiskItem,
    {
      onCompleted: (da) => {
        refetch();
        setEditing(false);
      },
    }
  );

  const [onRemove, { loading: removeLoading }] = useMutation(RemoveRiskItem, {
    onCompleted: (da) => {
      refetch();
      setEditing(false);
    },
  });

  const maxPercentage = isInBranch
    ? percentage + maxPercentageAvailable
    : maxPercentageAvailable;

  return (
    <CContainer style={{ paddingTop: 10 }}>
      <CRow>
        <CCol md="8">
          <h6>
            <CButton
              disabled={!editing}
              onClick={() => {
                setChecked(!checked);
              }}
            >
              {" "}
              {addLoading || removeLoading ? (
                <FaClock size={20} />
              ) : checked ? (
                <FaCheckSquare size={20} />
              ) : (
                <FaSquare size={20} />
              )}
              {"   "}
              {name}
            </CButton>
          </h6>
        </CCol>
        <CCol md="2">
          <CFormGroup>
            <CInputGroup>
              <CInput
                disabled={!editing}
                type="number"
                max={maxPercentage}
                min={0}
                value={percent}
                onChange={(e) => {
                  if (e.target.value <= maxPercentage)
                    setPercent(e.target.value);
                }}
              />
              <CInputGroupAppend>
                <CButton
                  disabled={true}
                  style={{ height: "35px" }}
                  color="secondary"
                >
                  <FiPercent />
                  {/* <b>%</b> */}
                </CButton>
              </CInputGroupAppend>
            </CInputGroup>
          </CFormGroup>
        </CCol>
        <CCol>
          {isInBranch && !editing ? (
            <CButton
              color="success"
              disabled={addLoading || removeLoading}
              onClick={() => {
                // on edit ..
                setEditing(true);
              }}
            >
              {t("edit")}
            </CButton>
          ) : (
            <CButton
              color="info"
              disabled={
                addLoading ||
                removeLoading ||
                (!checked && !isInBranch) ||
                percent == 0
              }
              onClick={() => {
                if (checked) {
                  if (isInBranch) {
                    // update .. .

                    onUpdate({
                      variables: {
                        categoryId: categoryId,
                        itemId: itemId,
                        branchId: branchId,
                        percentage: percent,
                      },
                    });
                  } else {
                    // add ..

                    onAdd({
                      variables: {
                        categoryId: categoryId,
                        itemId: itemId,
                        branchId: branchId,
                        percentage: percent,
                      },
                    });
                  }
                } else {
                  if (isInBranch) {
                    onRemove({
                      variables: {
                        categoryId: categoryId,
                        itemId: itemId,
                        branchId: branchId,
                      },
                    });
                  }
                }
              }}
            >
              {t("save")}
            </CButton>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};
export default withTranslation()(RiskItems);
