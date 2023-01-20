import gql from "graphql-tag";

const periodic_comments = gql`
  subscription getReportDiscussionCommentsMonthely($topicId: Int) {
    comments: monthely_report_comments(
      where: { item_detail_id: { _eq: $topicId } }
    ) {
      images
      created_at
      comment_text
      user {
        id
        display_name
        avatar
        permission_group {
          title_en
          title
        }
      }
    }
  }
`;

const insert_periodic_comment = gql`
  mutation insertMonthlyComment(
    $images: String!
    $comment_text: String!
    $topicId: Int!
  ) {
    insert_monthely_report_comments_one(
      object: {
        images: $images
        comment_text: $comment_text
        item_detail_id: $topicId
      }
    ) {
      id
    }
  }
`;

const risk_comments = gql`
  subscription getReportDiscussionComments($topicId: Int, $reportId: Int) {
    comments: risk_assessment_report_comments(
      where: {
        item_detail_id: { _eq: $topicId }
        report_id: { _eq: $reportId }
      }
    ) {
      images
      created_at
      comment_text
      user {
        id
        display_name
        avatar
        permission_group {
          title_en
          title
        }
      }
    }
  }
`;

const insert_risk_comment = gql`
  mutation insertComment(
    $images: String!
    $comment_text: String!
    $topicId: Int
    $reportId: Int
  ) {
    insert_risk_assessment_report_comments_one(
      object: {
        images: $images
        comment_text: $comment_text
        item_detail_id: $topicId
        report_id: $reportId
      }
    ) {
      id
    }
  }
`;

const internal_comments = gql`
  subscription getInternalReportDiscussionComments($reportId: Int) {
    comments: internal_maintainance_report_comments(
      where: { report_id: { _eq: $reportId } }
    ) {
      images
      created_at
      comment_text
      user {
        id
        display_name
        avatar
        permission_group {
          title_en
          title
        }
      }
    }
  }
`;

const insert_internal_comment = gql`
  mutation insertInternalComment(
    $images: String!
    $comment_text: String!
    $reportId: Int
  ) {
    insert_internal_maintainance_report_comments_one(
      object: {
        images: $images
        comment_text: $comment_text
        report_id: $reportId
      }
    ) {
      id
    }
  }
`;

const emergency_comments = gql`
  subscription getEmergencyReportDiscussionComments($reportId: Int) {
    comments: emergency_report_comments(
      where: { report_id: { _eq: $reportId } }
    ) {
      images
      created_at
      comment_text
      user {
        id
        display_name
        avatar
        permission_group {
          title_en
          title
        }
      }
    }
  }
`;

const insert_emergency_comment = gql`
  mutation insertEmergencyComment(
    $images: String!
    $comment_text: String!
    $reportId: Int
  ) {
    insert_emergency_report_comments_one(
      object: {
        images: $images
        comment_text: $comment_text
        report_id: $reportId
      }
    ) {
      id
    }
  }
`;

export default {
  internal: {
    insert: insert_internal_comment,
    get: internal_comments,
  },
  emergency: {
    insert: insert_emergency_comment,
    get: emergency_comments,
  },
  risk: {
    insert: insert_risk_comment,
    get: risk_comments,
  },
  periodic: {
    insert: insert_periodic_comment,
    get: periodic_comments,
  },
};
