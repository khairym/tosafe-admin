import React from "react";
import { CSelect } from "@coreui/react";
import { useSubscription } from "react-apollo";
import Loader from "../Loader";
import Error from "../Error";
import { useTranslation, withTranslation } from "react-i18next";
import gql from "graphql-tag";
// useTranslation,
const GetUserGroups = gql`
  {
    groups: users_permission_group(
      where: { group_name: { _nin: ["maintenance_delegate", "master_admin"] } }
    ) {
      group_name
      title
      title_en
    }
  }
`;

function UserGroupsDrobdown({ setGroup, group }) {
  const { loading, error, data } = useSubscription(GetUserGroups);
  const { t } = useTranslation();

  if (loading) return <Loader />;
  if (error) return <Error />;

  const groups = [{ group_name: 'all', title: "كل المستخدمين" , title_en:"All Users" }, ...data.groups];

  return (
    <CSelect
      custom
      className="mb-3"
      name="neighbor"
      id="neighbor"
      onChange={(event) => {
        setGroup(event.target.value);
      }}
      value={group}
    >
      {/* <option selected disabled>
        {t("selectRole")}
      </option> */}
      {groups.map((item) => (
        <option key={item.group_name} value={item.group_name}>
          {item.title_en}
        </option>
      ))}
    </CSelect>
  );
}

export default withTranslation()(UserGroupsDrobdown);
