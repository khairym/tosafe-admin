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

import { FiInfo, FiList, FiCheck, FiDelete } from "react-icons/fi";

import {
  finishRiskReport,
  getRiskReportWithDetails,
} from "../risk-query/RiskListQuery";
import PrintButton from "src/reusable/buttons/PrintButton";

import { getDate } from "src/utils";
import { Table } from "reactstrap";

import _ from "lodash";
import ImagesViewer from "src/reusable/ImagesViewer";
import DiscussionButton from "src/reusable/buttons/DiscussionButton";
import ItemDetailWithComment from "./ItemDetailsWithComments";
import FinishReportButton from "src/reusable/buttons/FinishReportButton";

const RiskDetails = ({ match }) => {
  const vars = {
    report_id: match.params.reportId,
    branch_id: match.params.branchId,
  };
  const { t, i18n } = useTranslation();

  const [currentItem, setCurrentItem] = useState();

  const { error, loading, data, refetch } = useQuery(getRiskReportWithDetails, {
    variables: vars,
  });

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Error />;
  }

  if (!data.report) return <p>{t("thisreportisnotfound")}</p>;

  let finalResult = {
    report: { ...data.report },
    items: [],
  };

  const groupedList = _.groupBy(data.items, "category_id");

  const finalItems = [];

  for (const key in groupedList) {
    if (Object.hasOwnProperty.call(groupedList, key)) {
      const elements = groupedList[key];
      const cat = elements[0]["category"];

      const itt = elements.map((el) => {
        const isNormal =
          el.item.details.length > 0 ? el.item.details[0].isNormal : true;
        if (isNormal) {
          const images = el.item.details.length
            ? el.item.details[0].image?.split(",")
            : [];
          const comment = el.item.details.length
            ? el.item.details[0].comment
            : "";
          return {
            id: el.item.id,
            isNormal,
            images,
            comment,
            name: el.item.title,
            name_en: el.item.title_en,
          };
        } else {
          const tunedDetails = el.item.details.map((det) => {
            return {
              images: det.image?.split(","),
              comment: det.comment,
              name: det.nonormal.title,
              name: det.nonormal.title_en,
            };
          });

          return {
            id: el.item.id,
            isNormal,
            name: el.item.title,
            name_en: el.item.title_en,
            details: tunedDetails,
          };
        }
      });

      finalItems.push({
        ...cat,
        items: itt,
      });
    }
  }

  finalResult.items = finalItems;

  return (
    <CCard>
      <CCardHeader>
        <CNavbar expandable="sm" color="faded" light>
          <CIcon name="cil-tags" customClasses="c-sidebar-nav-icon" />
          <CNavbarBrand>{t("riskAssessmentReportDetails")}</CNavbarBrand>

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
                schema="risk_assessment"
                name="report"
              />{" "}
              <FinishReportButton
                refetch={refetch}
                mutation={finishRiskReport}
                variables={{
                  reportId: match.params.reportId,
                  status: "done",
                }}
              />
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
                  <b>{t("createdBy")}</b>
                </td>
                <td>{data.report.user?.display_name}</td>
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
                reportId={match.params.reportId}
                onClose={() => setCurrentItem()}
              />
            ) : (
              <>
                <h5 className="report-section-header">
                  <FiList /> {t("detail")}
                </h5>

                <ol>
                  {finalResult.items.map((i, index) => (
                    <li key={`category${index}`} className="category">
                      {i18n.language == "ar" ? i.name : i.name_en}

                      <ol>
                        {i.items.map((item, itemIndex) => (
                          <li key={`item${itemIndex}`} className="item">
                            <CNavbar expandable="sm" color="faded" light>
                              <CNavbarBrand style={{ fontSize: "0.9rem" }}>
                                {i18n.language == "ar"
                                  ? item.name
                                  : item.name_en}
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
                                    color={item.isNormal ? "green" : "red"}
                                  >
                                    {" "}
                                    {item.isNormal ? (
                                      <FiCheck />
                                    ) : (
                                      <FiDelete />
                                    )}{" "}
                                    {item.isNormal
                                      ? t("normal")
                                      : t("nonNormal")}
                                  </CButton>
                                  <DiscussionButton
                                    onClick={() => {
                                      setCurrentItem(item);
                                    }}
                                  />
                                </CNavbarNav>
                              </CCollapse>
                            </CNavbar>
                            {item.isNormal ? (
                              <>
                                <pre />
                                <p>{item.comment}</p>
                                <CContainer style={{ paddingLeft: 35 }}>
                                  <CRow
                                    xs={{ cols: 2 }}
                                    md={{ cols: 3 }}
                                    lg={{ cols: 4 }}
                                  >
                                    <ImagesViewer images={item.images} />
                                  </CRow>
                                </CContainer>
                              </>
                            ) : (
                              <>
                                {item.details.map((d) => (
                                  <>
                                    <pre />
                                    <p>{d.comment}</p>
                                    <CContainer style={{ paddingLeft: 35 }}>
                                      <CRow
                                        xs={{ cols: 2 }}
                                        md={{ cols: 3 }}
                                        lg={{ cols: 4 }}
                                      >
                                        <ImagesViewer images={d.images} />
                                      </CRow>
                                    </CContainer>
                                  </>
                                ))}
                              </>
                            )}
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

RiskDetails.propTypes = {};

export default withTranslation()(RiskDetails);
