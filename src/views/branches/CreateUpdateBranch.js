import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  GetSingleBranch,
  InsertBranch,
  UpdateBranch,
} from "./branch-query/BranchQueries";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import Loader from "src/reusable/Loader";
import { useHistory } from "react-router-dom";
import Error from "src/reusable/Error";
import { withTranslation, useTranslation } from "react-i18next";

const CreateUpdateBranch = ({ match }) => {
  const { t } = useTranslation();

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [area, setArea] = useState(1);

  const [managerId, setManagerId] = useState();

  const history = useHistory();

  const id = isNaN(match.params.id) ? 0 : match.params.id;
  const { loading, error, data } = useQuery(GetSingleBranch, {
    variables: { id: id },
    onCompleted: (data) => {
      const branch = data.branch;
      if (branch) {
        setNameAr(branch.name);
        setNameEn(branch.name_en);
        setBranchNumber(branch.branch_number);
        setContactNumber(branch.contact_numbers);
        setManagerId(branch.branch_manager);
        setArea(branch.neighborhood_id);
      }
    },
  });

  // const [getBranch, { loading, data }] = useLazyQuery(GET_DOG_PHOTO);

  const [save, { loading: saveLoading }] = useMutation(
    id ? UpdateBranch : InsertBranch,
    {
      onCompleted: () => {
        history.push("/branches");
      },
    }
  );

  const onSubmit = async () => {
    let b = {
      name: nameAr,
      name_en: nameEn,
      branchNumber: branchNumber,
      contact_numbers: contactNumber,
      neighborhood_id: area,
    };
    if (id) b = { ...b, branchId: id, branchManager: managerId };
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
            {/* <CFormGroup row>
              <CCol xs="12" md="6">
              <CLabel>City</CLabel>
              <CSelect
              custom
              className="mb-3"
              name="city"
              id="city"
              onChange={(event) => {
                const cityAreas = data.cities.filter(
                  (c) => c.id == event.target.value
                  );
                  setAreas(cityAreas.length ? cityAreas[0]?.areas : []);
                }}
                value={city}
                >
                <option selected disabled>
                Select City
                </option>
                {data.cities.map((item, index) => (
                  <option key={index} value={item.id}>
                  {item.name}
                  </option>
                  ))}
                  </CSelect>
                  </CCol>
                  <CCol xs="12" md="6">
                  <CLabel>Neighborhood</CLabel>
                  <CSelect
                  custom
                  className="mb-3"
                  name="neighbor"
                  id="neighbor"
                  onChange={(event) => {
                    setArea(event.target.value);
                  }}
                  value={area}
                  >
                  <option selected disabled>
                  Select Neighborhood
                  </option>
                  {areas.map((item) => (
                    <option key={item.id} value={item.id}>
                    {item.name}
                    </option>
                    ))}
                    </CSelect>
                    </CCol>
                    </CFormGroup>
                  */}
            <CFormGroup row>
              <CCol xs="12" md="6">
                <CLabel>{t("contactNumber")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("contactNumber")}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </CCol>
              <CCol xs="12" md="6">
                <CLabel>{t("branchNumber")}</CLabel>
                <CInput
                  className="mb-3"
                  type="number"
                  maxLength={8}
                  placeholder={t("branchNumber")}
                  value={branchNumber}
                  onChange={(e) => setBranchNumber(e.target.value)}
                />
              </CCol>
              {id !== 0 && (
                <CCol xs="12" md="6">
                  <CLabel>{t("branchManager")}</CLabel>
                  <CSelect
                    custom
                    className="mb-3"
                    name="managre"
                    id="managre"
                    onChange={(e) => {
                      setManagerId(e.target.value);
                    }}
                    value={managerId}
                  >
                    <option selected disabled>
                      {t("selectanEmployeeasManager")}
                    </option>
                    {data.employees.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.display_name}
                      </option>
                    ))}
                  </CSelect>
                </CCol>
              )}
            </CFormGroup>
            {saveLoading ? (
              <p>{t("saving")}</p>
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

CreateUpdateBranch.propTypes = {};

export default withTranslation()(CreateUpdateBranch);
