import gql from "graphql-tag";

export const QRiskList = gql`
  query QRiskList(
    $filter: risk_assessment_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    risk_assessment_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      id
      org_level_serial
      report_url
      created_at
      is_normal
      updated_at
      status
      branch_id
      user {
        display_name
      }
      branch {
        name
        name_en
      }
    }
    reports: risk_assessment_report_aggregate(where: $filter) {
      aggregate {
        count
      }
    }
    all: risk_assessment_report_aggregate {
      aggregate {
        count
      }
    }
    new: risk_assessment_report_aggregate(where: { status: { _eq: "new" } }) {
      aggregate {
        count
      }
    }
    done: risk_assessment_report_aggregate(where: { status: { _eq: "done" } }) {
      aggregate {
        count
      }
    }
  }
`;

// export const GetRiskStatistics = gql`
//   query GetRiskStatistics {
//     all: risk_assessment_report_aggregate {
//       aggregate {
//         count
//       }
//     }
//     new: risk_assessment_report_aggregate(where: { status: { _eq: "new" } }) {
//       aggregate {
//         count
//       }
//     }
//     done: risk_assessment_report_aggregate(where: { status: { _eq: "done" } }) {
//       aggregate {
//         count
//       }
//     }
//   }
// `;

export const getRiskReportWithDetails = gql`
  query getRiskReportWithDetails($report_id: Int!, $branch_id: Int!) {
    report: risk_assessment_report_by_pk(id: $report_id) {
      id
      status
      created_at
      report_url
      updated_at
      organization_id
      user {
        display_name
      }
      branch {
        id
        name
        name_en
      }
    }
    items: risk_assessment_branch_items(
      where: { branch_id: { _eq: $branch_id } }
    ) {
      category_id
      category {
        id
        name
        name_en
      }
      item {
        id
        title
        title_en
        details: report_details(where: { report_id: { _eq: $report_id } }) {
          id
          comment
          image
          isNormal: status
          nonormal: item_non_normal_state {
            id
            title
            title_en
          }
        }
      }
    }
  }
`;

export const GetRiskCategories = gql`
  query GetRiskCategories($isNeglected: Boolean!) {
    risk_assessment_category(
      order_by: { created_at: desc }
      where: { is_neglected: { _eq: $isNeglected } }
    ) {
      id
      name
      name_en
      precentage
      updated_at
      created_at
      is_neglected
    }
  }
`;

export const GetItemsCategoryRisk = gql`
  query GetItemsCategoryRisk($category_id: Int!, $isNeglected: Boolean!) {
    risk_assessment_items(
      where: {
        category_id: { _eq: $category_id }
        is_neglected: { _eq: $isNeglected }
      }
    ) {
      percentage
      title
      title_en
      updated_at
      created_at
      is_neglected
      id
    }
  }
`;

export const GetNoneNormalState = gql`
  query GetNoneNormalState($itemId: Int!, $isNegelected: Boolean!) {
    risk_assessment_item_non_normal_state(
      where: { item_id: { _eq: $itemId }, is_neglected: { _eq: $isNegelected } }
    ) {
      id
      created_at
      title
      title_en
      updated_at
      is_neglected
    }
  }
`;

export const TriggerCatigoriesRisk = gql`
  mutation TriggerCatigoriesRisk($ItemId: Int!, $isNegelected: Boolean!) {
    update_risk_assessment_category_by_pk(
      pk_columns: { id: $ItemId }
      _set: { is_neglected: $isNegelected }
    ) {
      id
    }
  }
`;
export const SingleRiskAssment = gql`
  query SingleRiskAssment($id: Int!) {
    risk_assessment_category_by_pk(id: $id) {
      id
      name
      name_en
      precentage
    }
  }
`;

export const AddRiskCats = gql`
  mutation AddRiskCats($name: String, $name_en: String, $percentage: float8!) {
    insert_risk_assessment_category_one(
      object: { name: $name, name_en: $name_en, precentage: $percentage }
    ) {
      id
    }
  }
`;

export const UpdateRisk = gql`
  mutation UpdateRisk(
    $name: String!
    $name_en: String!
    $percentage: float8!
    $id: Int!
  ) {
    update_risk_assessment_category_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, name_en: $name_en, precentage: $percentage }
    ) {
      id
    }
  }
`;
export const triggerNeglectedRiskItems = gql`
  mutation triggerNeglectedRiskItems($ItemId: Int!, $isNegelected: Boolean!) {
    update_risk_assessment_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { is_neglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const SingleRiskItems = gql`
  query SingleRiskItems($id: Int!) {
    risk_assessment_items_by_pk(id: $id) {
      id
      title
      title_en
    }
  }
`;

export const UpdateRiskItems = gql`
  mutation UpdateRiskItems($name: String!, $name_en: String!, $ItemId: Int!) {
    update_risk_assessment_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { title: $name, title_en: $name_en }
    ) {
      id
    }
  }
`;

export const AddRiskItems = gql`
  mutation AddRiskItems($name: String, $name_en: String, $category_id: Int!) {
    insert_risk_assessment_items(
      objects: {
        title: $name
        title_en: $name_en
        category_id: $category_id
        is_neglected: false
      }
    ) {
      affected_rows
    }
  }
`;

export const NoneNormalStateTrigger = gql`
  mutation NoneNormalStateTrigger($ItemId: Int!, $isNegelected: Boolean!) {
    update_risk_assessment_item_non_normal_state_by_pk(
      pk_columns: { id: $ItemId }
      _set: { is_neglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const UpdateNonNormalState = gql`
  mutation UpdateNonNormalState(
    $name: String!
    $name_en: String!
    $ItemId: Int!
  ) {
    update_risk_assessment_item_non_normal_state_by_pk(
      pk_columns: { id: $ItemId }
      _set: { title: $name, title_en: $name_en }
    ) {
      id
    }
  }
`;

export const AddNoneNormalState = gql`
  mutation AddNoneNormalState(
    $name: String
    $name_en: String
    $category_id: Int!
  ) {
    insert_risk_assessment_item_non_normal_state(
      objects: {
        title: $name
        title_en: $name_en
        item_id: $category_id
        is_neglected: false
      }
    ) {
      affected_rows
    }
  }
`;

export const SingleNoneNormalState = gql`
  query SingleNoneNormalState($id: Int!) {
    risk_assessment_item_non_normal_state_by_pk(id: $id) {
      id
      title
      title_en
    }
  }
`;

export const RiskAssessmentPercentagePerBranch = gql`
  {
    branches: organization_branch {
      id
      name
      name_en
      branch_items {
        item_id
        category_id
        percentage
        category {
          precentage
        }
      }
      latest_report: risk_reports(order_by: { created_at: desc }, limit: 1) {
        report_details {
          status
          item_id
        }
        created_at
      }
    }
  }
`;

export const finishRiskReport = gql`
  mutation finishRiskReport($reportId: Int!, $status: String!) {
    update_risk_assessment_report_by_pk(
      pk_columns: { id: $reportId }
      _set: { status: $status }
    ) {
      id
    }
  }
`;
