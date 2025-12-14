import { initDDBClient } from "../../common/init-ddb-client.js";
import {
  BatchWriteCommand,
  BatchGetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const shardedTable = `${resourcePrefix}-sharding`;
const ddbClient = initDDBClient();
const shardSize = 5;

const saveCandidate = async (id, name) => {
  let shards = [];

  for (let shard = 0; shard <= shardSize; shard++) {
    shards.push({ PK: buildPK(id, shard), name: name, votes: 0 });
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

    const ids = shards.map((e) => e.PK).join(", ");
    console.log("Candidates saved successfully. IDs: ", ids);
  } catch (error) {
    console.error("Error saving shards:", error);
    throw error;
  }
};

const getTotalVotes = async (id) => {
  const keys = Array.from({ length: 5 }, (_, index) => ({
    PK: buildPK(id, index)
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

  console.log({
      keys
  })

    console.log(res)

  const items = res.Responses?.[shardedTable] ?? [];

  return items.reduce((sum, item) => sum + (item.votes || 0), 0);
};

const incrementVote = async (candidateId, shard) => {
  const id = buildPK(candidateId, shard);
    const votes = Math.floor(Math.random() * 1000);

  const params = {
    TableName: shardedTable,
    Key: { PK: id },
    UpdateExpression: "SET votes = votes + :votes",
    ExpressionAttributeValues: {
      ":votes": votes,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await ddbClient.send(new UpdateCommand(params));
};

export const handleSharding = async () => {
  const id = "1111";

  await saveCandidate(id, "John Smith");

  for (let i = 0; i <= shardSize; i++) {
    await incrementVote(id, i);
  }

  const votes = await getTotalVotes(id);

  console.log(`Total votes: ${votes}`);
};

const buildPK = (id, shard) => `${id}:$${shard}`

// (async () => {
//   await handleSharding();
// })();
