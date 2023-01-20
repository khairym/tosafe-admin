import gql from "graphql-tag";

export const QexternalReportLis = gql`
  query QexternalReportLis(
    $filter: external_maintainance_report_bool_exp!
    $offset: Int
  ) {
    external_maintainance_report(
      order_by: { created_at: desc }
      where: $filter
      limit: 10
      offset: $offset
    ) {
      id
      org_level_serial
      branch {
        id
        name
        name_en
      }
      report_url
      created_at
      maintainance_date
      status
      updated_at
      visit_type
      system_type
      problem_description
      problem_solution
    }
    reports: external_maintainance_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const externalListStatistc = gql`
  query externalListStatistc {
    all: external_maintainance_report_aggregate {
      aggregate {
        count
      }
    }
    new: external_maintainance_report_aggregate(
      where: { status: { _eq: "0" } }
    ) {
      aggregate {
        count
      }
    }
    done: external_maintainance_report_aggregate(
      where: { status: { _eq: "1" } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GetItemsStatistics = gql`
  query GetItemsStatistics($branchId: Int) {
    categories: external_maintainance_categories {
      name
      name_en
      items {
        id
        name
        name_en
        amounts: report_items_amounts(
          where: { report: { branch_id: { _eq: $branchId } } }
        ) {
          amount
        }
        amountsSum: report_items_amounts_aggregate(
          where: { report: { branch_id: { _eq: $branchId } } }
        ) {
          aggregate {
            sum {
              amount
            }
          }
        }
      }
    }
  }
`;
export const GetCategoriesExternalMaintaince = gql`
  query GetCategoriesExternalMaintaince($isNeglected: Boolean!) {
    external_maintainance_categories(
      order_by: { created_at: desc }
      where: { isNeglected: { _eq: $isNeglected } }
    ) {
      id
      name
      name_en
      updated_at
      created_at
      isNeglected
    }
  }
`;

export const GetItemsMaitain = gql`
  query GetItemsMaitain($category_id: Int!, $isNeglected: Boolean!) {
    external_maintainance_items(
      where: {
        category_id: { _eq: $category_id }
        isNeglected: { _eq: $isNeglected }
      }
    ) {
      name
      name_en
      created_at
      updated_at
      isNeglected
      id
    }
  }
`;

export const TrigeerNeglected = gql`
  mutation triggerNeglected($ItemId: Int!, $isNegelected: Boolean!) {
    update_external_maintainance_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { isNeglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const CretaMaitaineItems = gql`
  mutation CretaMaitaineItems(
    $name: String
    $name_en: String
    $category_id: Int!
  ) {
    insert_external_maintainance_items(
      objects: {
        name: $name
        name_en: $name_en
        category_id: $category_id
        isNeglected: false
      }
    ) {
      affected_rows
    }
  }
`;

export const getSingelItems = gql`
  query getSingelItems($id: Int!) {
    external_maintainance_items_by_pk(id: $id) {
      id
      name
      name_en
    }
  }
`;

export const SingleCats = gql`
  query SingleCats($id: Int!) {
    external_maintainance_categories_by_pk(id: $id) {
      id
      name
      name_en
    }
  }
`;
export const UpdateEXMaintaineItems = gql`
  mutation updateExMAinItems($name: String!, $name_en: String!, $ItemId: Int!) {
    update_external_maintainance_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { name: $name, name_en: $name_en }
    ) {
      id
    }
  }
`;

export const TriggerCategories = gql`
  mutation TriggerCategories($ItemId: Int!, $isNegelected: Boolean!) {
    update_external_maintainance_categories_by_pk(
      pk_columns: { id: $ItemId }
      _set: { isNeglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const AddCategory = gql`
  mutation AddCategory($name: String, $name_en: String) {
    insert_external_maintainance_categories_one(
      object: { name: $name, name_en: $name_en, isNeglected: false }
    ) {
      id
    }
  }
`;

export const UpdateCates = gql`
  mutation updateCates($name: String!, $name_en: String!, $departmentID: Int!) {
    update_external_maintainance_categories_by_pk(
      pk_columns: { id: $departmentID }
      _set: { name: $name, name_en: $name_en }
    ) {
      id
    }
  }
`;

export const GetExternalReportDetails = gql`
  query getReportDetails($reportId: Int!) {
    report: external_maintainance_report_by_pk(id: $reportId) {
      status
      id
      problem_description
      maintainance_date
      report_url
      system_type
      problem_solution
      created_at
      visit_type
      images
      created_at
      organization_id
      user {
        display_name
      }
      branch: branch {
        id
        name
        name_en
      }
      items: report_items_amounts {
        amount
        item {
          name_en
          name
          category {
            name
            name_en
          }
        }
      }
    }
  }
`;
