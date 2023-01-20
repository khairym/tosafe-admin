const { default: gql } = require("graphql-tag");

const emergencyQuery = gql`
  query getEmergencyReportCreators {
    report: emergency_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

const periodicQuery = gql`
  query getPeriodicReportCreators {
    report: monthely_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

const riskQuery = gql`
  query getRiskReportCreators {
    report: risk_assessment_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

const trainingQuery = gql`
  query getTrainingkReportCreators {
    report: training_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

const internalQuery = gql`
  query getInternalReportCreators {
    report: internal_maintainance_report(distinct_on: user_id) {
      user {
        id
        display_name
      }
    }
  }
`;

const externalQuery = gql`
  query getExternalReportCreators {
    report: external_maintainance_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

const incidentQuery = gql`
  query getTrainingkReportCreators {
    report: incident_report(distinct_on: created_by) {
      user {
        id
        display_name
      }
    }
  }
`;

export const CreatorQuery = {
  periodic: periodicQuery,
  risk: riskQuery,
  emergency: emergencyQuery,
  training: trainingQuery,
  internal: internalQuery,
  external: externalQuery,
  incident: incidentQuery,  
};
