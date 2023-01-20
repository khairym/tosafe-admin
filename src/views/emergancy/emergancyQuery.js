import gql from "graphql-tag";

export const QueryEmergancyList = gql`
  query QEmergancyList(
    $filter: emergency_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    emergency_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      id
      org_level_serial
      report_url
      updated_at
      created_at
      description
      assets
      branch {
        name
        name_en
      }
      user {
        display_name
      }
      status
      engineer_assets
      report_departments {
        technical_department {
          name
          name_en
        }
      }
    }
    reports: emergency_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const EmergancyRebortStaistic = gql`
  query EmergancyRebortStaistic {
    all: emergency_report_aggregate {
      aggregate {
        count
      }
    }
    new: emergency_report_aggregate(where: { status: { _eq: true } }) {
      aggregate {
        count
      }
    }
    done: emergency_report_aggregate(where: { status: { _eq: false } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GetEmergencyReportDetails = gql`
  query getTrainignWithEmployees($reportId: Int!) {
    report: emergency_report_by_pk(id: $reportId) {
      id
      created_at
      status
      description
      assets
      engineer_assets
      report_url
      user {
        display_name
      }
      branch {
        name
        name_en
        id
      }
    }
  }
`;
