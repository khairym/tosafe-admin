import React, { useState } from "react";
import BranchesDrobdown from "src/reusable/filters/BranchesDrobdown";
import { useTranslation, withTranslation } from "react-i18next";
import {
  CCard,
  CCardHeader,
  CNavbar,
  CNavbarBrand,
  CCollapse,
  CNavbarNav,
  CCardBody,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useQuery } from "@apollo/react-hooks";
import { GetItemsStatistics } from "./QueryExMaintain";
import ChartBarSimple from "src/views/charts/ChartBarSimple";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import PrintButton from "src/reusable/buttons/PrintButton";
import { FiPower } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";

const SparePartsStatistics = () => {
  const { t, i18n } = useTranslation();
  const [branch, setBranch] = useState(0);
  console.log({ branchId: branch });
  const { loading, error, data } = useQuery(GetItemsStatistics, {
    variables: { branchId: branch },
  });

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-chartPie" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>
            {t("sparePartsStatisticsFor")} :{" "}
            <BranchesDrobdown
              branch={branch}
              setBranch={(b) => (b > 0 ? setBranch(b) : setBranch())}
            />
          </CNavbarBrand>

          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              {branch > 0 && (
                <PrintButton
                  id={branch}
                  branch={branch}
                  schema="external_maintainance"
                  name="spare-parts"
                />
              )}
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
      </CCardHeader>
      <CCardBody>
        {loading && <p>{t("loadingReportStatistics")} </p>}
        {data &&
          data.categories.map(
            (cat) =>
              cat.items.length > 0 && (
                <>
                  <table className="table mb-0 d-none d-sm-table">
                    <thead>
                      <tr>
                        <th colSpan="2">
                          <h4>
                            <FaCaretDown />{" "}
                            {i18n.language == "ar" ? cat.name : cat.name_en}
                          </h4>
                        </th>
                        <th>{t("sparePartsStatisticsLabel")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map(
                        (item) =>
                          item.amountsSum.aggregate.sum.amount && (
                            <tr>
                              <td
                                style={{ verticalAlign: "middle !important" }}
                                className="text-center"
                              >
                                <h4>
                                  {i18n.language == "ar"
                                    ? item.name
                                    : item.name_en}
                                </h4>
                              </td>
                              <td
                                style={{ verticalAlign: "middle !important" }}
                              >
                                <div>
                                  <b># {t("totalItemsConsumed")} :</b>
                                  <b style={{ fontSize: 16 }}>
                                    {item.amountsSum.aggregate.sum.amount
                                      ? item.amountsSum.aggregate.sum.amount
                                      : 0}
                                  </b>
                                </div>
                              </td>
                              <td style={{ width: "40%" }}>
                                <ChartBarSimple
                                  label={t("amountOverReports")}
                                  dataPoints={item.amounts.map((i) => i.amount)}
                                />
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </>
              )
          )}
      </CCardBody>
    </CCard>
  );
};

export default withTranslation()(SparePartsStatistics);
