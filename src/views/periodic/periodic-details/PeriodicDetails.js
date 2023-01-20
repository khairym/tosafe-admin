import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CCollapse,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CCard,
  CContainer,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useTranslation, withTranslation } from "react-i18next";
import Loader from "src/reusable/Loader";
import Error from "src/reusable/Error";
import { FiCheck, FiDelete, FiInfo, FiList } from "react-icons/fi";
import {
  FinishPeriodicReport,
  GetReportDetails,
} from "../periodic-query/PeriodicQuery";
import PrintButton from "src/reusable/buttons/PrintButton";
import DiscussionButton from "src/reusable/buttons/DiscussionButton";
import { getDate } from "../../../utils";
import { Table } from "reactstrap";
import _ from "lodash";
import ItemDetailWithComment from "./ItemDetailWithComment";
import ImagesViewer from "src/reusable/ImagesViewer";
import FinishReportButton from "src/reusable/buttons/FinishReportButton";

const PeriodicDetails = ({ match }) => {
  const vars = {
    report_id: match.params.reportId,
    branch_id: match.params.branchId,
  };
  const { t, i18n } = useTranslation();
  const [currentItem, setCurrentItem] = useState();

  const { error, loading, data, refetch } = useQuery(GetReportDetails, {
    variables: vars,
  });

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  if (!data.report) return <p>{t("thisreportisnotfound")}</p>;

  let swapArray = [];
  for (let i = 0; i < data.items.length; i++) {
    const element = data.items[i];
    // if (!element.item.detail?.length) continue;
    const detail = element.item.detail?.length ? element.item.detail[0] : {};
    element.item = { ...element.item, ...detail };

    element.item.images = element.item.detail?.length
      ? element.item.detail[0].images.split(",")
      : [];
    delete element.item.detail;

    swapArray.push(element);
  }

  const groupedList = _.groupBy(swapArray, "category_id");

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />

          <CNavbarBrand>
            {t("periodicReports")} {t("forBranch")} {data.report.branch.name_en}{" "}
            ({data.report.month} - {data.report.year})
          </CNavbarBrand>

          <CCollapse
            show={true}
            navbar
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <CNavbarNav className="ml">
              <PrintButton
                size="md"
                url={data.report.report_url}
                id={data.report.id}
                branch={data.report.branch.id}
                schema="monthely"
                name="report"
              />{" "}
              {data.report.status != 2 && (
                <FinishReportButton
                  mutation={FinishPeriodicReport}
                  variables={{ reportId: match.params.reportId, status: 2 }}
                  refetch={refetch}
                />
              )}
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="4" lg="3" sm="12">
            <h5 className="report-section-header">
              <FiInfo /> {t("generalInformation")}
            </h5>
            <Table responsive>
              <tr>
                <td>
                  <b>{t("branch")}</b>
                </td>
                <td>
                  {i18n.language == "ar"
                    ? data.report.branch.name
                    : data.report.branch.name_en}
                </td>
              </tr>
              <tr>
                <td>
                  <b>{t("branchManager")}</b>
                </td>
                <td>{data.report.user?.display_name}</td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <b>{t("monthYear")}</b>
                </td>
                <td>
                  {" "}
                  {data.report.month} - {data.report.year}
                </td>
              </tr>
              <tr>
                <td>
                  <b>{t("createdAt")}</b>
                </td>

                <td>{getDate(data.report.created_at)}</td>
              </tr>
            </Table>
          </CCol>
          <CCol md="8" lg="9" sm="12">
            {currentItem ? (
              <ItemDetailWithComment
                item={currentItem}
                onClose={() => setCurrentItem()}
              />
            ) : (
              <>
                <h5 className="report-section-header">
                  <FiList /> {t("detail")}
                </h5>
                <ol>
                  {Object.entries(groupedList).map((category, index) => (
                    <li key={`category${index}`} className="category">
                      {i18n.language == "ar"
                        ? category[1][0].category.name
                        : category[1][0].category.name_en}
                      <ol>
                        {category[1].map((item, itemIndex) => (
                          <li key={`item${itemIndex}`} className="item">
                            <CNavbar expandable="sm" color="faded" light>
                              <CNavbarBrand style={{ fontSize: "0.9rem" }}>
                                {i18n.language == "ar"
                                  ? item.item.name
                                  : item.item.name_en}
                              </CNavbarBrand>

                              <CCollapse
                                show={true}
                                navbar
                                style={{
                                  justifyContent: "flex-end",
                                  display: "flex",
                                }}
                              >
                                <CNavbarNav className="ml">
                                  <CButton
                                    color={
                                      item.item?.is_normal == false
                                        ? "red"
                                        : "green"
                                    }
                                  >
                                    {" "}
                                    {item.item?.is_normal == false ? (
                                      <FiDelete />
                                    ) : (
                                      <FiCheck />
                                    )}{" "}
                                    {item.item?.is_normal == false
                                      ? t("nonNormal")
                                      : t("normal")}
                                  </CButton>

                                  <DiscussionButton
                                    onClick={() => setCurrentItem(item.item)}
                                  />
                                </CNavbarNav>
                              </CCollapse>
                            </CNavbar>

                            <pre />
                            <p>{item.item?.comment}</p>
                            <CContainer style={{ paddingLeft: 35 }}>
                              <CRow
                                xs={{ cols: 2 }}
                                md={{ cols: 3 }}
                                lg={{ cols: 4 }}
                              >
                                <ImagesViewer images={item.item.images} />
                              </CRow>
                            </CContainer>
                          </li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

PeriodicDetails.propTypes = {};

export default withTranslation()(PeriodicDetails);
