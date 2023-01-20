import { useSubscription } from "@apollo/react-hooks";
import {
  CButton,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import { FiCheck, FiDelete } from "react-icons/fi";
import Error from "src/reusable/Error";
import ImagesViewer from "src/reusable/ImagesViewer";
import Loader from "src/reusable/Loader";
import CommentsList from "src/views/comments/CommentsList";
import CommentsQueries from "src/views/comments/CommentsQueries";

const ItemDetailWithComment = ({ reportId, item, onClose }) => {
    console.log(item);
  const { loading, error, data } = useSubscription(CommentsQueries.risk.get, {
    variables: { topicId: item.id, reportId: reportId },
  });

  const { t, i18n } = useTranslation();
  console.log(item);
  return (
    <div>
      <>
        <CNavbar expandable="sm" color="faded" light>
          <CNavbarBrand style={{ fontSize: "0.9rem" }}>
            {i18n.language == "ar" ? item.name : item.name_en}
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
              <CButton color={item.isNormal ? "green" : "red"}>
                {" "}
                {item.isNormal ? <FiCheck /> : <FiDelete />}{" "}
                {item.isNormal ? t("normal") : t("nonNormal")}
              </CButton>
              <CButton
                onClick={() => {
                  window.location.reload();
                }}
                color="danger"
                shape="pill"
                size="md"
              >
                <FaTimes /> {"  "}
                {t("closeComments")}
              </CButton>
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
        <pre />

        {item.isNormal ? (
          <>
            <pre />
            <p>{item.comment}</p>
            <CContainer style={{ paddingLeft: 35 }}>
              <CRow xs={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }}>
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
                  <CRow xs={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }}>
                    <ImagesViewer images={d.images} />
                  </CRow>
                </CContainer>
              </>
            ))}
          </>
        )}
      </>

      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <CommentsList
          comments={data.comments}
          mutation={CommentsQueries.risk.insert}
          rootVars={{ topicId: item.id, reportId: reportId }}
        />
      )}
    </div>
  );
};

export default ItemDetailWithComment;
