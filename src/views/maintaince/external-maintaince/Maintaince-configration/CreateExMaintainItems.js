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
import { useHistory, } from "react-router-dom";
import Error from "src/reusable/Error";
import { getSingelItems, CretaMaitaineItems, UpdateEXMaintaineItems } from "../QueryExMaintain";



function CreatUpdateExMaintainItems(props) {
    console.log(props);
    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");

    const history = useHistory();
    const id = isNaN(props.match.params.id) ? 0 : props.match.params.id;
    console.log(props.location.idss);

    const { loading, error, data } = useQuery(getSingelItems, {
        variables: { id: id },
        onCompleted: (data) => {
            const ExItems = data.external_maintainance_items_by_pk;
            if (ExItems) {
                setNameAr(ExItems.name);
                setNameEn(ExItems.name_en);

            }
        },
    });

    const [save, { loading: saveLoading }] = useMutation(
        id ? UpdateEXMaintaineItems : CretaMaitaineItems,
        {
            onCompleted: () => {
                history.push(`/spare-parts/${props.location.idss}`)
            },
        }
    );

    const onSubmit = async () => {
        let b = {
            name: nameAr,
            name_en: nameEn,

        };
        if (id) b = { ...b, ItemId: id, }
        else b = { ...b, category_id: props.location.idss, }
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
                            {id ? "Update External Maintaince Items" : "Create External Maintaince Items"}
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
CreatUpdateExMaintainItems.propTypes = {};

export default CreatUpdateExMaintainItems
