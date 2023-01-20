import { useSubscription } from "@apollo/react-hooks";
import {
  CButton,
  CCol,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CRow,
} from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import Error from "src/reusable/Error";
import ImagesViewer from "src/reusable/ImagesViewer";
import Loader from "src/reusable/Loader";
import CommentsList from "src/views/comments/CommentsList";
import CommentsQueries from "src/views/comments/CommentsQueries";
import CreateComment from "src/views/comments/CreateComment";

const ItemDetailWithComment = ({ item, onClose }) => {
  const { loading, error, data } = useSubscription(
    CommentsQueries.periodic.get,
    {
      variables: { topicId: item.id },
    }
  );

  const { t, i18n } = useTranslation();
  console.log(item);
  return (
    <div>
      <>
        <CNavbar expandable="sm" color="faded" light>
          <CNavbarBrand style={{ fontSize: "0.9rem" }}>
            <h4>{i18n.language == "ar" ? item.name : item.name_en}</h4>
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
              {/* {JSON.stringify(item)} */}
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
        <p>{item?.comment}</p>
        <CContainer style={{ paddingLeft: 35 }}>
          <CRow xs={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }}>
            <ImagesViewer images={item.images} />
          </CRow>
        </CContainer>
      </>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <CommentsList
          comments={data.comments}
          mutation={CommentsQueries.periodic.insert}
          rootVars={{ topicId: item.id }}
        />
      )}
      
    </div>
  );
};

export default ItemDetailWithComment;
