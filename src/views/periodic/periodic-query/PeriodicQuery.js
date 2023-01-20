import gql from "graphql-tag";

export const ListperiodicRebort = gql`
  query ListperiodicRebort(
    $filter: monthely_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    monthely_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      id
      org_level_serial
      branch_id
      month
      year
      status
      created_at
      updated_at
      is_normal
      report_url
      monthely_branch {
        name
        name_en
      }
      user {
        display_name
      }
    }
    reports: monthely_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GetPeriodicStatistics = gql`
  query GetPeriodicStatistics {
    all: monthely_report_aggregate {
      aggregate {
        count
      }
    }
    new: monthely_report_aggregate(where: { status: { _eq: 0 } }) {
      aggregate {
        count
      }
    }
    review: monthely_report_aggregate(where: { status: { _eq: 1 } }) {
      aggregate {
        count
      }
    }
    done: monthely_report_aggregate(where: { status: { _eq: 2 } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GetReportDetails = gql`
  query GetReportDetails($report_id: Int!, $branch_id: Int!) {
    report: monthely_report_by_pk(id: $report_id) {
      id
      month
      year
      status
      created_at
      report_url
      updated_at
      user {
        display_name
      }
      branch: monthely_branch {
        id
        name
        name_en
      }
    }
    items: monthely_branch_items(where: { branch_id: { _eq: $branch_id } }) {
      category_id
      category {
        id
        name
        name_en
      }
      item {
        id
        name
        name_en
        detail: report_details(
          where: { monthely_report_id: { _eq: $report_id } }
          limit: 1
        ) {
          id
          comment
          images
          is_normal
        }
      }
    }
  }
`;

export const PeriodicCats = gql`
  query PeriodicCats($isNeglected: Boolean!) {
    monthely_categories(
      order_by: { created_at: desc }
      where: { is_neglected: { _eq: $isNeglected } }
    ) {
      name
      name_en
      id
      updated_at
      created_at
      is_neglected
    }
  }
`;

export const TriggerPeriodic = gql`
  mutation TriggerPeriodic($ItemId: Int!, $isNegelected: Boolean!) {
    update_monthely_categories_by_pk(
      pk_columns: { id: $ItemId }
      _set: { is_neglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const MontlyItems = gql`
  query MontlyItems($category_id: Int!, $isNegelected: Boolean!) {
    monthely_items(
      where: {
        category_id: { _eq: $category_id }
        is_neglected: { _eq: $isNegelected }
      }
    ) {
      created_at
      name
      name_en
      updated_at
      images_number
      is_neglected
      id
    }
  }
`;
export const PeriodicComments = gql`
  subscription PeriodicComments($reprtID: Int!) {
    monthely_report_comments(
      where: { report_detail: { monthely_report_id: { _eq: $reprtID } } }
    ) {
      comment_text
      created_at
      id
      images
      user {
        display_name
        avatar
        is_activated
        user_group
      }
    }
  }
`;

export const GetSinglePeriodic = gql`
  query GetSinglePeriodic($id: Int!) {
    monthely_categories_by_pk(id: $id) {
      id
      name
      name_en
    }
  }
`;

export const AddCAtsPeriodic = gql`
  mutation AddCAtsPeriodic($name: String, $name_en: String) {
    insert_monthely_categories_one(object: { name: $name, name_en: $name_en }) {
      id
    }
  }
`;

export const CreatePeriodiceCats = gql`
  mutation CreatePeriodiceCats($name: String!, $name_en: String!, $id: Int!) {
    update_monthely_categories_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, name_en: $name_en }
    ) {
      id
    }
  }
`;

export const PeriodicItemsTrigger = gql`
  mutation PeriodicItemsTrigger($ItemId: Int!, $isNegelected: Boolean!) {
    update_monthely_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { is_neglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const SinglePeriodicItems = gql`
  query SinglePeriodicItems($id: Int!) {
    monthely_items_by_pk(id: $id) {
      id
      name
      name_en
    }
  }
`;

export const UpdatePeriodiceItems = gql`
  mutation UpdatePeriodiceItems(
    $name: String!
    $name_en: String!
    $ItemId: Int!
    $images_number: Int!
  ) {
    update_monthely_items_by_pk(
      pk_columns: { id: $ItemId }
      _set: { name: $name, name_en: $name_en, images_number: $images_number }
    ) {
      id
    }
  }
`;

export const AddPeriodicItems = gql`
  mutation AddPeriodicItems(
    $name: String
    $name_en: String
    $category_id: Int!
    $images_number: Int!
  ) {
    insert_monthely_items(
      objects: {
        name: $name
        name_en: $name_en
        category_id: $category_id
        images_number: $images_number
        is_neglected: false
      }
    ) {
      affected_rows
    }
  }
`;

// {"reportId": reportId, "status": 1}
export const FinishPeriodicReport = gql`
  mutation finishPeriodicReport($reportId: Int!, $status: Int!) {
    result: update_monthely_report_by_pk(
      pk_columns: { id: $reportId }
      _set: { status: $status }
    ) {
      id
    }
  }
`;
