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
    CInputRadio,
    CLabel,
    CSelect,
    CTextarea,
    CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import Loader from "src/reusable/Loader";
import { useHistory } from "react-router-dom";
import Error from "src/reusable/Error";
import { GesingleDepartments, InsertDepartments, UpdateDepatrment } from "./DepartmentQuery";
import { withTranslation, useTranslation } from 'react-i18next';

function CreateUpdateDepartment({ match }) {
    const { t } = useTranslation();

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");

    const history = useHistory();
    const id = isNaN(match.params.id) ? 0 : match.params.id;


    const { loading, error, data } = useQuery(GesingleDepartments, {
        variables: { id: id },
        onCompleted: (data) => {
            const departm = data.organization_technical_department_by_pk;
            if (departm) {
                setNameAr(departm.name);
                setNameEn(departm.name_en);

            }
        },
    });

    const [save, { loading: saveLoading }] = useMutation(
        id ? UpdateDepatrment : InsertDepartments,
        {
            onCompleted: () => {
                history.push("/technical");
            },
        }
    );

    const onSubmit = async () => {
        let b = {
            name: nameAr,
            name_en: nameEn,

        };
        if (id) b = { ...b, departmentID: id, };
        await save({ variables: b });
    };

    if (loading) return <Loader />;
    if (error) return <Error />;


    return (
        <CRow className="position-relative">
            <CCol xs="12" md="12">
                <CCard>
                    <CCardHeader className="mb-3 p-4 flex flexItemCenter flexSpace">
                        <h3>
                            <CIcon className="mfe-2" size="lg" name="cil-grid" />
                            {id ? t("updateBranch") : t("createBranch")}
                        </h3>
                    </CCardHeader>
                    <CCardBody>
                        <CFormGroup row>
                            <CCol xs="12" md="6">
                                <CLabel>{t("nameAr")}</CLabel>
                                <CInput
                                    className="mb-3"
                                    type="text"
                                    placeholder={t('nameAr')}
                                    value={nameAr}
                                    onChange={(e) => setNameAr(e.target.value)}
                                />
                            </CCol>
                            <CCol xs="12" md="6">
                                <CLabel>{t('nameEn')}</CLabel>
                                <CInput
                                    className="mb-3"
                                    type="text"
                                    placeholder={t('nameEn')}
                                    value={nameEn}
                                    onChange={(e) => setNameEn(e.target.value)}
                                />
                            </CCol>
                        </CFormGroup>

                        {
                            saveLoading ? (
                                <p>{t("saving")}</p>
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
    )
}
CreateUpdateDepartment.propTypes = {};

export default withTranslation()(CreateUpdateDepartment);
