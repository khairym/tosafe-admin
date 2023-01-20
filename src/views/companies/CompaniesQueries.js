import gql from "graphql-tag";

export const GetCompanies = gql`
  query getMyCompanies($isConfirmed: Boolean) {
    companies: organization_company_maintain_organization(
      where: { isConfirmed: { _eq: $isConfirmed } }
    ) {
      company_id
      isConfirmed
      count: company_branches_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const AddCompany = gql`
  mutation requestCompanyMaintainance($companyId: String!) {
    insert_organization_company_maintain_organization_one(
      object: { company_id: $companyId }
    ) {
      company_id
    }
  }
`;

export const DeleteCompanyFromOrganization = gql`
  mutation deleteCompanyMaintainOrganization(
    $companyId: String!
    $organizationId: String!
  ) {
    delete_organization_company_maintain_organization_by_pk(
      company_id: $companyId
      organization_id: $organizationId
    ) {
      organization_id
    }
  }
`;
