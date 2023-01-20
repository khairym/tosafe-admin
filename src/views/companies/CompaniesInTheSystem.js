import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import Axios from "../../axios";
import { CButton } from "@coreui/react";
import { withTranslation, useTranslation } from "react-i18next";
import {
  AddCompany,
  DeleteCompanyFromOrganization,
  GetCompanies,
} from "./CompaniesQueries";
import NoData from "src/reusable/NoData";
import { parseId } from "src/utils";

const CompaniesInTheSystem = ({ title, isConfirmed }) => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  function fetchData() {
    Axios(null, "organizations/?active=true&type=maintenance_company", "GET")
      .then((response) => {
        console.log(response.data);
        setLoadingCompanies(false);
        setCompanies(response.data);
      })
      .catch((err) => {
        console.log("err ---", err);
        setLoadingCompanies(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const { loading, error, data } = useQuery(GetCompanies, {
    variables: { isConfirmed: isConfirmed },
    pollInterval: 1000,
  });

  if (loading || loadingCompanies) return <Loader />;
  if (error) {
    return <Error />;
  }

  const subscribedCompanies = data.companies.map((c) => c.company_id);

  const otherCompanies = companies.filter(
    (c) => subscribedCompanies.indexOf(c.id) > -1
  );

  return (
    <table className="table table-hover mb-0 d-none d-sm-table">
      <thead className="thead-light">
        <tr>
          <th colSpan="2">{title}</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {!otherCompanies.length && <NoData />}
        {otherCompanies.map((company, index) => (
          <tr>
            <td className="text-center">
              <div className="c-avatar">
                <img
                  alt="Company"
                  src={company.logo}
                  className="c-avatar-img"
                />
              </div>
            </td>
            <td>
              <div>{company.name}</div>
            </td>
            <td className="text-center">
              {isConfirmed && data.companies[index].count.aggregate.count ? (
                <p>{t("cantDelete")}</p>
              ) : (
                <RemoveCompanyButton
                  t={t}
                  isConfirmed={isConfirmed}
                  companyId={company.id}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const RemoveCompanyButton = ({ isConfirmed, t, companyId }) => {
  const [onRemove, { loading }] = useMutation(DeleteCompanyFromOrganization, {
    onCompleted: (da) => {},
  });

  if (loading) return <Loader />;

  return (
    <CButton
      color={isConfirmed ? "danger" : "warning"}
      shape="square"
      size="sm"
      onClick={() => {
        onRemove({
          variables: { companyId: companyId, organizationId: parseId() },
        });
      }}
    >
      {isConfirmed ? t("removeSubscription") : t("cancelRequest")}
    </CButton>
  );
};

export default withTranslation()(CompaniesInTheSystem);
