import React from "react";
import { CSelect } from "@coreui/react";
import { useSubscription } from "react-apollo";
import { OrganizationBranch } from "src/queries/orgainziation-branches";
import Loader from "../Loader";
import Error from "../Error";
import { useTranslation, withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import {
  getQueryParam,
  buildCurrentUrlSearchWithThisParams,
  removeQueryParam,
  navigateToLocation,
} from "src/utils";

function BranchesDrobdown({ defaultBranch, onBranchChanges }) {
  const { loading, error, data } = useSubscription(OrganizationBranch);
  const { t } = useTranslation();

  const history = useHistory();
  const { pathname, search } = useLocation();

  const branch = getQueryParam("number", "branch_id", search) || defaultBranch;
  if (loading) return <Loader />;
  if (error) return <Error />;

  const branches = [
    { id: 0, name: t("allBranches") },
    ...data.organization_branch,
  ];

  return (
    <CSelect
      custom
      className="mb-3"
      name="neighbor"
      id="neighbor"
      onChange={(event) => {
        const newSelectedBranch = event.target.value;
        if (onBranchChanges) return onBranchChanges(newSelectedBranch);

        let newLocation;
        if (newSelectedBranch == 0)
          newLocation = `${pathname}${removeQueryParam("branch_id", search)}`;
        else
          newLocation = `${pathname}${buildCurrentUrlSearchWithThisParams(
            "branch_id",
            newSelectedBranch,
            search
          )}`;

        navigateToLocation(`${pathname}${search}`, newLocation, history);
      }}
      value={branch}
    >
      {branches.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </CSelect>
  );
}

export default withTranslation()(BranchesDrobdown);
