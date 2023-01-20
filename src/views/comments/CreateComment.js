import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CButton, CCard, CCardBody, CCol, CInput, CRow } from "@coreui/react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import ImageUploading from "react-images-uploading";
import Loader from "src/reusable/Loader";

const CreateComment = ({ mutation, rootVars }) => {
  const [images, setImages] = React.useState([]);
  const [comment_text, setCommentText] = React.useState();
  const { t } = useTranslation();

  const [trigger, { data, loading }] = useMutation(mutation, {
    onCompleted: () => {
      setCommentText();
    },
  });

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  if (loading) return <Loader />;
  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={10}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            {/* <div
              style={{
                margin: 10,
                textAlign: "center",
                color: "gray",
                fontSize: "x-large",
                padding: 20,
                border: "2px dashed #a2a2a2",
              }}
              onClick={onImageUpload}
              {...dragProps}
            >
              {t("clickOrDrop")}
            </div> */}
            {images.length > 0 && (
              <CButton
                style={{ marginBottom: 10 }}
                color="danger"
                onClick={onImageRemoveAll}
              >
                {t("removeAll")}
              </CButton>
            )}
            <br />
            <CRow>
              {imageList.map((image, index) => (
                <CCol key={index} md={3}>
                  <CCard style={{ height: "92%", textAlign: "center" }}>
                    <CCardBody>
                      <img src={image["data_url"]} alt="" width="100" />
                      <span
                        style={{ position: "absolute", top: 2, right: 2 }}
                        onClick={() => onImageRemove(index)}
                      >
                        <FaTrash />
                      </span>
                    </CCardBody>
                  </CCard>
                  {/* <div className=" "> */}
                  {/* <button onClick={() => onImageUpdate(index)}>Update</button> */}
                  {/* </div> */}
                </CCol>
              ))}
            </CRow>
          </div>
        )}
      </ImageUploading>
      <CRow>
        <CCol md={11} lg={11} sm={11}>
          <CInput
            className="mb-3"
            type="text"
            placeholder={t("writeAComment")}
            value={comment_text}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </CCol>
        <CCol md={1} lg={1} sm={1}>
          <CButton
            color="primary"
            size="md"
            disabled={!comment_text}
            onClick={() => {
              // run the mutation here ..
              console.log({
                ...rootVars,
                images: "",
                comment_text: comment_text,
              });
              trigger({
                variables: {
                  ...rootVars,
                  images: "",
                  comment_text: comment_text,
                },
              });
            }}
          >
            <FiSend />
            {/* {t("save")} */}
          </CButton>
        </CCol>
      </CRow>
    </div>
  );
};

export default CreateComment;
