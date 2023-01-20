import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { CButton } from "@coreui/react";
import Error from "src/reusable/Error";
import Loader from "src/reusable/Loader";

import {
  GetBranchPeriodicItems,
  InsertBranchPeriodicItem,
  RemovePeriodicItem,
} from "../branch-query/BranchQueries";
import { withTranslation, useTranslation } from "react-i18next";
import { FaAccusoft, FaCheckSquare, FaClock, FaSquare } from "react-icons/fa";

const PeriodicItems = ({ id }) => {
  const { t, i18n } = useTranslation();
  const { loading, error, data, refetch } = useQuery(GetBranchPeriodicItems, {
    variables: {
      branchId: id,
    },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const selectedItems = data.items.map((c) => c.item_id);
  const filteredCategories = data.categories.filter((c) => c.items.length);
  return (
    <div>
      <ol>
        {filteredCategories.map((cat) => (
          <>
            <br />
            <h4>
              {" "}
              <FaAccusoft /> {i18n.language == "en" ? cat.name_en : cat.name}
            </h4>
            <ol>
              {cat.items.map((itm) => {
                const isInBranch = selectedItems.indexOf(itm.id) > -1;
                return (
                  <h6>
                    <AddRemovePeriodicItems
                      isInBranch={isInBranch}
                      categoryId={cat.id}
                      itemId={itm.id}
                      branchId={id}
                      refetch={refetch}
                    />{" "}
                    {i18n.language == "en" ? itm.name_en : itm.name}
                  </h6>
                );
              })}
            </ol>
          </>
        ))}
      </ol>
    </div>
  );
};

export const AddRemovePeriodicItems = ({
  isInBranch,
  categoryId,
  itemId,
  branchId,
  refetch,
}) => {
  const [onAdd, { loading: addLoading }] = useMutation(
    InsertBranchPeriodicItem,
    {
      onCompleted: (da) => {
        refetch();
      },
    }
  );

  const [onRemove, { loading: removeLoading }] = useMutation(
    RemovePeriodicItem,
    {
      onCompleted: (da) => {
        refetch();
      },
    }
  );

  return (
    <CButton
      disabled={addLoading || removeLoading}
      onClick={() => {
        if (isInBranch)
          onRemove({
            variables: {
              categoryId: categoryId,
              itemId: itemId,
              branchId: branchId,
            },
          });
        else
          onAdd({
            variables: {
              categoryId: categoryId,
              itemId: itemId,
              branchId: branchId,
            },
          });
      }}
    >
      {" "}
      {addLoading || removeLoading ? (
        <FaClock size={20} />
      ) : isInBranch ? (
        <FaCheckSquare size={20} />
      ) : (
        <FaSquare size={20} />
      )}{" "}
    </CButton>
  );
};

export default withTranslation()(PeriodicItems);
