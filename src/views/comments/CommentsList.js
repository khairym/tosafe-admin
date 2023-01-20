import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { FaComment } from "react-icons/fa";
import ImagesViewer from "src/reusable/ImagesViewer";
import CreateComment from "./CreateComment";

const CommentsList = ({ comments, rootVars, mutation }) => {
  const { i18n, t } = useTranslation();

  const getDate = (isoDate) => {
    let date = new Date(isoDate).toLocaleString();
    date = date
      .split(",")[0]
      .split("/")
      .map((dat) => (dat < 10 && "0" + dat) || dat);
    date = date[1] + "/" + date[0] + "/" + date[2];

    return date;
  };
  return (
    <div style={{ padding: 25 }}>
      <h5>
        <FaComment /> {t("comments")}
      </h5>
      <hr />
      {comments.map((com, index) => {
        return (
          <>
            <div className="d-flex flex-row">
              <div className="p-2">
                <div>
                  <img
                    style={{ width: 60, height: 60, borderRadius: "50%" }}
                    src={com.user.avatar}
                    alt={com.user.display_name}
                  />
                </div>
              </div>
              <div className="p-2">
                {" "}
                <div style={{ fontSize: 16 }}>{com.user.display_name}</div>
                <div className="small text-muted">
                  <span>
                    {i18n.language == "ar"
                      ? com.user.permission_group.title
                      : com.user.permission_group.title_en}
                  </span>{" "}
                  | {getDate(com.created_at)}
                </div>
                <p>{com.comment_text}</p>
              </div>
            </div>
            <ImagesViewer images={com.images.split(",")} />
          </>
        );
      })}

      <CreateComment mutation={mutation} rootVars={rootVars} />
    </div>
  );
};

export default withTranslation()(CommentsList);
