import { CCol, CContainer, CRow } from "@coreui/react";
import ImageViewer from "react-simple-image-viewer";
import React, { useCallback, useState } from "react";

const ImagesViewer = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div>
      <CContainer style={{ paddingLeft: 35 }}>
        {images ? (
          <CRow xs={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }}>
            {images.map(
              (img, index) =>
                img.includes("http") && (
                  <CCol md={3}>
                    <img
                      height={120}
                      width={120}
                      style={{ margin: "2px" }}
                      onClick={() => openImageViewer(index)}
                      key={`img__${index}`}
                      src={img}
                    />
                  </CCol>
                )
            )}
          </CRow>
        ) : (
          <p>No Images Available</p>
        )}
      </CContainer>
      {isViewerOpen && (
        <ImageViewer
          style={{ zIndex: 6767778 }}
          src={images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
};

export default ImagesViewer;
