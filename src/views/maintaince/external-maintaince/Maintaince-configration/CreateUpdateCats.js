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
// import { GesingleDepartments, InsertDepartments, UpdateDepatrment } from "./DepartmentQuery";
import { SingleCats, UpdateCates, AddCategory } from "../QueryExMaintain";



function CreateUpdatExCats({ match }) {

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");

    const history = useHistory();
    const id = isNaN(match.params.id) ? 0 : match.params.id;

    console.log(match.params.id);
    const { loading, error, data } = useQuery(SingleCats, {
        variables: { id: id },
        onCompleted: (data) => {
            const departm = data.external_maintainance_categories_by_pk;
            if (departm) {
                setNameAr(departm.name);
                setNameEn(departm.name_en);

            }
        },
    });

    const [save, { loading: saveLoading }] = useMutation(
        id ? UpdateCates : AddCategory,
        {
            onCompleted: () => {
                history.push("/spare-parts");
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
                            {id ? "Update External Maintaince Category" : "Create External Maintaince Category"}
                        </h3>
                    </CCardHeader>
                    <CCardBody>
                        <CFormGroup row>
                            <CCol xs="12" md="6">
                                <CLabel>Name in Arabic</CLabel>
                                <CInput
                                    className="mb-3"
                                    type="text"
                                    placeholder="Name in Arabic"
                                    value={nameAr}
                                    onChange={(e) => setNameAr(e.target.value)}
                                />
                            </CCol>
                            <CCol xs="12" md="6">
                                <CLabel>Name in English</CLabel>
                                <CInput
                                    className="mb-3"
                                    type="text"
                                    placeholder="Name in English"
                                    value={nameEn}
                                    onChange={(e) => setNameEn(e.target.value)}
                                />
                            </CCol>
                        </CFormGroup>

                        {
                            saveLoading ? (
                                <p>Saving ...</p>
                            ) : (
                                    <div className="flex flexItemCenter flexContentEnd mb-4 mt-2">
                                        <CButton
                                            active
                                            color="danger"
                                            className="mr-2 ml-2"
                                            to="/branches"
                                        >
                                            Cancel
                                  </CButton>
                                        <CButton
                                            active
                                            color="success"
                                            className="mr-2 ml-2"
                                            onClick={() => onSubmit()}
                                        >
                                            Save
                                   </CButton>
                                    </div>
                                )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
CreateUpdatExCats.propTypes = {};

export default CreateUpdatExCats
