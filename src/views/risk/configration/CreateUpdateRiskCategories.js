import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

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
import CIcon from "@coreui/icons-react";

import Loader from "src/reusable/Loader";
import {
  AddRiskCats,
  UpdateRisk,
} from "../risk-query/RiskListQuery";

import { useTranslation, withTranslation } from "react-i18next";
import { FaEdit, FaPlus } from "react-icons/fa";

const CreateUpdateRiskCats = ({
  category,
  maxPercentageAvailable,
  onFinish,
}) => {
  const [nameAr, setNameAr] = useState(category?.name);
  const [nameEn, setNameEn] = useState(category?.name_en);
  const [percentage, setPercentage] = useState(
    category?.precentage ? category.precentage : maxPercentageAvailable
  );
  
  const { t } = useTranslation();

  const id = isNaN(category?.id) ? 0 : category.id;

  const [save, { loading: saveLoading }] = useMutation(
    id ? UpdateRisk : AddRiskCats,
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
      percentage: percentage,
    };
    if (id) b = { ...b, id: id };
    await save({ variables: b });
  };

  // add new catgeory , but without a percentage available .
  if (!category && !maxPercentageAvailable) {
    return (
      <p>
        {" "}
        You can't add any category please update the percentage of one of any
        category and then try again{" "}
      </p>
    );
  }

  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
            <h5>
              {/* <CIcon className="mfe-2" size="lg" name="cil-grid" /> */}
              {category ? <FaEdit /> : <FaPlus />}{" "}
              {id ? t("updateRiskCategory") : t("createRiskCategory")}
            </h5>
          </CCardHeader>
          <CCardBody>
            <CFormGroup row>
              <CCol xs="12" md="4">
                <CLabel>{t("nameAr")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("nameAr")}
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </CCol>
              <CCol xs="12" md="4">
                <CLabel>{t("nameEn")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("nameEn")}
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </CCol>
              <CCol xs="12" md="4">
                <CLabel>{t("precentage")}</CLabel>
                <CInput
                  className="mb-3"
                  type="number"
                  max={maxPercentageAvailable}
                  placeholder={t("precentage")}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
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
                  onClick={onFinish}
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
CreateUpdateRiskCats.propTypes = {};

export default withTranslation()(CreateUpdateRiskCats);
