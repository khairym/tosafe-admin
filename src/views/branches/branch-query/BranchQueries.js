import gql from "graphql-tag";

export const GetBranches = gql`
  query Branches($isNeglected: Boolean!) {
    organization_branch(where: { isNeglected: { _eq: $isNeglected } }) {
      id
      name
      name_en
      about
      branch_number
      contact_numbers
      created_at
      updated_at
      isNeglected
      user {
        display_name
      }
      neighborhood {
        name
        name_en
      }
    }
  }
`;

export const GetSingleBranch = gql`
  query getSingleBranch($id: Int!) {
    branch: organization_branch_by_pk(id: $id) {
      id
      name
      name_en
      branch_number
      contact_numbers
      branch_manager
      neighborhood_id
    }
    employees: users_user(
      where: { belongsTo: { _eq: $id }, user_group: { _eq: "branch_employee" } }
    ) {
      id
      display_name
      employeeNumber
    }
    cities: master_city(where: { isNeglected: { _eq: false } }) {
      id
      name
      name_en
      areas(where: { isNeglected: { _eq: false } }) {
        id
        name
        name_en
      }
    }
  }
`;

export const TriggerBranchNeglect = gql`
  mutation triggerNeglected($branchId: Int!, $isNegelected: Boolean!) {
    update_organization_branch_by_pk(
      pk_columns: { id: $branchId }
      _set: { isNeglected: $isNegelected }
    ) {
      id
    }
  }
`;

export const UpdateBranch = gql`
  mutation updateBranch(
    $branchId: Int!
    $name: String!
    $name_en: String!
    $branchNumber: Int!
    $branchManager: uuid
    $contact_numbers: String!
    $neighborhood_id: Int!
  ) {
    update_organization_branch_by_pk(
      pk_columns: { id: $branchId }
      _set: {
        name: $name
        name_en: $name_en
        contact_numbers: $contact_numbers
        branch_number: $branchNumber
        branch_manager: $branchManager
        neighborhood_id: $neighborhood_id
      }
    ) {
      id
    }
  }
`;

export const InsertBranch = gql`
  mutation insertBranch(
    $name: String!
    $name_en: String!
    $branchNumber: Int!
    $contact_numbers: String!
    $neighborhood_id: Int!
  ) {
    insert_organization_branch_one(
      object: {
        name: $name
        name_en: $name_en
        contact_numbers: $contact_numbers
        branch_number: $branchNumber
        neighborhood_id: $neighborhood_id
      }
    ) {
      id
    }
  }
`;

export const GetBranchItems = gql`
  query getBranchItems($branchId: Int!) {
    periodic: monthely_branch_items(where: { branch_id: { _eq: $branchId } }) {
      item_id
    }
    risk: risk_assessment_branch_items(
      where: { branch_id: { _eq: $branchId } }
    ) {
      item_id
    }
  }
`;

export const GetBranchCompanies = gql`
  query getBranchCompanies($branchId: Int!) {
    companies: organization_company_maintain_branches(
      where: { branch_id: { _eq: $branchId } }
    ) {
      company_id
    }
    orgCompanies: organization_company_maintain_organization(
      where: { isConfirmed: { _eq: true } }
    ) {
      company_id
    }
  }
`;

export const InsertCompanyMaintainBranch = gql`
  mutation insertCompanyMaintainBranch($companyId: String!, $branchId: Int!) {
    insert_organization_company_maintain_branches_one(
      object: { company_id: $companyId, branch_id: $branchId }
    ) {
      company_id
    }
  }
`;

export const RemoveCompanyMaintainBranch = gql`
  mutation companyMaintainBranch($companyId: String!, $branchId: Int!) {
    delete_organization_company_maintain_branches_by_pk(
      company_id: $companyId
      branch_id: $branchId
    ) {
      company_id
    }
  }
`;

export const GetBranchPeriodicItems = gql`
  query getBranchPeriodicItems($branchId: Int!) {
    items: monthely_branch_items(where: { branch_id: { _eq: $branchId } }) {
      item_id
    }
    categories: monthely_categories {
      id
      name
      name_en
      items {
        id
        name
        name_en
      }
    }
  }
`;

export const GetBranchRiskItems = gql`
  query getBranchRiskItems($branchId: Int!) {
    items: risk_assessment_branch_items(
      where: { branch_id: { _eq: $branchId } }
    ) {
      item_id
      percentage
    }
    categories: risk_assessment_category {
      id
      name
      name_en
      precentage
      items {
        id
        name: title
        name_en: title_en
      }
    }
  }
`;

export const InsertBranchPeriodicItem = gql`
  mutation insertBranchPeriodicItem(
    $categoryId: Int!
    $itemId: Int!
    $branchId: Int!
  ) {
    insert_monthely_branch_items_one(
      object: {
        category_id: $categoryId
        item_id: $itemId
        branch_id: $branchId
      }
    ) {
      item_id
    }
  }
`;

export const InsertBranchRiskItem = gql`
  mutation insertBranchRiskItem(
    $categoryId: Int!
    $itemId: Int!
    $branchId: Int!
    $percentage: numeric!
  ) {
    insert_risk_assessment_branch_items_one(
      object: {
        category_id: $categoryId
        item_id: $itemId
        branch_id: $branchId
        percentage: $percentage
      }
    ) {
      item_id
    }
  }
`;

export const UpdateBranchRiskItem = gql`
  mutation insertBranchRiskItem(
    $categoryId: Int!
    $itemId: Int!
    $branchId: Int!
    $percentage: numeric!
  ) {
    update_risk_assessment_branch_items_by_pk(
      pk_columns: {
        category_id: $categoryId
        item_id: $itemId
        branch_id: $branchId
      }
      _set: { percentage: $percentage }
    ) {
      item_id
    }
  }
`;

export const RemovePeriodicItem = gql`
  mutation removePeriodicItem(
    $categoryId: Int!
    $itemId: Int!
    $branchId: Int!
  ) {
    delete_monthely_branch_items_by_pk(
      category_id: $categoryId
      item_id: $itemId
      branch_id: $branchId
    ) {
      item_id
    }
  }
`;

export const RemoveRiskItem = gql`
  mutation removeRiskItem($categoryId: Int!, $itemId: Int!, $branchId: Int!) {
    delete_risk_assessment_branch_items_by_pk(
      category_id: $categoryId
      item_id: $itemId
      branch_id: $branchId
    ) {
      item_id
    }
  }
`;
