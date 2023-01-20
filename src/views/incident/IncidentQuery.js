import gql from "graphql-tag";

export const QIncidentList = gql`
  query IncidentRebort(
    $filter: incident_report_bool_exp!
    $offset: Int
    $limit: Int
  ) {
    incident_report(
      order_by: { created_at: desc }
      where: $filter
      limit: $limit
      offset: $offset
    ) {
      id
      org_level_serial
      report_url
      created_at
      incident_date
      incident_description
      updated_at
      created_by
      branch {
        id
        name
        name_en
        neighborhood {
          name
          name_en
        }
      }
      status
      user {
        display_name
      }
    }
    reports: incident_report_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const IncidentLenghtj = gql`
  query IncidentLenghtj {
    all: incident_report_aggregate {
      aggregate {
        count
      }
    }

    new: incident_report_aggregate(where: { status: { _eq: 0 } }) {
      aggregate {
        count
      }
    }

    done: incident_report_aggregate(where: { status: { _eq: 1 } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GetIncidentDetails = gql`
  query getIncidentReportDetails($reportId: Int!) {
    report: incident_report_by_pk(id: $reportId) {
      report_url
      anyone_injured
      branch_id
      created_at
      chance_of_occurence
      engineer_to_whome_reported
      engineer_signature
      engineer_reported_to_dept
      engineer_action_taken
      status
      employee_signature
      engineer_to_whome_reported
      report_for
      your_action
      witnesses_names
      what_could_be_done_to_prevent_this
      what_were_you_doing
      reported_for_manager
      occurence_location
      incident_description
      incident_date
      id
      manager_action_to_prevent
      manager_incident_cause
      manager_signature
      manager_require_revision
      engineer_corrective_actions
      images
      step
      branch {
        id
        name
        name_en
      }
      user {
        display_name
      }
    }
  }
`;
