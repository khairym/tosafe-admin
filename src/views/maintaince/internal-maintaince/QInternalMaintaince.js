import gql from "graphql-tag";

export const InternalReportQuery = gql`
  query getInternalMaintenanceReports(
    $filter: internal_maintainance_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    internal_maintainance_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      branch {
        id
        name
        name_en
      }
      description
      category {
        name
        name_en
        created_at
      }
      user {
        display_name
      }
      engineer: userByEngineer {
        display_name
      }
      status
      orderType
      images
      id
      org_level_serial
      report_url
      title
      updated_at
      created_at
      visit_date
    }
    reports: internal_maintainance_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const InternalMaintenanceEngineers = gql`
  {
    engineers: users_user(
      where: { user_group: { _eq: "maintainance_engineer" } }
    ) {
      id
      display_name
    }
  }
`;

export const InternalListStatistc = gql`
  query InternalListStatistc {
    all: internal_maintainance_report_aggregate {
      aggregate {
        count
      }
    }
    new: internal_maintainance_report_aggregate(
      where: { status: { _eq: "0" } }
    ) {
      aggregate {
        count
      }
    }
    done: internal_maintainance_report_aggregate(
      where: { status: { _eq: "1" } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GetReportDetails = gql`
  query GetReportDetails($reportId: Int!) {
    report: internal_maintainance_report_by_pk(id: $reportId) {
      branch {
        id
        name
        name_en
      }
      user {
        display_name
      }
      engineer: userByEngineer {
        display_name
      }
      description
      category {
        name
        name_en
        created_at
      }
      status
      orderType
      images
      report_url
      id
      title
      updated_at
      created_at
      visit_date
    }
  }
`;

export const SetAppointment = gql`
  mutation setAppointment($id: Int!, $engineer: uuid!, $visit_date: date!) {
    update_internal_maintainance_report_by_pk(
      pk_columns: { id: $id }
      _set: { engineer: $engineer, visit_date: $visit_date }
    ) {
      id
    }
  }
`;
