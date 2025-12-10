import { initDDBClient } from "../common/init-ddb-client.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const buildArticle = () => {
  return {
    id: "1111",
    content: "Nested article content",
    comments: [
      {
        id: "C-1111",
        content: "First comment",
      },
      {
        id: "C-2222",
        content: "I don't like this article",
      },
      {
        id: "C-3333",
        content: "Great article!",
      },
    ],
  };
};

const saveArticle = async (article) => {
  const ddbClient = initDDBClient();
  const command = new PutCommand({
    TableName: `${resourcePrefix}-articles-nested`,
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

(async () => {
  const article = buildArticle();
  await saveArticle(article);
})();
