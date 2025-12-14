import { initDDBClient } from "../../common/init-ddb-client.js";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const tableName = `${resourcePrefix}-optimistic-locking`;
const ddbClient = initDDBClient();

const saveDocument = async () => {
  const document = {
    id: "1111",
    version: 1,
    content: "First version",
  };
  const command = new PutCommand({
    TableName: tableName,
    Item: document,
  });

  try {
    await ddbClient.send(command);
    console.log("Document saved successfully:", document);
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }

  return document;
};

const updateContent = async (currentDocument, newContent) => {
  const { id, version } = currentDocument;
  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: "SET content = :newContent, version = version + :one",
    ConditionExpression: "version = :expectedVersion",
    ExpressionAttributeValues: {
      ":expectedVersion": version,
      ":newContent": newContent,
      ":one": 1,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await ddbClient.send(new UpdateCommand(params));

    console.log("Updated content");
    return result.Attributes;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      console.log("Version mismatch — concurrent modification detected.");
      return;
    }
    throw err;
  }
};

export const handleOptimisticLocking = async () => {
  const document = await saveDocument();

  await Promise.all([
    updateContent(document, "New version"),
    updateContent(document, "Another version"),
  ]);
};

// (async () => {
//   await handleOptimisticLocking();
// })();
