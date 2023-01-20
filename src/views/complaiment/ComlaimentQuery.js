import gql from "graphql-tag";

export const QComplaimentList = gql`
  query GetComplaintsReport(
    $filter: complaints_report_bool_exp
    $offset: Int
    $limit: Int
  ) {
    complaints_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      assets
      created_at
      description
      id
      org_level_serial
      status
      updated_at
      branch {
        name
        name_en
      }
      user {
        display_name
      }
    }
    all: complaints_report_aggregate {
      aggregate {
        count
      }
    }
    new: complaints_report_aggregate(where: { status: { _eq: false } }) {
      aggregate {
        count
      }
    }

    done: complaints_report_aggregate(where: { status: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

export const ComplaintReportDetail = gql`
  query getComplaintsDetails($reportId: Int!) {
    report: complaints_report_by_pk(id: $reportId) {
      assets
      created_at
      description
      id
      org_level_serial
      status
      updated_at
      engineer_assets
      engineer_review
      branch {
        name
        name_en
      }
      user {
        display_name
      }
    }
  }
`;
