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
import CIcon from "@coreui/icons-react";

import Loader from "src/reusable/Loader";
import { useHistory } from "react-router-dom";
import Error from "src/reusable/Error";
import {
  UpdatePeriodiceItems,
  SinglePeriodicItems,
  AddPeriodicItems,
} from "../periodic-query/PeriodicQuery";
import { useTranslation } from "react-i18next";

const CreateUpdatePeriodicItems = ({ categoryId, item, onFinish }) => {
  const [nameAr, setNameAr] = useState(item?.name);
  const [nameEn, setNameEn] = useState(item?.name_en);
  const [imageNumber, setimageNumber] = useState(item?.images_number);

  const { t } = useTranslation();
  const id = isNaN(item?.id) ? 0 : item.id;

  const [save, { loading: saveLoading }] = useMutation(
    id ? UpdatePeriodiceItems : AddPeriodicItems,
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
      images_number: imageNumber,
    };
    if (id) b = { ...b, ItemId: id };
    else b = { ...b, category_id: categoryId };
    await save({ variables: b });
  };

  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
            <h5>{id ? t("updatePeriodicItem") : t("createPeriodicItem")}</h5>
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
                <CLabel>{t("imageCount")}</CLabel>
                <CInput
                  className="mb-3"
                  type="number"
                  placeholder={t("imageCount")}
                  value={imageNumber}
                  onChange={(e) => setimageNumber(e.target.value)}
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
                  onClick={() => {
                    onFinish();
                  }}
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
CreateUpdatePeriodicItems.propTypes = {};

export default CreateUpdatePeriodicItems;
