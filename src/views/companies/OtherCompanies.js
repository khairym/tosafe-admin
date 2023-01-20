import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import Axios from "../../axios";
import { CButton } from "@coreui/react";
import { withTranslation, useTranslation } from "react-i18next";
import { AddCompany, GetCompanies } from "./CompaniesQueries";

const OtherCompanies = ({ title }) => {
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
    pollInterval: 1000,
  });

  if (loading || loadingCompanies) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  const subscribedCompanies = data.companies.map((c) => c.company_id);
  console.log(subscribedCompanies);
  const otherCompanies = companies.filter(
    (c) => subscribedCompanies.indexOf(c.id) == -1
  );

  return (
    <table className="table table-hover mb-0 d-none d-sm-table">
      <thead className="thead-light">
        <tr>
          <th colSpan="2">{title}</th>
          <th> </th>
          {/* <th className="text-center"> </th> */}
        </tr>
      </thead>
      <tbody>
        {otherCompanies.map((company) => (
          <tr>
            <td className="text-center">
              <div className="c-avatar">
                <img
                  width={80}
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
              <AddCompanyButton companyId={company.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AddCompanyButton = ({ companyId }) => {
  const { t } = useTranslation();

  const [onAdd, { loading }] = useMutation(AddCompany, {
    onCompleted: (da) => {},
  });

  if (loading) return <Loader />;
  return (
    <CButton
      color="info"
      shape="square"
      size="sm"
      onClick={() => {
        onAdd({ variables: { companyId } });
      }}
    >
      {t("subscribe")}
    </CButton>
  );
};

export default withTranslation()(OtherCompanies);
