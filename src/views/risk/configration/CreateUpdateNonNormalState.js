import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
} from "@coreui/react";

import {
  UpdateNonNormalState,
  AddNoneNormalState,
} from "../risk-query/RiskListQuery";

import { FaEdit, FaPlus } from "react-icons/fa";
import Loader from "src/reusable/Loader";
import { useTranslation } from "react-i18next";

const CreateUpdateNonNormState = ({ nonNormal, itemId, onFinish }) => {
  const [nameAr, setNameAr] = useState(nonNormal?.title);
  const [nameEn, setNameEn] = useState(nonNormal?.title_en);

  const id = isNaN(nonNormal?.id) ? 0 : nonNormal.id;
  const { t } = useTranslation();
  const [save, { loading: saveLoading }] = useMutation(
    id ? UpdateNonNormalState : AddNoneNormalState,
    {
      onCompleted: () => {
        onFinish();
      },
    }
  );

  const onSubmit = async () => {
    let b = {
      name: nameAr,
      name_en: nameEn,
    };
    if (id) b = { ...b, ItemId: id };
    else b = { ...b, category_id: itemId };
    await save({ variables: b });
  };

  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
            <h5>
              {nonNormal ? <FaEdit /> : <FaPlus />}{" "}
              {id
                ? t("updateNewRiskItemNonNormal")
                : t("createNewRiskItemNonNormal")}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="12" md="6">
                <CLabel>{t("nameAr")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("nameAr")}
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </CCol>
              <CCol xs="12" md="6">
                <CLabel>{t("nameEn")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("nameEn")}
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </CCol>
            </CFormGroup>

            {saveLoading ? (
              <Loader />
            ) : (
              <div className="flex flexItemCenter flexContentEnd mb-4 mt-2">
                <CButton
                  active
                  color="danger"
                  className="mr-2 ml-2"
                  to="/branches"
                >
                  {t("cancel")}
                </CButton>
                <CButton
                  active
                  color="success"
                  className="mr-2 ml-2"
                  onClick={() => onSubmit()}
                >
                  {t("save")}
                </CButton>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
CreateUpdateNonNormState.propTypes = {};

export default CreateUpdateNonNormState;
