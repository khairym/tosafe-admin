import gql from "graphql-tag";

export const GetDashboardStatistics = gql`
  query dashboardStatistics {
    branches: organization_branch_aggregate {
      aggregate {
        count
      }
    }
    departments: organization_technical_department_aggregate {
      aggregate {
        count
      }
    }
    users: users_user_aggregate {
      aggregate {
        count
      }
    }
    companies: organization_company_maintain_branches_aggregate {
      aggregate {
        count
      }
    }
    branches_reports: organization_branch {
      name
      name_en
      monthely: branch_monthely_reports_aggregate {
        aggregate {
          count
        }
      }
      risk: risk_reports_aggregate {
        aggregate {
          count
        }
      }
      training: training_reports_aggregate {
        aggregate {
          count
        }
      }
      incident: incident_reports_aggregate {
        aggregate {
          count
        }
      }
      internal: internal_reports_aggregate {
        aggregate {
          count
        }
      }
      external: external_reports_aggregate {
        aggregate {
          count
        }
      }
      emergency: emergency_reports_aggregate {
        aggregate {
          count
        }
      }
    }
    technichal_departments: organization_technical_department {
      name
      name_en
      report_departments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
