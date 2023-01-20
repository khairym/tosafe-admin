import gql from "graphql-tag";

export const TrainingList = gql`
  query TrainingList(
    $filter: training_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    training_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      id
      org_level_serial
      report_url
      occured_at
      status
      training_category
      updated_at
      created_at
      user {
        display_name
      }
      branch {
        id
        name
        name_en
      }
    }
    reports: training_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GetTrainingStatistics = gql`
  query GetTrainingStatistics {
    all: training_report_aggregate {
      aggregate {
        count
      }
    }
    new: training_report_aggregate(where: { status: { _eq: 0 } }) {
      aggregate {
        count
      }
    }
    done: training_report_aggregate(where: { status: { _eq: 1 } }) {
      aggregate {
        count
      }
    }
    canceled: training_report_aggregate(where: { status: { _eq: 2 } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GetTrainingDetails = gql`
  query GetTrainingDetails($traingId: Int!) {
    report: training_report_by_pk(id: $traingId) {
      id
      occured_at
      training_category
      created_at
      report_url
      status
      category_description {
        title
        title_en
        description
        description_en
      }
      branch {
        name
        name_en
        id
      }
      user {
        display_name
      }
      members: report_members {
        signature
        training_report_id
        user {
          employeeNumber
          avatar
          display_name
          permission_group {
            title
            title_en
          }
          id
        }
      }
      branch_id
    }
  }
`;
