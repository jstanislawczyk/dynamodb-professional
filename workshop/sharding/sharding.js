import { initDDBClient } from "../../common/init-ddb-client.js";
import { BatchWriteCommand, BatchGetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const shardedTable = `${resourcePrefix}-sharded`;
const ddbClient = initDDBClient();

const saveCandidate = async (id, name) => {
    let shards = [];

    for (let shard = 0; shard < 6; shard++) {
        shards.push({ id: `${id}:$${shard}`, name: name, votes: 0 });
    }

    const saveCommentsRequests = shards.map((comment) => ({
        PutRequest: {
            Item: comment,
        },
    }));
    const command = new BatchWriteCommand({
        RequestItems: {
            [shardedTable]: saveCommentsRequests,
        },
    });

    try {
        await ddbClient.send(command);

        const ids = shards.map((e) => e.id).join(", ");
        console.log("Comments saved successfully. IDs: ", ids);
    } catch (error) {
        console.error("Error saving comments:", error);
        throw error;
    }
};

const getTotalVotes = async (id) => {
    const keys = Array.from({ length: 5 }, (_, i) => ({
        id: `${id}:${i}`
    }));

    const res = await ddbClient.send(
        new BatchGetCommand({
            RequestItems: {
                [shardedTable]: {
                    Keys: keys,
                },
            },
        })
    );

    const items = res.Responses?.[shardedTable] ?? [];

    return items.reduce((sum, item) => sum + (item.votes || 0), 0);
}

const incrementVote = async (candidateId) => {
    const shard = Math.floor(Math.random() * 6);
    const id = `${candidateId}:${shard}`;

    const params = {
        TableName: shardedTable,
        Key: { id },
        UpdateExpression: `SET votes = votes + :one`,
        ExpressionAttributeValues: {
            ":one": 1,
        },
        ReturnValues: "UPDATED_NEW",
    };

    await ddbClient.send(new UpdateCommand(params));
}

(async () => {
    const id = "1111";

    await saveCandidate(id, "John Smith");

    for (let i = 0; i < 10; i++) {
        await incrementVote(id);
    }

    const votes = await getTotalVotes();

    console.log(`Total votes: ${votes}`);
})();
