import gql from "graphql-tag";

export const OrganizationBranch = gql`
  subscription OrganizationBranch {
    organization_branch {
      id
      name
      name_en
    }
  }
`;
