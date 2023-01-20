import { CRow, CLabel, CFormGroup, CCol } from "@coreui/react";
import React from "react";

const TopFilter = ({ titlesArray, componentsArray }) => {
  if (titlesArray.length !== componentsArray.length)
    return <p>Miss-Configured Filter Components </p>;
  return (
    <CRow>
      {titlesArray.map((title, index) => {
        return (
          <CCol>
            <CFormGroup inline>
              <CLabel>
                <b>{title}</b>
              </CLabel>
              {componentsArray[index]}
            </CFormGroup>
          </CCol>
        );
      })}
    </CRow>
  );
};

export default TopFilter;
