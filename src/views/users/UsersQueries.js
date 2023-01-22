import gql from "graphql-tag";

export const GetOrganizationUsers = gql`
  query getOrganizationUsers($filter: users_user_bool_exp) {
    users: users_user(where: $filter) {
      id
      master_ref
      username
      display_name
      avatar
      belongsTo
      employeeNumber
      user_group
      permission_group {
        title
        title_en
      }
      is_activated
    }
    groups: users_permission_group(
      where: { group_name: { _nin: ["maintenance_delegate", "master_admin"] } }
    ) {
      group_name
      title
      title_en
      permissions: permission_group_permissions {
        permission
      }
    }
    safety_engineers: users_user_aggregate(
      where: { user_group: { _eq: "safety_engineer" } }
    ) {
      aggregate {
        count
      }
    }
    branch_users: users_user_aggregate(
      where: {
        _or: [
          { user_group: { _eq: "branch_manager" } }
          { user_group: { _eq: "branch_employee" } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
    maintainence_engineers: users_user_aggregate(
      where: { user_group: { _eq: "maintainance_engineer" } }
    ) {
      aggregate {
        count
      }
    }
    tech_user: users_user_aggregate(
      where: { user_group: { _eq: "tech_user" } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
// permission_local {
//   description_ar
//   description_en
// }
export const LoadUserData = gql`
  query LoadUserData($userId: uuid!, $masterRef: String!) {
    user: users_user_by_pk(id: $userId, master_ref: $masterRef) {
      username
      display_name
      employeeNumber
      belongsTo
      user_group
      avatar
      group: permission_group {
        permissions: permission_group_permissions {
          permission
          details: permissionByPermission {
            module 
          }
        }
      }
      allowed_permissions {
        permission
      }
      allowed_branches {
        branch_id
      }
    }
  }
`;
// permission_local {
//   description_ar
//   description_en
// }
export const LoadDataForCreateUpdateUser = gql`
  query LoadDataForCreateUpdateUser {
    groups: users_permission_group(
      where: { group_name: { _nin: ["maintenance_delegate"] } }
    ) {
      group_name
      title
      title_en
      permissions: permission_group_permissions {
        permission
        details: permissionByPermission {
          module
        
        }
      }
    }
    departments: organization_technical_department(
      where: { isNeglected: { _eq: false } }
    ) {
      created_at
      id
      name
      name_en
      updated_at
    }
    branches: organization_branch(where: { isNeglected: { _eq: false } }) {
      id
      name
      name_en
    }
  }
`;

export const TriggerUserNeglect = gql`
  mutation triggerNeglected(
    $userId: uuid!
    $masterRef: String!
    $isNegelected: Boolean!
  ) {
    update_users_user_by_pk(
      pk_columns: { id: $userId, master_ref: $masterRef }
      _set: { is_activated: $isNegelected }
    ) {
      id
    }
  }
`;

export const GetUserBranch = gql`
  query getSingleBranch($id: Int!) {
    belongs: organization_branch_by_pk(id: $id) {
      name
      name_en
    }
  }
`;

export const GetUserDepartment = gql`
  query getSingleDepartment($id: Int!) {
    belongs: organization_technical_department_by_pk(id: $id) {
      name
      name_en
    }
  }
`;

export const InsertUserPermissionsBranches = gql`
  mutation insertPermessionAndBranches(
    $permissions: [users_allowed_permissions_insert_input!]!
    $branches: [users_allowed_branches_insert_input!]!
  ) {
    insert_users_allowed_permissions(objects: $permissions) {
      affected_rows
    }
    insert_users_allowed_branches(objects: $branches) {
      affected_rows
    }
  }
`;

export const DeleteUserPermissionsBranches = gql`
  mutation deleteUserPermissionsBranches($user_id: uuid!) {
    delete_users_allowed_permissions(where: { user_id: { _eq: $user_id } }) {
      affected_rows
    }
    delete_users_allowed_branches(where: { user_id: { _eq: $user_id } }) {
      affected_rows
    }
  }
`;
