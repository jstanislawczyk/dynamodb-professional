import { initDDBClient } from "../../common/init-ddb-client.js";
import { PutCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const tableName = `${resourcePrefix}-articles-relation`;

const buildArticle = () => {
  return {
    PK: "ARTICLE#1111",
    SK: "ARTICLE",
    content: "Relation article content",
  };
};

const buildComments = () => {
  return [
    {
      PK: "ARTICLE#1111",
      SK: "COMMENT#C-1111",
      content: "First comment",
    },
    {
      PK: "ARTICLE#1111",
      SK: "COMMENT#C-2222",
      content: "I don't like this article",
    },
    {
      PK: "ARTICLE#1111",
      SK: "COMMENT#C-3333",
      content: "Great article!",
    },
  ];
};

const saveArticle = async (article) => {
  const ddbClient = initDDBClient();
  const command = new PutCommand({
    TableName: tableName,
    Item: article,
  });

  try {
    await ddbClient.send(command);
    console.log("Article saved successfully:", article);
  } catch (error) {
    console.error("Error saving article:", error);
    throw error;
  }
};

const saveComments = async (comments) => {
  const ddbClient = initDDBClient();
  const saveCommentsRequests = comments.map((comment) => ({
    PutRequest: {
      Item: comment,
    },
  }));
  const command = new BatchWriteCommand({
    RequestItems: {
      [tableName]: saveCommentsRequests,
    },
  });

  try {
    await ddbClient.send(command);

    const ids = comments.map((e) => e.id).join(", ");
    console.log("Comments saved successfully. IDs: ", ids);
  } catch (error) {
    console.error("Error saving comments:", error);
    throw error;
  }
};

(async () => {
  const article = buildArticle();
  const comments = buildComments();

  await saveArticle(article);
  await saveComments(comments);
})();
