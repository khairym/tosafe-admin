import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";
import {
  GetBranchCompanies,
  InsertCompanyMaintainBranch,
  RemoveCompanyMaintainBranch,
} from "../branch-query/BranchQueries";
import Axios from "../../../axios";
import { CButton, CCol, CRow,   } from "@coreui/react";
import { withTranslation, useTranslation } from "react-i18next";
// import { AddCompany } from "src/views/companies/CompaniesQueries";
import { FaCogs, FaPlus } from "react-icons/fa";

const Companies = ({ id }) => {
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

  const { loading, error, data } = useQuery(GetBranchCompanies, {
    variables: {
      branchId: id,
    },
    pollInterval: 1000,
  });

  if (loading || loadingCompanies) return <Loader />;
  if (error) return <Error />;

  const selectedCompanies = data.companies.map((c) => c.company_id);
  const orgCompanies = data.orgCompanies.map((c) => c.company_id);
  const companiesMaintainBranch = companies.filter(
    (c) => selectedCompanies.indexOf(c.id) > -1
  );
  
  return (
    <CRow>
      <CCol>
        <OtherCompanies
          companies={companies.filter((c) => orgCompanies.indexOf(c.id) > -1)}
          data={data}
          id={id}
        />
      </CCol>
      <CCol>
        <table className="table table-hover mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th colSpan="2">
                <FaCogs /> {t("companiesMaintainBranch")}
              </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {companiesMaintainBranch.map((company) => (
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
                  <RemoveCompanyButton
                    companyId={company.id}
                    branchId={id}
                    t={t}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CCol>
    </CRow>
  );
};

const OtherCompanies = ({ companies, data, id }) => {
  const { t } = useTranslation();

  const selectedCompanies = data.companies.map((c) => c.company_id);

  const otherCompanies = companies.filter(
    (c) => selectedCompanies.indexOf(c.id) == -1
  );
  return (
    <table className="table table-hover mb-0 d-none d-sm-table">
      <thead className="thead-light">
        <tr>
          <th colSpan="2">
            <FaPlus /> {t("otherCompanies")}
          </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {otherCompanies.map((company) => (
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
              <AddCompanyToBranchButton
                companyId={company.id}
                branchId={id}
                t={t}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AddCompanyToBranchButton = ({ companyId, branchId, t }) => {
  const [onAdd, { loading }] = useMutation(InsertCompanyMaintainBranch, {
    onCompleted: (da) => {},
  });

  if (loading) return <Loader />;
  return (
    <CButton
      color="info"
      shape="square"
      size="sm"
      onClick={() => {
        onAdd({
          variables: {
            branchId: branchId,
            companyId: companyId,
          },
        });
      }}
    >
      {t("addCompanyToBranch")}
    </CButton>
  );
};

export const RemoveCompanyButton = ({ companyId, branchId, t }) => {
  const [onRemove, { loading }] = useMutation(RemoveCompanyMaintainBranch, {
    onCompleted: (da) => {},
  });

  if (loading) return <Loader />;

  return (
    <CButton
      color="danger"
      shape="square"
      size="sm"
      onClick={() => {
        onRemove({
          variables: {
            branchId: branchId,
            companyId: companyId,
          },
        });
      }}
    >
      {t("removeCompanyFromBranch")}
    </CButton>
  );
};

export default withTranslation()(Companies);
