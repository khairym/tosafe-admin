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
  CButtonGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CToggler,
  CSwitch,
  CAlert,
  CInputGroup,
  CInputGroupAppend,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import Loader from "src/reusable/Loader";
import { useHistory } from "react-router-dom";
import Error from "src/reusable/Error";
import {
  LoadDataForCreateUpdateUser,
  InsertUserPermissionsBranches,
} from "./UsersQueries";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { useTranslation, withTranslation } from "react-i18next";
import Axios from "../../axios";
import { parseId } from "src/utils";

const User = () => {
  const [group, setGroup] = useState();
  const [permissions, setPermissions] = useState([]);
  const [allowedPermissions, setAllowedPermissions] = useState([]);
  const [allowedBranched, setAllowedBranched] = useState([]);
  const [belongsTo, setBelongsTo] = useState(); //[0] Belongsto
  const [displayName, setDisplayName] = useState();
  const [employeeNumber, setEmployeeNumber] = useState();
  const [password, setPassword] = useState();
  const [userName, setUserName] = useState();
  const [saving, setLoading] = useState(false);

  const history = useHistory();
  const [validationMessage, setValidationMessage] = useState();

  const { t } = useTranslation();
  const { error, loading, data } = useQuery(LoadDataForCreateUpdateUser);

  const [savePermissionsAndBranches, { loading: permLoading }] = useMutation(
    InsertUserPermissionsBranches,
    {
      onCompleted: (data) => {
        setLoading(false);
        history.back();
      },
    }
  );

  if (loading) return <Loader />;
  if (error) return <Error />;

  const onSubmit = async () => {
    console.log(group);

    if (!userName) {
      setValidationMessage(t("pleaseEnteraValidUserName"));
      return;
    }
    if (!password) {
      setValidationMessage(t("pleaseEnteraValidPassword"));
      return;
    }
    if (!displayName) {
      setValidationMessage(t("pleaseEnteraValidDisplayName"));
      return;
    }
    if (group == "tech_user") {
      if (!belongsTo) {
        setValidationMessage(t("pleaseChooseaValidTechnicalDepartment"));
        return;
      }
    }

    if (group == "branch_employee" || group == "branch_manager") {
      if (!belongsTo) {
        setValidationMessage(t("pleaseChooseaValidBranch"));
        return;
      }
    } else {
      if (group !== "organization_admin" && allowedBranched.length == 0) {
        setValidationMessage(t("pleaseSelectatleastOnePermissiontotheUser"));
        return;
      }
    }

    setValidationMessage(undefined);

    const userObj = {
      username: userName,
      password: password,
      permissionGroup: group,
      organizationId: parseId(),
      employeeNumber: employeeNumber,
      displayName: displayName,
      belongsTo: belongsTo,
    };
    console.log(userObj);
    setLoading(true);
    Axios(userObj, "users/", "POST")
      .then((response) => {
        console.log(response.data);
        const user_id = response.data.user_id;

        const prms = allowedPermissions.map((permission) => {
          return { user_id, permission };
        });

        const bra = allowedBranched.map((branch_id) => {
          return { branch_id, user_id };
        });

        savePermissionsAndBranches({
          variables: {
            permissions: prms,
            branches: bra,
          },
        });
      })
      .catch((err) => {
        console.log("err ---", err);
        setValidationMessage(t("itSeamsYouEnteredanExistingUserName"));
        setLoading(false);
      });
  };
  // console.log("Branches Selected", allowedBranched);
  return (
    <CCard>
      <CCardHeader>
        <h3>{t("createNewUser")}</h3>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CFormGroup>
              <CLabel style={{ marginTop: "0.5rem" }}>{t("userType")}</CLabel>
              <CButtonGroup disabled={true} className="float-right mr-3">
                {data.groups.map((g) => (
                  <CButton
                    color="outline-primary"
                    key={g.group_name}
                    className="mx-0"
                    onClick={() => {
                      setGroup(g.group_name);
                      setAllowedPermissions([]);
                      setPermissions(g.permissions);
                      console.log(g.permissions);
                    }}
                    active={g.group_name == group}
                  >
                    {g.title_en}
                  </CButton>
                ))}
              </CButtonGroup>
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol md="6">
            <CFormGroup>
              <CLabel>{t("displayName")}</CLabel>
              <CInput
                className="mb-3"
                type="text"
                placeholder={t("displayName")}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel>{t("empNumber")}</CLabel>
              <CInput
                className="mb-3"
                type="text"
                placeholder={t("empNumber")}
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel>{t("userName")}</CLabel>
              <CInputGroup>
                <CInput
                  disabled={true}
                  className="mb-3"
                  type="text"
                  placeholder={t("userName")}
                  size="16"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </CInputGroup>
            </CFormGroup>

            {group !== "organization_admin" && (
              <>
                {group == "tech_user" && (
                  <CFormGroup>
                    <CLabel>{t("userTechnicalDepartment")}</CLabel>
                    <CSelect
                      custom
                      className="mb-3"
                      name="department"
                      id="department"
                      onChange={(event) => {
                        setBelongsTo(event.target.value);
                      }}
                      value={belongsTo}
                    >
                      <option selected disabled>
                        {t("selectDepartment")}
                      </option>
                      {data.departments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name_en}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                )}
                <CFormGroup>
                  {group == "branch_employee" || group == "branch_manager" ? (
                    <>
                      <CLabel>{t("allowedBranches")}</CLabel>
                      <BranchesDrobdown
                        defaultBranch={belongsTo}
                        onBranchChanges={(b) => setBelongsTo(b)}
                      />
                    </>
                  ) : (
                    <>
                      <CLabel>
                        <b>{t("allowedBranches")}</b>
                      </CLabel>
                      <table>
                        <tbody>
                          {data.branches.map((b) => (
                            <tr key={b.id} style={{ padding: 8 }}>
                              <td>
                                <CSwitch
                                  className={"mx-1"}
                                  variant={"3d"}
                                  color={"primary"}
                                  value={allowedBranched.indexOf(b.id) >= 0}
                                  onChange={(e) => {
                                    const arr = [...allowedBranched];
                                    const index = arr.indexOf(b.id);
                                    if (index > -1) {
                                      arr.splice(index, 1);
                                    } else {
                                      arr.push(b.id);
                                    }
                                    setAllowedBranched(arr);
                                  }}
                                />
                              </td>
                              <td>
                                <b>{b.name_en}</b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </CFormGroup>
              </>
            )}
          </CCol>
          <CCol md="6">
            {group !== "organization_admin" && (
              <CLabel>
                <b>{t("choosetheAllowedPermissionsforTheUser")}</b>
              </CLabel>
            )}
            <br />
            {permissions.map((p) => (
              <CRow>
                <CCol md={12}>
                  <CButton
                    key={p.permission}
                    style={{ margin: 3 }}
                    color={
                      allowedPermissions.indexOf(p.permission) >= 0
                        ? "warning"
                        : "outline-warning"
                    }
                    onClick={() => {
                      const arr = [...allowedPermissions];
                      const index = arr.indexOf(p.permission);
                      if (index > -1) {
                        arr.splice(index, 1);
                      } else {
                        arr.push(p.permission);
                      }
                      setAllowedPermissions(arr);
                    }}
                  >
                    {p.permission}
                  </CButton>
                </CCol>
              </CRow>
            ))}
            <CRow>
              <CCol></CCol>
            </CRow>
          </CCol>
        </CRow>
        {validationMessage && (
          <CAlert color="danger">{validationMessage}</CAlert>
        )}
        {saving || permLoading ? (
          <p> {t("saving")}</p>
        ) : (
          <div className="flex flexItemCenter flexContentEnd mb-4 mt-2">
            <CButton active color="danger" className="mr-2 ml-2">
              {/* //to="/users"> */}
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
  );
};
export default withTranslation()(User);
