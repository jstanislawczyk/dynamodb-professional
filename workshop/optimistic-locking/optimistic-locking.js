import {initDDBClient} from '../../common/init-ddb-client.js';
import {PutCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
import {resourcePrefix} from '../consts.js';

const tableName =  `${resourcePrefix}-optimistic-locking`
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
        console.log("Article saved successfully:", article);
    } catch (error) {
        console.error("Error saving article:", error);
        throw error;
    }
};

const updateContent = async (currentDocument, newContent) => {
    const {id, content} = currentDocument;
    const params = {
        TableName: tableName,
        Key: id,
        UpdateExpression: "SET content = :content",
        ConditionExpression: "version = :expectedVersion",
        ExpressionAttributeValues: {
            ":expectedVersion": content.version,
            ":newContent": newContent,
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
        }
        throw err;
    }
}

(async () => {
    const document = await saveDocument();

    await Promise.allSettled([
        updateContent(document, "New version"),
        updateContent(document, "Another version"),
    ]);
})();
