import React, { useEffect, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormGroup,
    CInput,
    CSelect,
    CTextarea,
    CRow,
} from "@coreui/react";

import ImageUploading from "react-images-uploading";
import { FiPlusSquare } from "react-icons/fi";
// import Axios from "../../../axios";
import Loader from "src/reusable/Loader";
import { parseId } from "src/utils";
import { withTranslation, useTranslation } from "react-i18next";
import axios from "axios";
import Axios from "../../../axios";
import { useHistory } from "react-router-dom";


function OrganizationSettings() {


    const { t } = useTranslation();
    const [errToasts, setErrToasts] = useState(false);
    const [toastMass, setToastMass] = useState("");
    const [loader, setLoader] = useState(true);
    const [images, setImages] = useState([]);
    const history = useHistory();


    const [avatar, setAvatar] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [name, setName] = useState("");
    const [industry, setIndustry] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [phone, setPhone] = useState("");
    const [countryId, setCountryId] = useState("");
    const [cityId, setCityId] = useState("");
    const [info, setInfo] = useState("");
    const maxNumber = 1;




    const onChange = (imageList) => {
        setImages(imageList);
        for (let i = 0; i < imageList.length; i++) {
            setAvatar(imageList[i].data_url);
        }
    };




    async function fetchData() {
        await Axios(null, "organizations/" + parseId(), "GET")
            .then((response) => {
                console.log('====================================');
                console.log(response);
                console.log('====================================');
                images.push(response.data.logo);
                setAvatar(response.data.logo);
                setName(response.data.name);
                setIndustry(response.data.industry);
                setIdentifier(response.data.commercialIdentifier);
                setPhone(response.data.phone);
                setInfo(response.data.about);
                setCityId(response.data.cityId);
                setCountryId(response.data.countryId);
                setOrganizationType(response.data.organizationType);

            }).then(() => setLoader(false))
            .catch((err) => {
                console.log("err ---", err);
                setLoader(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);





    function loadBody() {
        if (loader) {
            return <Loader />;
        }
    }

    function validate() {
        let isError = false;
        setToastMass("");

        if (avatar === "") {
            isError = true;
            setErrToasts(true);
            setToastMass("set logo");
        } else if (name.length <= 0) {
            isError = true;
            setErrToasts(true);
            setToastMass("set name");
        } else if (industry.length <= 0) {
            isError = true;
            setErrToasts(true);
            setToastMass("set industry");
        } else if (identifier.length <= 0) {
            isError = true;
            setErrToasts(true);
            setToastMass("set identifier");
        } else if (phone.length <= 0) {
            isError = true;
            setErrToasts(true);
            setToastMass("set phone");
        } else if (info.length <= 0) {
            isError = true;
            setErrToasts(true);
            setToastMass("set info");
        }

        setTimeout(() => {
            setErrToasts(false);
        }, 2000);

        return isError;
    }

    function onSubmit() {
        const err = validate();

        if (!err) {
            setLoader(true);

            const dataVal = {
                name: name,
                logo: avatar,
                industry: industry,
                countryId: countryId,
                cityId: cityId,
                commercialIdentifier: identifier,
                about: info,
                phone: phone,
            };

            Axios(dataVal, "organizations/" + parseId(), "PUT")
                .then((response) => {
                    console.log(response);
                    setLoader(false);

                    if (response.status == 200) {

                        history.push("/dashboard");
                    }
                })
                .catch((err) => {
                    console.log("err ---", err);
                    setLoader(false);
                });
        }
    }

    return (
        <div>

            <CRow className="position-relative">

                <CCol xs="12" md="12">
                    <CCard>
                        <CCardBody>

                            {
                                errToasts ? (
                                    <div className="toastFun">
                                        <h5 className="m-0">{toastMass}</h5>
                                    </div>
                                )
                                    : null
                            }
                            {loadBody()}
                            <CCardHeader className="mb-5 pt-3 pb-4 pr-0 pl-0 flex flexItemCenter flexSpace">
                                <h4>{t("yourOrganizationSettings")} </h4>
                            </CCardHeader>
                            <CFormGroup row>
                                <CCol xs="12" md="4">
                                    <div className="App">
                                        <ImageUploading
                                            multiple
                                            value={images}
                                            onChange={onChange}
                                            maxNumber={maxNumber}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps,
                                            }) => (
                                                    // write your building UI
                                                    <div className="upload__image-wrapper">
                                                        <button
                                                            className="btnUpload"
                                                            onClick={onImageUpload}
                                                            {...dragProps}
                                                        >
                                                            <FiPlusSquare size={30} className="mt-3 mb-3" />
                                                            <span className="d-block w-100">
                                                                {t("organizationLogo")}
                                                            </span>
                                                        </button>
                                                        {images.map((image, index) => (
                                                            <div key={index} className="imageItem">
                                                                <img
                                                                    src={avatar ? avatar : image['data_url']}
                                                                    alt=""
                                                                    className="w-100 h-100"
                                                                />
                                                                <div className="btnWrapper">
                                                                    <CButton
                                                                        className="mr-2 ml-2"
                                                                        onClick={() => onImageUpdate(index)}
                                                                        variant="outline"
                                                                        active
                                                                        color="success"
                                                                        aria-pressed="true"
                                                                    >
                                                                        {t("saveChanges")}
                                                                    </CButton>

                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                        </ImageUploading>
                                    </div>
                                </CCol>
                                <CCol xs="12" md="8">
                                    <CFormGroup row>
                                        <CCol xs="12" md="6">
                                            <CInput
                                                className="mb-3"
                                                type="text"
                                                placeholder="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </CCol>
                                        <CCol xs="12" md="6">
                                            <CInput
                                                className="mb-3"
                                                type="text"
                                                placeholder={t("industry")}
                                                value={industry}
                                                onChange={(e) => setIndustry(e.target.value)}
                                            />
                                        </CCol>
                                        <CCol xs="12" md="6">
                                            <CInput
                                                className="mb-3"
                                                type="text"
                                                placeholder={t("commercialIdentifier")}
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                            />
                                        </CCol>
                                        <CCol xs="12" md="6">
                                            <CInput
                                                className="mb-3"
                                                type="tel"
                                                placeholder={t("phoneNumber")}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </CCol>

                                        <CCol xs="12" md="12">
                                            <CTextarea
                                                className="mb-3"
                                                rows="9"
                                                value={info}
                                                onChange={(e) => setInfo(e.target.value)}
                                                placeholder={t("otherInformationAboutTheOrganization")}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardBody>
                        <div className="flex flexItemCenter flexContentEnd mb-4 mt-2 pr-3 pl-3">
                            <CButton
                                active
                                color="danger"
                                className="mr-2 ml-2"
                                to="/organizations/organizations"
                            >
                                {t("cancel")}
                            </CButton>
                            <CButton
                                active
                                color="success"
                                className="mr-2 ml-2"
                                onClick={() => onSubmit()}
                            >
                                {t("updateOrganization")}
                            </CButton>
                        </div>
                    </CCard>
                </CCol>
            </CRow>

        </div>
    )
}

export default OrganizationSettings
