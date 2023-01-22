import React, { useEffect, useState } from "react";
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
  LoadUserData,
  InsertUserPermissionsBranches,
  DeleteUserPermissionsBranches,
} from "./UsersQueries";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { useTranslation, withTranslation } from "react-i18next";
import Axios from "../../axios";
import { parseId } from "src/utils";
import { FaCheckSquare, FaSquare } from "react-icons/fa";

function getRandomSuffix() {
  var letters = "0123456789ABCDEF";
  var color = "";
  for (var i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const CreateUser = ({ match }) => {
  const { id: userId, master } = match.params;
  const currentModules =
    JSON.parse(localStorage.getItem("orgAdmin")).modules || [];

  console.log(userId);
  const [group, setGroup] = useState();
  const [permissions, setPermissions] = useState([]);
  const [allowedPermissions, setAllowedPermissions] = useState([]);
  const [allowedBranched, setAllowedBranched] = useState([]);
  const [belongsTo, setBelongsTo] = useState(); //[0] Belongsto
  const [displayName, setDisplayName] = useState();
  const [employeeNumber, setEmployeeNumber] = useState();
  const [password, setPassword] = useState();
  const [userName, setUserName] = useState();
  const [avatar, setAvatar] = useState();
  const [saving, setLoading] = useState(false);

  const history = useHistory();
  const [validationMessage, setValidationMessage] = useState();

  const { t, i18n } = useTranslation();
  const { error, loading, data } = useQuery(LoadDataForCreateUpdateUser);

  const {
    error: userError,
    loading: loadingUser,
    data: userData,
  } = useQuery(LoadUserData, {
    variables: { userId: userId, masterRef: master },
    onCompleted: (data) => {
      // console.log("User Data +++>", data);
      if (data && data.user) {
        const user = data.user;

        setGroup(user.user_group);
        setUserName(user.username);
        setDisplayName(user.display_name);
        setEmployeeNumber(user.employeeNumber);
        setAvatar(user.avatar);
        setBelongsTo(user.belongsTo);

        const perms = user.allowed_permissions.map((p) => p.permission);
        const bra = user.allowed_branches.map((b) => b.branch_id);
        const allPerms = user.group.permissions.map((p) => p.permission);

        console.log(allPerms);
        setPermissions(
          user.group.permissions.filter(
            (p) => currentModules.indexOf(p.mod.module) > -1
          )
        );
        setAllowedPermissions(perms);
        setAllowedBranched(bra);
      }
    },
  });

  const [savePermissionsAndBranches, { loading: permLoading }] = useMutation(
    InsertUserPermissionsBranches,
    {
      onCompleted: (data) => {
        console.log(data);
        setLoading(false);
        history.push("/users");
      },
    }
  );

  const [deletePermission, { loading: deleteLoading }] = useMutation(
    DeleteUserPermissionsBranches,
    {
      variables: { user_id: userId },
      onCompleted: (data) => {
        const prms = allowedPermissions.map((permission) => {
          return { user_id: userId, permission };
        });

        const bra = allowedBranched.map((branch_id) => {
          return { branch_id, user_id: userId };
        });

        savePermissionsAndBranches({
          variables: {
            permissions: prms,
            branches: bra,
          },
        });
      },
    }
  );

  if (loading || loadingUser) return <Loader />;

  if (error || (userId && userError)) {
    console.log("Error is:", JSON.stringify(error), "User Error :", userError);
    return <Error />;
  }

  const onSubmit = async () => {
    if (!group) {
      setValidationMessage("pleaseChooseUserType");
      return;
    }
    if (!userName && !userId) {
      setValidationMessage("pleaseEnteraValidUserName");
      return;
    }
    if (!password && !userId) {
      setValidationMessage("pleaseEnteraValidPassword");
      return;
    }
    if (!displayName) {
      setValidationMessage("pleaseEnteraValidDisplayName");
      return;
    }
    if (group == "tech_user") {
      if (!belongsTo) {
        setValidationMessage("pleaseChooseaValidTechnicalDepartment");
        return;
      }
    }

    if (group == "branch_employee" || group == "branch_manager") {
      if (!belongsTo) {
        setValidationMessage("pleaseChooseaValidBranch");
        return;
      }
    } else {
      if (group !== "organization_admin" && allowedBranched.length == 0) {
        setValidationMessage("pleaseSelectatleastOneBranchtotheUser");
        return;
      }
    }

    if (group !== "organization_admin" && allowedPermissions.length == 0) {
      setValidationMessage("pleaseSelectatleastOnePermissiontotheUser");
      return;
    }

    setValidationMessage(undefined);

    const updateObj = {
      permissionGroup: group,
      employeeNumber: employeeNumber,
      displayName: displayName,
      avatar: avatar,
      belongsTo: belongsTo,
    };

    const userObj = {
      username: userName,
      password: password,
      permissionGroup: group,
      organizationId: parseId(),
      employeeNumber: employeeNumber,
      displayName: displayName,
      belongsTo: belongsTo,
    };

    setLoading(true);
    const dat = userId ? updateObj : userObj;
    const url = "users/" + (userId ? master : "");
    const type = userId ? "PUT" : "POST";
    console.log("url:", url, "Request Type:", type, "data :", dat);

    Axios(dat, url, type)
      .then((response) => {
        if (userId) {
          deletePermission({ variables: { user_id: userId } });
        } else {
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
        }
      })
      .catch((err) => {
        console.log("err ---", err);
        setValidationMessage(t("itSeamsYouEnteredanExistingUserName"));
        setLoading(false);
      });
  };

  const filteredGroups = data.groups.filter((g) => {
    const pr = g.permissions.filter(
      (p) =>
        g.group_name == "master_admin" ||
        currentModules.indexOf(p.details.module) > -1
    );
    return pr.length > 0;
  });

  console.log(filteredGroups);
  return (
    <CCard>
      <CCardHeader>
        <h3>{userId ? t("editUserInfo") : t("createNewUser")}</h3>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CFormGroup>
              <CLabel style={{ marginTop: "0.5rem" }}>{t("userType")}</CLabel>
              <CButtonGroup className="float-right mr-3">
                {filteredGroups.map((g) =>
                  userId ? (
                    group == g.group_name ? (
                      <CButton
                        color="outline-primary"
                        key={g.group_name}
                        className="mx-0"
                        active={true}
                      >
                        {i18n.language == "ar" ? g.title : g.title_en}
                      </CButton>
                    ) : (
                      <span></span>
                    )
                  ) : (
                    <CButton
                      color="outline-primary"
                      key={g.group_name}
                      disabled={userId ? "disabled" : ""}
                      className="mx-0"
                      onClick={() => {
                        setGroup(g.group_name);
                        setAllowedPermissions([]);

                        setPermissions(
                          g.permissions.filter(
                            (p) => currentModules.indexOf(p.details.module) > -1
                          )
                        );
                        console.log(g.permissions);
                      }}
                      active={g.group_name == group}
                    >
                      {i18n.language == "ar" ? g.title : g.title_en}
                    </CButton>
                  )
                )}
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
                  className="mb-3"
                  type="text"
                  disabled={userId}
                  placeholder={t("userName")}
                  size="16"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <CInputGroupAppend>
                  <CButton
                    disabled={userId}
                    style={{ height: "35px" }}
                    onClick={() => {
                      if (group) setUserName(`${group}_${getRandomSuffix()}`);
                    }}
                    color="secondary"
                  >
                    {t("generate")}!
                  </CButton>
                </CInputGroupAppend>
              </CInputGroup>
            </CFormGroup>

            {!userId && (
              <CFormGroup>
                <CLabel>{t("password")}</CLabel>
                <CInput
                  className="mb-3"
                  type="text"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CFormGroup>
            )}
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
                        // branch={belongsTo}
                        // setBranch={(b) => setBelongsTo(b)}
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
                                <CButton
                                  onClick={() => {
                                    const arr = [...allowedBranched];
                                    const index = arr.indexOf(b.id);
                                    if (index > -1) {
                                      arr.splice(index, 1);
                                    } else {
                                      arr.push(b.id);
                                    }
                                    setAllowedBranched(arr);
                                  }}
                                >
                                  <h4>
                                    {" "}
                                    {allowedBranched.indexOf(b.id) > -1 ? (
                                      <FaCheckSquare />
                                    ) : (
                                      <FaSquare />
                                    )}
                                    {"   "}
                                    {i18n.language == "ar" ? b.name : b.name_en}
                                  </h4>
                                </CButton>
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
            {group && (
              <CLabel>
                <b>{t("choosetheAllowedPermissionsforTheUser")}</b>
              </CLabel>
            )}
            <br />
            <div style={{ overflowY: "scroll", height: 400 }}>
              {permissions.map((p) => (
                <CRow style={{ marginLeft: 25, marginRight: 25 }}>
                  <CButton
                    className="col-md-12"
                    key={p.permission}
                    style={{ margin: 3, textAlign: "start" }}
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
                    {allowedPermissions.indexOf(p.permission) >= 0 ? (
                      <FaCheckSquare />
                    ) : (
                      ""
                    )}{" "}
                    {p.permission}
                    {/* {i18n.language == "ar"
                      ? p.details.permission_local.description_ar
                      : p.details.permission_local.description_en} */}
                  </CButton>
                </CRow>
              ))}
            </div>
            <CRow>
              <CCol></CCol>
            </CRow>
          </CCol>
        </CRow>
        {validationMessage && (
          <CAlert color="danger">{t(validationMessage)}</CAlert>
        )}
        {saving || permLoading || deleteLoading ? (
          <p>{t("Saving")}</p>
        ) : (
          <div className="flex flexItemCenter flexContentEnd mb-4 mt-2">
            <CButton active color="danger" className="mr-2 ml-2">
              {/* //to="/users"> */}
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
  );
};
export default withTranslation()(CreateUser);
