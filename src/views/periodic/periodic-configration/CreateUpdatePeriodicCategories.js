import React, { useState } from "react";
import PropTypes from "prop-types";
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

import Loader from "src/reusable/Loader";
import {
  AddCAtsPeriodic,
  CreatePeriodiceCats,
} from "../periodic-query/PeriodicQuery";
import { useTranslation } from "react-i18next";
import { FaEdit, FaPlus } from "react-icons/fa";

const CreateUpdatePeriodicCats = ({ category, onFinish }) => {
  const [nameAr, setNameAr] = useState(category?.name);
  const [nameEn, setNameEn] = useState(category?.name_en);

  const { t } = useTranslation();

  const [save, { loading: saveLoading }] = useMutation(
    category ? CreatePeriodiceCats : AddCAtsPeriodic,
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
    if (category) b = { ...b, id: category.id };
    await save({ variables: b });
  };

  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
            <h5>
              {category ? <FaEdit /> : <FaPlus />}
              {category
                ? t("updatePeriodicCategory")
                : t("createPeriodicCategory")}
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

export default CreateUpdatePeriodicCats;
