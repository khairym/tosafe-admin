import gql from "graphql-tag";

export const GetDepartmentsList = gql`
  query GetDepartmentsList($isNeglected: Boolean!) {
    organization_technical_department(
      where: { isNeglected: { _eq: $isNeglected } }
    ) {
      name
      name_en
      created_at
      updated_at
      id
      isNeglected
    }
  }
`;

export const DepartmentTriggerNeglact = gql`
  mutation DepartmentTriggerNeglact($departmentID: Int!, $isNegelected: Boolean!) {
    update_organization_technical_department_by_pk(
      pk_columns: { id: $departmentID }
      _set: { isNeglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const InsertDepartments = gql`
  mutation insertDepartments($name: String!, $name_en: String!) {
    insert_organization_technical_department_one(
      object: { name: $name, name_en: $name_en }
    ) {
      id
    }
  }
`;

export const UpdateDepatrment = gql`
  mutation updateDepartments(
    $name: String!
    $name_en: String!
    $departmentID: Int!
  ) {
    update_organization_technical_department_by_pk(
      pk_columns: { id: $departmentID }
      _set: { name: $name, name_en: $name_en }
    ) {
      id
    }
  }
`;

export const GesingleDepartments = gql`
  query GesingleDepartments($id: Int!) {
    organization_technical_department_by_pk(id: $id) {
      id
      name
      name_en
    }
  }
`;
